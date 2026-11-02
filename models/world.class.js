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

    // setWorld() {
    //     this.character.world = this;
    //     this.character.animate();

    //     const endboss = this.level.enemies.find(
    //         enemy => enemy instanceof Endboss
    //     );

    //     this.level.enemies.forEach(enemy => {
    //         enemy.world = this;
    //     });

    //     if (endboss) {
    //         endboss.world = this;
    //     }
    // }

    setWorld() {
        this.setCharacterWorld();
        this.setEnemiesWorld();
    }

    setCharacterWorld() {
        this.character.world = this;
    }

    setEnemiesWorld() {
        this.level.enemies.forEach(enemy => {
            enemy.world = this;
        });
    }
    
    draw() {
        this.clearCanvas();

        if (this.drawResultScreen()) {
            this.requestNextFrame();
            return;
        }

        this.drawGameScene();
        this.requestNextFrame();
    }

    clearCanvas() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }

    drawResultScreen() {
        if (!this.gameWon && !this.gameLost) return false;
        document.getElementById("replay-button").style.display = "block";
        const image = this.gameWon ? this.winImage : this.loseImage;
        this.drawResultImage(image);
        return true;
    }

    drawResultImage(image) {
        if (!image.complete || image.naturalWidth === 0) return;
        this.ctx.drawImage(image, 0, 0, this.canvas.width, this.canvas.height);
    }

    drawGameScene() {
        this.drawBackground();
        this.drawStatusBars();
        this.drawGameObjects();
    }

    drawBackground() {
        this.ctx.translate(this.camera_x, 0);
        this.addObjecttoMap(this.level.backgroundObjects);
        this.ctx.translate(-this.camera_x, 0);
    }

    drawStatusBars() {
        this.addToMap(this.lifeStatusBar);
        this.addToMap(this.coinStatusBar);
        this.addToMap(this.BubblesStatusBar);
    }

    drawGameObjects() {
        this.ctx.translate(this.camera_x, 0);
        this.addToMap(this.character);
        this.addObjecttoMap(this.level.enemies);
        this.addObjecttoMap(this.level.coins);
        this.addObjecttoMap(this.level.bubbles);
        this.addObjecttoMap(this.throwableObjects);
        this.ctx.translate(-this.camera_x, 0);
    }

    requestNextFrame() {
        requestAnimationFrame(() => this.draw());
    }

    // run() {
    //     setInterval(() => {

    //         this.checkFinAttack();
    //         this.checkCollisions();

    //         if (this.character.isDead()) {
    //             if (!this.deadSoundStarted) {
    //                 this.deadSoundStarted = true;
    //                 // stopGameBgm();
    //                 stopAllBgm();
    //                 this.deadSound.currentTime = 0;
    //                 this.deadSound.play().catch(error => {
    //                     console.error("Could not play dead sound:", error);
    //                 });
    //             }

    //             if (this.character.deadAnimationFinished) {
    //                 stopGameBgm();
    //                 this.gameLost = true;
    //             }
    //             return;
    //         }
    //         this.checkThrowObject();
    //     }, 200);
    // }

    run() {
        setInterval(() => this.runGameStep(), 200);
    }

    runGameStep() {
        this.checkFinAttack();
        this.checkCollisions();
        if (this.handleCharacterDeath()) return;
        this.checkThrowObject();
    }

    handleCharacterDeath() {
        if (!this.character.isDead()) return false;
        this.playDeadSoundOnce();
        if (this.character.deadAnimationFinished) {
            stopGameBgm();
            this.gameLost = true;
        }
        return true;
    }

    playDeadSoundOnce() {
        if (this.deadSoundStarted) return;
        this.deadSoundStarted = true;
        stopAllBgm();
        this.deadSound.currentTime = 0;
        this.deadSound.play().catch(error => {
            console.error("Could not play dead sound:", error);
        });
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
        if (this.throwKeyWasPressed) return;
        this.throwKeyWasPressed = true;
        this.throwBubbleIfAvailable();
    }

    throwBubbleIfAvailable() {
        if (this.collectedBubbles <= 0) return;
        this.character.playBossAttack();
        const position = this.getBubblePosition();
        this.addThrowableBubble(position);
        this.useCollectedBubble();
    }

    getBubblePosition() {
        const direction = this.character.otherDirection ? -1 : 1;
        const x = direction === 1
            ? this.character.x + this.character.width - 20
            : this.character.x - 60;
        return { x, y: this.character.y + 120, direction };
    }

    addThrowableBubble(position) {
        setTimeout(() => {
            const bubble = new ThrowableObject(
                position.x, position.y, position.direction
            );
            this.throwableObjects.push(bubble);
        }, 700);
    }

    useCollectedBubble() {
        this.collectedBubbles--;
        const percentage =
            (this.collectedBubbles / this.totalBubbles) * 100;
        this.BubblesStatusBar.setPercentage(percentage);
    }

    checkCollisions() {
        this.checkEnemyCollisions();
        this.checkEndbossCollisions();
        this.checkCoinCollisions();
        this.checkBubbleCollisions();
    }

    checkEnemyCollisions() {
        for (let i = this.level.enemies.length - 1; i >= 0; i--) {
            const enemy = this.level.enemies[i];
            if (enemy.dead) continue;
            if (this.checkFinAttackCollision(enemy)) continue;
            if (!this.character.isColliding(enemy)) continue;
            if (this.isEnemyStomp(enemy)) {
                enemy.die();
                this.character.jump();
                this.removeEnemyAfterDelay(enemy);
            } else {
                this.damageCharacter();
            }
        }
    }

    checkFinAttackCollision(enemy) {
        if (enemy instanceof Endboss) return false;
        if (!this.character.finAttackActive) return false;
        if (this.character.finAttackHits.has(enemy)) return false;
        if (!this.character.isFinSlapColliding(enemy)) return false;
        this.character.finAttackHits.add(enemy);
        enemy.die();
        this.removeEnemyAfterDelay(enemy);
        return true;
    }

    isEnemyStomp(enemy) {
        const canStomp =
            enemy instanceof PufferFish || enemy instanceof Jellyfish;

        return canStomp && this.keyboard.DOWN;
    }

    removeEnemyAfterDelay(enemy) {
        setTimeout(() => this.removeEnemy(enemy), 500);
    }

    removeEnemy(enemy) {
        const index = this.level.enemies.indexOf(enemy);
        if (index !== -1) this.level.enemies.splice(index, 1);
    }

    damageCharacter() {
        this.character.hit();
        this.playHurtSound();
        this.lifeStatusBar.setPercentage(this.character.energy);
    }

    playHurtSound() {
        this.hurtSound.currentTime = 0;
        this.hurtSound.play().catch(error => {
            console.error("Could not play hurt sound:", error);
        });
    }

    checkEndbossCollisions() {
        const boss = this.level.enemies.find(
            enemy => enemy instanceof Endboss
        );
        if (!boss || boss.defeated) return;
        for (let i = this.throwableObjects.length - 1; i >= 0; i--) {
            if (this.hitEndbossWithBubble(boss, i)) break;
        }
    }

    hitEndbossWithBubble(boss, index) {
        const bubble = this.throwableObjects[index];
        if (!bubble.isColliding(boss)) return false;
        this.throwableObjects.splice(index, 1);
        if (!boss.hitByBubbles()) return false;
        setTimeout(() => this.finishEndboss(boss), 1500);
        return true;
    }

    finishEndboss(boss) {
        this.removeEnemy(boss);
        setTimeout(() => this.showWinScreen(), 600);
    }

    showWinScreen() {
        this.gameWon = true;
        startWinningBgm();
    }

    checkCoinCollisions() {
        for (let i = this.level.coins.length - 1; i >= 0; i--) {
            const coin = this.level.coins[i];
            if (this.character.isColliding(coin)) this.collectCoin(coin, i);
        }
    }

    collectCoin(coin, index) {
        this.level.coins.splice(index, 1);
        this.collectedCoins++;
        this.playCoinSound();
        this.updateCoinStatus();
    }

    playCoinSound() {
        this.coinSound.currentTime = 0;
        this.coinSound.play().catch(error => {
            console.error("Could not play coin sound:", error);
        });
    }

    updateCoinStatus() {
        const percentage = (this.collectedCoins / this.totalCoins) * 100;
        this.coinStatusBar.setPercentage(percentage);
    }

    checkBubbleCollisions() {
        for (let i = this.level.bubbles.length - 1; i >= 0; i--) {
            const bubble = this.level.bubbles[i];
            if (!this.character.isColliding(bubble)) continue;
            if (this.collectedBubbles >= this.totalBubbles) continue;
            this.collectBubble(bubble, i);
        }
    }

    collectBubble(bubble, index) {
        this.level.bubbles.splice(index, 1);
        this.collectedBubbles++;
        this.playBubbleSound();
        this.countPoisonBubble(bubble);
        this.updateBubbleStatus();
    }

    playBubbleSound() {
        this.bubbleSound.currentTime = 0;
        this.bubbleSound.play().catch(error => {
            console.error("Could not play bubble sound:", error);
        });
    }

    countPoisonBubble(bubble) {
        if (!bubble.isPoisoned) return;
        this.collectedPoisonBubbles++;
        console.log("Poison bubbles collected:", this.collectedPoisonBubbles);
    }

    updateBubbleStatus() {
        const percentage = (this.collectedBubbles / this.totalBubbles) * 100;
        this.BubblesStatusBar.setPercentage(percentage);
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