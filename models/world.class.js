class World {

    character = new Character();
    level = level1;

    canvas;
    ctx;
    keyboard;
    camera_x = 0;
    lifeStatusBar = new LifeStatusBar();
    coinStatusBar = new CoinStatusBar();

    collectedCoins = 0;
    totalCoins = this.level.coins.length;

    collectedBottles = 0;
    totalBottles = this.level.bottles.length;

    bottleStatusBar = new BottleStatusBar();
    throwableObjects = [];
    throwKeyWasPressed = false;

    gameWon = false;
    winImage = new Image();
    gameLost = false;
    loseImage = new Image();

    collectedPoisonBubbles = 0;

    replyShownAt = null;
    dPressedAfterReply = false;

    constructor(canvas, keyboard) {
        this.ctx = canvas.getContext("2d");
        this.canvas = canvas;
        this.keyboard = keyboard;
        this.winImage.src = './images/Grafiken-Sharkie/6.Botones/Tittles/You win/Mesa de trabajo 1.png';
        this.loseImage.src = './images/Grafiken-Sharkie/6.Botones/Tittles/Game Over/Recurso 9.png';
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
        this.addToMap(this.bottleStatusBar);
        this.ctx.translate(this.camera_x, 0); //forward

        this.addToMap(this.character);
        this.addObjecttoMap(this.level.enemies);
        this.addObjecttoMap(this.level.coins);
        this.addObjecttoMap(this.level.bottles);
        this.addObjecttoMap(this.throwableObjects);

        this.ctx.translate(-this.camera_x, 0);
        // draw wird immer wieder aufrufen, damit die Position des Charakters immer wieder neu gezeichnet wird.
        requestAnimationFrame(() => this.draw());
    }

    run() {
        setInterval(() => {

            // check collisions
            this.checkCollisions();
            if (this.character.isDead()) {
                if (this.character.deadAnimationFinished) {
                    this.gameLost = true;
                }
                return;
            }
            this.checkThrowObject();
        }, 200);
    }

    checkThrowObject() {
        if (!this.keyboard.D) {
            this.throwKeyWasPressed = false;
            return;
        }

        // D key press-ku okka bottle maatrame throw avuthundi.
        if (this.throwKeyWasPressed) {
            return;
        }

        this.throwKeyWasPressed = true;

        // Bottles collect chesi unte maatrame throw cheyyali.
        if (this.collectedBottles > 0) {
            this.character.playBossAttack();
            const direction = this.character.otherDirection ? -1 : 1;
            const bottleX = direction === 1
                ? this.character.x + this.character.width - 20
                : this.character.x - 60;
            const bottleY = this.character.y + 120;

            setTimeout(() => {
                const bubble = new ThrowableObject(
                    bottleX,
                    bottleY,
                    direction
                );
                this.throwableObjects.push(bubble);
            }, 700);

            this.collectedBottles--;

            const percentage =
                (this.collectedBottles / this.totalBottles) * 100;
            this.bottleStatusBar.setPercentage(percentage);
        }
    }

    checkCollisions() {
        for (let i = this.level.enemies.length - 1; i >= 0; i--) {
            const enemy = this.level.enemies[i];

            if (enemy.dead || !this.character.isColliding(enemy)) {
                continue;
            }

            const characterBottom = this.character.y + this.character.height;
            const isStomping =
                enemy instanceof Chicken &&
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
                this.lifeStatusBar.setPercentage(this.character.energy);
            }
        }

        const endboss = this.level.enemies.find(
            (enemy) => enemy instanceof Endboss
        );

        if (endboss && !endboss.defeated) {

            for (let i = this.throwableObjects.length - 1; i >= 0; i--) {
                const bottle = this.throwableObjects[i];

                if (bottle.isColliding(endboss)) {
                    this.throwableObjects.splice(i, 1);

                    if (endboss.hitByBottle()) {
                        setTimeout(() => {
                            const bossIndex = this.level.enemies.indexOf(endboss);

                            if (bossIndex !== -1) {
                                this.level.enemies.splice(bossIndex, 1);
                            }
                            setTimeout(() => {
                                this.gameWon = true;
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

                const percentage = (this.collectedCoins / this.totalCoins) * 100;
                this.coinStatusBar.setPercentage(percentage);
            }
        }

        for (let i = this.level.bottles.length - 1; i >= 0; i--) {
            const bottle = this.level.bottles[i];

            if (
                this.character.isColliding(bottle) &&
                this.collectedBottles < this.totalBottles
            ) {
                this.level.bottles.splice(i, 1);
                this.collectedBottles++;

                if (bottle.isPoisoned) {
                    this.collectedPoisonBubbles++;
                    console.log('Poison bubbles collected:', this.collectedPoisonBubbles);
                }

                const percentage =
                    (this.collectedBottles / this.totalBottles) * 100;

                this.bottleStatusBar.setPercentage(percentage);
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