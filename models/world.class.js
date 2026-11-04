/**
 * Manages the game world, including the character, level, input,
 * collisions, rendering, and game state.
 *
 * @extends WorldInteractions
 */
class World extends WorldInteractions {
    /** The player character. */
    character = new Character();

    /** The current game level. */
    level = level1;

    /** Canvas used to render the game. */
    canvas;

    /** 2D rendering context for the game canvas. */
    ctx;

    /** Keyboard input state. */
    keyboard;

    /** Horizontal camera offset. */
    camera_x = 0;

    /** Status bar displaying the character's life. */
    lifeStatusBar = new LifeStatusBar();

    /** Status bar displaying collected coins. */
    coinStatusBar = new CoinStatusBar();

    /** Number of coins collected by the character. */
    collectedCoins = 0;

    /** Total number of coins in the current level. */
    totalCoins = this.level.coins.length;

    /** Number of bubbles currently available to throw. */
    collectedBubbles = 0;

    /** Total number of collectible bubbles in the current level. */
    totalBubbles = this.level.bubbles.length;

    /** Status bar displaying collected bubbles. */
    BubblesStatusBar = new BubblesStatusBar();

    /** Poison bubbles currently thrown by the character. */
    throwableObjects = [];

    /** Tracks whether the throw key was already handled. */
    throwKeyWasPressed = false;

    /** Whether the player has won the game. */
    gameWon = false;

    /** Image displayed when the player wins. */
    winImage = new Image();

    /** Whether the player has lost the game. */
    gameLost = false;

    /** Image displayed when the player loses. */
    loseImage = new Image();

    /** Number of poison bubbles collected for the Endboss encounter. */
    collectedPoisonBubbles = 0;

    /** Tracks whether the fin-attack key was already handled. */
    finKeyWasPressed = false;

    /** Sound played when a coin is collected. */
    coinSound = new Audio("./assets/audio/coin.mp3");

    /** Sound played when a bubble is collected. */
    bubbleSound = new Audio("./assets/audio/bubble.mp3");

    /** Sound played when the character is hurt. */
    hurtSound = new Audio("./assets/audio/hurt.mp3");

    /** Sound used during the Endboss fight. */
    fightSound = new Audio("./assets/audio/fight.mp3");

    /** Whether the character's death sound has started playing. */
    deadSoundStarted = false;

    /** Sound played when an enemy is defeated. */
    enemyHitSound = new Audio("./assets/audio/enemies_hit.mp3");

    /** Sound played when the character dies. */
    deadSound = new Audio("./assets/audio/dead.mp3");

    /** Timestamp associated with the Endboss reply. */
    replyShownAt = null;

    /** Whether the D key was pressed after the Endboss reply. */
    dPressedAfterReply = false;

    /**
     * Initializes the game world with a canvas and keyboard input,
     * sets up images and audio, then starts rendering and game updates.
     *
     * @param {HTMLCanvasElement} canvas - Canvas used to display the game.
     * @param {Keyboard} keyboard - Current keyboard input state.
     */
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
        this.enemyHitSound.volume = 0.3;
        this.setWorld();
        this.renderer = new WorldRenderer(this);
        this.renderer.draw();
        this.run();
    }

    /** Assigns this world to the character and all level enemies. */
    setWorld() {
        this.setCharacterWorld();
        this.setEnemiesWorld();
    }

    /** Connects the character to this world instance. */
    setCharacterWorld() {
        this.character.world = this;
    }

    /** Connects each enemy in the current level to this world instance. */
    setEnemiesWorld() {
        this.level.enemies.forEach(enemy => {
            enemy.world = this;
        });
    }

    /** Starts the repeating game update loop. */
    run() {
        setInterval(() => this.runGameStep(), 200);
    }

    /**
     * Runs one game update step, checking attacks, collisions,
     * character death, and throw input.
     */
    runGameStep() {
        this.checkFinAttack();
        this.checkCollisions();
        if (this.handleCharacterDeath()) return;
        this.checkThrowObject();
    }

    /**
     * Handles the character's death state and updates the game-loss state
     * after the death animation finishes.
     *
     * @returns {boolean} True if the character is dead.
     */
    handleCharacterDeath() {
        if (!this.character.isDead()) return false;
        this.playDeadSoundOnce();
        if (this.character.deadAnimationFinished) {
            stopGameBgm();
            this.gameLost = true;
        }
        return true;
    }

    /** Stops other sounds and plays the character's death sound once. */
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

    /** Starts a fin attack once per press of the Space key. */
    checkFinAttack() {
        if (!this.keyboard.SPACE) {
            this.finKeyWasPressed = false;
            return;
        }

        if (this.finKeyWasPressed) return;

        this.finKeyWasPressed = true;
        this.character.startFinAttack();
    }

    /** Checks for a new D-key press and attempts to throw a bubble. */
    checkThrowObject() {
        if (!this.keyboard.D) {
            this.throwKeyWasPressed = false;
            return;
        }
        if (this.throwKeyWasPressed) return;
        this.throwKeyWasPressed = true;
        this.throwBubbleIfAvailable();
    }

    /** Throws a bubble if the character has one available. */
    throwBubbleIfAvailable() {
        if (this.collectedBubbles <= 0) return;
        this.character.playBossAttack();
        const position = this.getBubblePosition();
        this.addThrowableBubble(position);
        this.useCollectedBubble();
    }

    /**
     * Calculates the starting position and direction for a thrown bubble.
     *
     * @returns {{x: number, y: number, direction: number}} Bubble launch details.
     */
    getBubblePosition() {
        const direction = this.character.otherDirection ? -1 : 1;
        const x = direction === 1
            ? this.character.x + this.character.width - 20
            : this.character.x - 60;
        return { x, y: this.character.y + 120, direction };
    }

    /**
     * Creates and adds a throwable bubble after a short delay.
     *
     * @param {{x: number, y: number, direction: number}} position - Bubble launch details.
     */
    addThrowableBubble(position) {
        setTimeout(() => {
            const bubble = new ThrowableObject(
                position.x, position.y, position.direction
            );
            this.throwableObjects.push(bubble);
        }, 700);
    }

    /** Decreases the available bubble count and updates its status bar. */
    useCollectedBubble() {
        this.collectedBubbles--;
        const percentage =
            (this.collectedBubbles / this.totalBubbles) * 100;
        this.BubblesStatusBar.setPercentage(percentage);
    }
}