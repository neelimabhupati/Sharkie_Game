class World {

    character = new Character();
    level = level1;

    canvas;
    ctx;
    keyboard;

    // gameStarted = false;

    camera_x = 0;
    lifeStatusBar = new LifeStatusBar();
    coinStatusBar = new CoinStatusBar();

    collectedCoins = 0;
    totalCoins = this.level.coins.length;

    collectedBubbles = 0;
    totalBubbles = this.level.bubbles.length;

    BubblesStatusBar = new BubblesStatusBar();
    throwableObjects = [];
    throwKeyWasPressed = false;

    gameWon = false;
    winImage = new Image();
    gameLost = false;
    loseImage = new Image();

    collectedPoisonBubbles = 0;
    finKeyWasPressed = false;

    coinSound = new Audio(
        "./images/Grafiken-Sharkie/7.Sound track/coin.mp3"
    );
    bubbleSound = new Audio(
        "./images/Grafiken-Sharkie/7.Sound track/bubble.mp3"
    );
    hurtSound = new Audio(
        "./images/Grafiken-Sharkie/7.Sound track/hurt.mp3"
    );

    deadSoundStarted = false;

    deadSound = new Audio(
        "./images/Grafiken-Sharkie/7.Sound track/dead.mp3"
    );

    replyShownAt = null;
    dPressedAfterReply = false;

    constructor(canvas, keyboard) {
        this.ctx = canvas.getContext("2d");
        this.canvas = canvas;
        this.keyboard = keyboard;
        this.winImage.src = './images/Grafiken-Sharkie/6.Botones/Tittles/You win/Mesa de trabajo 1.png';
        this.loseImage.src = './images/Grafiken-Sharkie/6.Botones/Tittles/Game Over/you lost the game.png';
        this.coinSound.volume = 0.2;
        this.bubbleSound.volume = 0.2;
        this.hurtSound.volume = 0.3;
        this.deadSound.volume = 1;
        this.draw();
        this.setWorld();
        this.run();
    }

    setWorld() {
        this.character.world = this;
        this.character.animate();

        const endboss = this.level.enemies.find(
            enemy => enemy instanceof Endboss
        );

        this.level.enemies.forEach(enemy => {
            enemy.world = this;
        });

        if (endboss) {
            endboss.world = this;
        }
    }

    draw() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        if (this.gameWon || this.gameLost) {
            document.getElementById('replay-button').style.display =
                (this.gameWon || this.gameLost) ? 'block' : 'none';

            const resultImage = this.gameWon ? this.winImage : this.loseImage;


            if (resultImage.complete && resultImage.naturalWidth > 0) {
                this.ctx.drawImage(
                    resultImage,
                    0,
                    0,
                    this.canvas.width,
                    this.canvas.height
                );
            }

            requestAnimationFrame(() => this.draw());
            return;
        }

        this.ctx.translate(this.camera_x, 0);
        this.addObjecttoMap(this.level.backgroundObjects);

        this.ctx.translate(-this.camera_x, 0); //back

        //space for fixed object
        this.addToMap(this.lifeStatusBar);
        this.addToMap(this.coinStatusBar);
        this.addToMap(this.BubblesStatusBar);
        this.ctx.translate(this.camera_x, 0); //forward

        this.addToMap(this.character);
        this.addObjecttoMap(this.level.enemies);
        this.addObjecttoMap(this.level.coins);
        this.addObjecttoMap(this.level.bubbles);
        this.addObjecttoMap(this.throwableObjects);

        this.ctx.translate(-this.camera_x, 0);
        // draw wird immer wieder aufrufen, damit die Position des Charakters immer wieder neu gezeichnet wird.
        requestAnimationFrame(() => this.draw());
    }

    run() {
        setInterval(() => {

            this.checkFinAttack();
            this.checkCollisions();

            if (this.character.isDead()) {
                if (!this.deadSoundStarted) {
                    this.deadSoundStarted = true;
                    // stopGameBgm();
                    stopAllBgm();
                    this.deadSound.currentTime = 0;
                    this.deadSound.play().catch(error => {
                        console.error("Could not play dead sound:", error);
                    });
                }

                if (this.character.deadAnimationFinished) {
                    stopGameBgm();
                    this.gameLost = true;
                }
                return;
            }
            this.checkThrowObject();
        }, 200);
    }

    checkFinAttack() {
        if (!this.keyboard.SPACE) {
            this.finKeyWasPressed = false;
            return;
        }

        if (this.finKeyWasPressed) return;

        this.finKeyWasPressed = true;
        this.character.startFinAttack();
    }

    checkThrowObject() {
        if (!this.keyboard.D) {
            this.throwKeyWasPressed = false;
            return;
        }

        // D key press-ku okka Bubbles maatrame throw avuthundi.
        if (this.throwKeyWasPressed) {
            return;
        }

        this.throwKeyWasPressed = true;

        // Bubbles collect chesi unte maatrame throw cheyyali.
        if (this.collectedBubbles > 0) {
            this.character.playBossAttack();
            const direction = this.character.otherDirection ? -1 : 1;
            const BubblesX = direction === 1
                ? this.character.x + this.character.width - 20
                : this.character.x - 60;
            const BubblesY = this.character.y + 120;

            setTimeout(() => {
                const bubble = new ThrowableObject(
                    BubblesX,
                    BubblesY,
                    direction
                );
                this.throwableObjects.push(bubble);
            }, 700);

            this.collectedBubbles--;

            const percentage =
                (this.collectedBubbles / this.totalBubbles) * 100;
            this.BubblesStatusBar.setPercentage(percentage);
        }
    }

    checkCollisions() {
        for (let i = this.level.enemies.length - 1; i >= 0; i--) {
            const enemy = this.level.enemies[i];

            if (enemy.dead) {
                continue;
            }

            if (
                !(enemy instanceof Endboss) &&
                this.character.finAttackActive &&
                !this.character.finAttackHits.has(enemy) &&
                this.character.isFinSlapColliding(enemy)
            ) {
                this.character.finAttackHits.add(enemy);
                enemy.die();

                setTimeout(() => {
                    const enemyIndex = this.level.enemies.indexOf(enemy);

                    if (enemyIndex !== -1) {
                        this.level.enemies.splice(enemyIndex, 1);
                    }
                }, 500);

                continue;
            }

            if (!this.character.isColliding(enemy)) {
                continue;
            }

            const characterBottom = this.character.y + this.character.height;
            const isStomping =
                enemy instanceof PufferFish &&
                this.character.speedY < 0 &&
                characterBottom < enemy.y + enemy.height / 2;

            if (isStomping) {
                enemy.die();
                this.character.jump();

                setTimeout(() => {
                    const enemyIndex = this.level.enemies.indexOf(enemy);
                    if (enemyIndex !== -1) {
                        this.level.enemies.splice(enemyIndex, 1);
                    }
                }, 500);

            } else {
                this.character.hit();
                this.hurtSound.currentTime = 0;
                this.hurtSound.play().catch(error => {
                    console.error("Could not play hurt sound:", error);
                });
                this.lifeStatusBar.setPercentage(this.character.energy);
            }
        }

        const endboss = this.level.enemies.find(
            (enemy) => enemy instanceof Endboss
        );

        if (endboss && !endboss.defeated) {

            for (let i = this.throwableObjects.length - 1; i >= 0; i--) {
                const Bubbles = this.throwableObjects[i];

                if (Bubbles.isColliding(endboss)) {
                    this.throwableObjects.splice(i, 1);

                    if (endboss.hitByBubbles()) {
                        setTimeout(() => {
                            const bossIndex = this.level.enemies.indexOf(endboss);

                            if (bossIndex !== -1) {
                                this.level.enemies.splice(bossIndex, 1);
                            }
                            setTimeout(() => {
                                this.gameWon = true;
                                startWinningBgm();
                            }, 600);
                        }, 1500);

                        break;
                    }
                }
            }
        }

        for (let i = this.level.coins.length - 1; i >= 0; i--) {
            const coin = this.level.coins[i];

            if (this.character.isColliding(coin)) {
                this.level.coins.splice(i, 1);
                this.collectedCoins++;
                this.coinSound.currentTime = 0;
                this.coinSound.play().catch(error => {
                    console.error("Could not play coin sound:", error);
                });

                const percentage = (this.collectedCoins / this.totalCoins) * 100;
                this.coinStatusBar.setPercentage(percentage);
            }
        }

        for (let i = this.level.bubbles.length - 1; i >= 0; i--) {
            const Bubbles = this.level.bubbles[i];

            if (
                this.character.isColliding(Bubbles) &&
                this.collectedBubbles < this.totalBubbles
            ) {
                this.level.bubbles.splice(i, 1);
                this.collectedBubbles++;

                this.bubbleSound.currentTime = 0;
                this.bubbleSound.play().catch(error => {
                    console.error("Could not play bubble sound:", error);
                });

                if (Bubbles.isPoisoned) {
                    this.collectedPoisonBubbles++;
                    console.log('Poison bubbles collected:', this.collectedPoisonBubbles);
                }

                const percentage =
                    (this.collectedBubbles / this.totalBubbles) * 100;

                this.BubblesStatusBar.setPercentage(percentage);
            }
        }
    }
    addObjecttoMap(Objects) {
        Objects.forEach((object) => {
            this.addToMap(object);
        });
    }

    addToMap(mo) {
        if (mo.otherDirection) {
            this.flipImage(mo)
        }

        mo.draw(this.ctx);
        mo.drawFrame(this.ctx);

        if (mo.otherDirection) {
            this.flipImageBack(mo);
        }
    }

    flipImage(mo) {
        this.ctx.save();
        this.ctx.translate(2 * mo.x + mo.width, 0);
        this.ctx.scale(-1, 1);
    }

    flipImageBack() {
        this.ctx.restore();
    }

}