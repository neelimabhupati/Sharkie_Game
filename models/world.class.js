class World extends WorldInteractions {

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
        "./assets/audio/coin.mp3"
    );
    bubbleSound = new Audio(
        "./assets/audio/bubble.mp3"
    );
    hurtSound = new Audio(
        "./assets/audio/hurt.mp3"
    );

    fightSound = new Audio(
        "./assets/audio/fight.mp3"
    );

    deadSoundStarted = false;

    deadSound = new Audio(
        "./assets/audio/dead.mp3"
    );

    replyShownAt = null;
    dPressedAfterReply = false;

    constructor(canvas, keyboard) {
        super();
        this.ctx = canvas.getContext("2d");
        this.canvas = canvas;
        this.keyboard = keyboard;
        this.winImage.src = './images/Grafiken-Sharkie/6.Botones/Tittles/You win/Mesa de trabajo 1.png';
        this.loseImage.src = './images/Grafiken-Sharkie/6.Botones/Tittles/Game Over/you lost the game.png';
        this.coinSound.volume = 0.2;
        this.bubbleSound.volume = 0.2;
        this.hurtSound.volume = 0.3;
        this.deadSound.volume = 1;
        this.setWorld();
        this.renderer = new WorldRenderer(this);
        this.renderer.draw();
        this.run();
    }

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
        this.stopHurtSound();
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

}