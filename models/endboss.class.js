/**
 * Represents the final boss in the game.
 * The boss waits for the player, introduces itself, attacks, takes damage,
 * and eventually dies after being hit by poison bubbles.
 *
 * @extends MovableObject
 */
class Endboss extends MovableObject {

    /** Boss height in pixels. */
    height = 600;

    /** Boss width in pixels. */
    width = 250;

    /** Vertical position of the boss on the screen. */
    y = -130;

    /** Number of times the boss has been hit. */
    hits = 0;

    /** Whether the boss has been defeated. */
    defeated = false;

    /** Timestamp until which the boss should remain in hurt state. */
    hurtUntil = 0;

    /** World instance the boss belongs to. */
    world;

    /** Timestamp when the dialogue message was first shown. */
    messageShownAt = null;

    /** Whether the intro animation has started. */
    introStarted = false;

    /** Whether the intro animation has finished. */
    introFinished = false;

    /** Current frame index of the intro animation. */
    introFrame = 0;

    /** Current phase of the boss: waiting, introduce, floating, or attack. */
    phase = "waiting";

    /** Current attack animation frame. */
    attackFrame = 0;

    /** Timestamp when the current phase should end. */
    phaseEndsAt = 0;

    /** Walking animation images for the boss. */
    IMAGES_WALKING = [
        './images/Grafiken-Sharkie/2.Enemy/3 Final Enemy/2.floating/1.png',
        './images/Grafiken-Sharkie/2.Enemy/3 Final Enemy/2.floating/2.png',
        './images/Grafiken-Sharkie/2.Enemy/3 Final Enemy/2.floating/3.png',
        './images/Grafiken-Sharkie/2.Enemy/3 Final Enemy/2.floating/4.png',
        './images/Grafiken-Sharkie/2.Enemy/3 Final Enemy/2.floating/5.png',
        './images/Grafiken-Sharkie/2.Enemy/3 Final Enemy/2.floating/6.png',
        './images/Grafiken-Sharkie/2.Enemy/3 Final Enemy/2.floating/7.png',
        './images/Grafiken-Sharkie/2.Enemy/3 Final Enemy/2.floating/8.png',
        './images/Grafiken-Sharkie/2.Enemy/3 Final Enemy/2.floating/9.png',
        './images/Grafiken-Sharkie/2.Enemy/3 Final Enemy/2.floating/10.png',
        './images/Grafiken-Sharkie/2.Enemy/3 Final Enemy/2.floating/11.png',
        './images/Grafiken-Sharkie/2.Enemy/3 Final Enemy/2.floating/12.png',
        './images/Grafiken-Sharkie/2.Enemy/3 Final Enemy/2.floating/13.png'
    ];

    /** Hurt animation images for the boss. */
    IMAGES_HURT = [
        './images/Grafiken-Sharkie/2.Enemy/3 Final Enemy/Hurt/1.png',
        './images/Grafiken-Sharkie/2.Enemy/3 Final Enemy/Hurt/2.png',
        './images/Grafiken-Sharkie/2.Enemy/3 Final Enemy/Hurt/3.png',
        './images/Grafiken-Sharkie/2.Enemy/3 Final Enemy/Hurt/4.png'
    ];

    /** Death animation images for the boss. */
    IMAGES_DEAD = [
        './images/Grafiken-Sharkie/2.Enemy/3 Final Enemy/Dead/Mesa de trabajo 2.png',
        './images/Grafiken-Sharkie/2.Enemy/3 Final Enemy/Dead/Mesa de trabajo 2 copia 6.png',
        './images/Grafiken-Sharkie/2.Enemy/3 Final Enemy/Dead/Mesa de trabajo 2 copia 7.png',
        './images/Grafiken-Sharkie/2.Enemy/3 Final Enemy/Dead/Mesa de trabajo 2 copia 8.png',
        './images/Grafiken-Sharkie/2.Enemy/3 Final Enemy/Dead/Mesa de trabajo 2 copia 9.png',
        './images/Grafiken-Sharkie/2.Enemy/3 Final Enemy/Dead/Mesa de trabajo 2 copia 10.png'
    ];

    /** Intro sequence images shown when the boss appears. */
    IMAGES_INTRODUCE = [
        "./images/Grafiken-Sharkie/2.Enemy/3 Final Enemy/1.Introduce/1.png",
        "./images/Grafiken-Sharkie/2.Enemy/3 Final Enemy/1.Introduce/2.png",
        "./images/Grafiken-Sharkie/2.Enemy/3 Final Enemy/1.Introduce/3.png",
        "./images/Grafiken-Sharkie/2.Enemy/3 Final Enemy/1.Introduce/4.png",
        "./images/Grafiken-Sharkie/2.Enemy/3 Final Enemy/1.Introduce/5.png",
        "./images/Grafiken-Sharkie/2.Enemy/3 Final Enemy/1.Introduce/6.png",
        "./images/Grafiken-Sharkie/2.Enemy/3 Final Enemy/1.Introduce/7.png",
        "./images/Grafiken-Sharkie/2.Enemy/3 Final Enemy/1.Introduce/8.png",
        "./images/Grafiken-Sharkie/2.Enemy/3 Final Enemy/1.Introduce/9.png",
        "./images/Grafiken-Sharkie/2.Enemy/3 Final Enemy/1.Introduce/10.png"
    ];

    /** Boss attack animation images. */
    IMAGES_ATTACK = [
        "./images/Grafiken-Sharkie/2.Enemy/3 Final Enemy/Attack/1.png",
        "./images/Grafiken-Sharkie/2.Enemy/3 Final Enemy/Attack/2.png",
        "./images/Grafiken-Sharkie/2.Enemy/3 Final Enemy/Attack/3.png",
        "./images/Grafiken-Sharkie/2.Enemy/3 Final Enemy/Attack/4.png",
        "./images/Grafiken-Sharkie/2.Enemy/3 Final Enemy/Attack/5.png",
        "./images/Grafiken-Sharkie/2.Enemy/3 Final Enemy/Attack/6.png"
    ];

    /**
     * Initializes the boss, loads all animation frames,
     * sets its starting position, and begins the update loop.
     */
    constructor() {
        super();
        this.loadImage(this.IMAGES_WALKING[0]);
        this.loadImages(this.IMAGES_WALKING);
        this.loadImages(this.IMAGES_HURT);
        this.loadImages(this.IMAGES_DEAD);
        this.loadImages(this.IMAGES_INTRODUCE);
        this.loadImages(this.IMAGES_ATTACK);
        this.x = 2500;
        this.animate();
    }

    /**
     * Starts the boss animation cycle using a repeating interval.
     */
    animate() {
        setInterval(() => this.updateBoss(), 300);
    }

    /**
     * Updates the boss state each tick.
     * The boss checks defeat, chase behavior, waiting state, intro, hurt state,
     * and then the current battle phase.
     */
    updateBoss() {
        if (this.defeated) return;
        if (this.chaseSharkieIfNeeded()) return;
        if (this.waitForSharkie()) return;
        if (this.updateIntroduction()) return;
        if (this.playHurtIfNeeded()) return;
        this.updateCurrentPhase();
    }

    /**
     * Advances the introduction sequence if the boss is in the intro phase.
     *
     * @returns {boolean} True if the intro is currently playing, otherwise false.
     */
    updateIntroduction() {
        if (this.phase !== "introduce") return false;
        this.playIntroduction();
        return true;
    }

    /**
     * Plays the hurt animation while the boss is temporarily stunned.
     *
     * @returns {boolean} True if the boss is hurt and animation is active.
     */
    playHurtIfNeeded() {
        if (Date.now() >= this.hurtUntil) return false;
        this.playAnimation(this.IMAGES_HURT);
        return true;
    }

    /**
     * Updates the current active boss phase.
     */
    updateCurrentPhase() {
        if (this.phase === "floating") this.updateFloating();
        if (this.phase === "attack") this.updateAttack();
    }

    /**
     * Waits until the player reaches the required point before starting the boss intro.
     *
     * @returns {boolean} True while waiting, otherwise false.
     */
    waitForSharkie() {
        if (this.phase !== "waiting") return false;
        if (this.world.character.x < 1800) return true;

        this.phase = "introduce";
        this.introFrame = 0;
        return false;
    }

    /**
     * Chases the player if the boss is triggered by the world state.
     *
     * @returns {boolean} True when chasing logic is active.
     */
    chaseSharkieIfNeeded() {
        if (!this.world || this.world.replyShownAt === null) return false;
        if (this.world.collectedPoisonBubbles >= 4) return false;
        this.chaseSharkie();
        return true;
    }

    /**
     * Moves the boss toward the player and triggers the attack animation.
     */
    chaseSharkie() {
        const sharkie = this.world.character;
        const targetX = sharkie.x + sharkie.width - 40;

        if (this.x <= targetX) {
            this.world.gameLost = true;
            return;
        }

        this.x = Math.max(targetX, this.x - 12);
        this.playAttackFrame();
    }

    /**
     * Displays the next frame from the boss attack sprite set.
     */
    playAttackFrame() {
        const image = this.IMAGES_ATTACK[this.attackFrame];
        this.image = this.imageCache[image];
        this.attackFrame = (this.attackFrame + 1) % this.IMAGES_ATTACK.length;
    }

    /**
     * Plays the boss introduction animation and transitions to floating phase.
     */
    playIntroduction() {
        const image = this.IMAGES_INTRODUCE[this.introFrame];
        this.image = this.imageCache[image];
        this.introFrame++;

        if (this.introFrame >= this.IMAGES_INTRODUCE.length) {
            this.introFinished = true;
            this.phase = "floating";
            this.phaseEndsAt = Date.now() + 2000;
        }
    }

    /**
     * Keeps the boss floating and switches to attack phase after the time window ends.
     */
    updateFloating() {
        this.playAnimation(this.IMAGES_WALKING);
        if (Date.now() < this.phaseEndsAt) return;
        this.phase = "attack";
        this.attackFrame = 0;
    }

    /**
     * Moves the boss toward the player during the attack phase and triggers phase transitions.
     */
    updateAttack() {
        this.x = Math.max(2200, this.x - 3);
        this.playAttackFrame();

        if (this.attackFrame === 0) {
            this.phase = "floating";
            this.phaseEndsAt = Date.now() + 50;
        }
    }

    /**
     * Applies damage when the boss is hit by poison bubbles.
     *
     * @returns {boolean} True if the boss was defeated, otherwise false.
     */
    hitByBubbles() {
        if (this.defeated) return false;

        this.hits++;
        this.hurtUntil = Date.now() + 800;

        if (this.hits < 4) return false;

        this.defeated = true;
        this.startDeathAnimation();
        return true;
    }

    /**
     * Starts the death animation sequence.
     */
    startDeathAnimation() {
        let frame = 0;

        const timer = setInterval(() => {
            if (frame >= this.IMAGES_DEAD.length) {
                clearInterval(timer);
                return;
            }

            this.showDeathFrame(frame);
            frame++;
        }, 200);
    }

    /**
     * Displays one frame of the boss death animation.
     *
     * @param {number} frame - The frame index to display.
     */
    showDeathFrame(frame) {
        const imagePath = this.IMAGES_DEAD[frame];
        this.image = this.imageCache[imagePath];
    }

    /**
     * Draws the boss and its dialogue bubble if conditions are met.
     *
     * @param {CanvasRenderingContext2D} ctx - The drawing context.
     */
    draw(ctx) {
        super.draw(ctx);
        if (!this.canShowDialogue()) return;

        this.startDialogue();
        this.logDialogue();

        if (this.replyTimeIsOver()) {
            stopBossBgm();
            return;
        }

        this.drawDialogueBubble(ctx);
    }

    /**
     * Checks whether the dialogue bubble should be displayed.
     *
     * @returns {boolean} True if the boss is visible and not defeated.
     */
    canShowDialogue() {
        if (this.defeated || !this.world) return false;
        if (!this.introFinished) return false;
        return this.isBossVisible();
    }

    /**
     * Checks whether the boss is currently visible on screen.
     *
     * @returns {boolean} True if the boss is on the visible part of the canvas.
     */
    isBossVisible() {
        const screenX = this.x + this.world.camera_x;
        return screenX < this.world.canvas.width &&
            screenX + this.width > 0;
    }

    /**
     * Starts the boss dialogue and music when the first message is shown.
     */
    startDialogue() {
        if (this.messageShownAt !== null) return;
        startBossBgm();
        this.messageShownAt = Date.now();
    }

    /**
     * Logs the boss dialogue-related state periodically.
     */
    logDialogue() {
        if (Date.now() - (this.lastDialogueLogAt || 0) < 1000) return;
        console.log("Poison bubbles:", this.world.collectedPoisonBubbles);
        this.lastDialogueLogAt = Date.now();
    }

    /**
     * Checks whether the boss message time window has expired.
     *
     * @returns {boolean} True when the dialogue has been visible long enough.
     */
    replyTimeIsOver() {
        return Date.now() - this.messageShownAt >= 7500;
    }

    /**
     * Draws the floating dialogue bubble above the boss.
     *
     * @param {CanvasRenderingContext2D} ctx - The drawing context.
     */
    drawDialogueBubble(ctx) {
        const moveX = Math.sin(Date.now() / 250) * 5;
        const moveY = Math.sin(Date.now() / 400) * 8;
        const x = this.x - 210 + moveX;
        const y = this.y + 150 + moveY;

        this.drawBubbleShape(ctx, x, y);
        this.drawBubbleText(ctx, x, y);
    }

    /**
     * Draws the bubble outline and its tail.
     *
     * @param {CanvasRenderingContext2D} ctx - The drawing context.
     * @param {number} x - Bubble x-position.
     * @param {number} y - Bubble y-position.
     */
    drawBubbleShape(ctx, x, y) {
        ctx.fillStyle = "#ffffff";
        ctx.strokeStyle = "#073b66";
        ctx.lineWidth = 3;
        this.drawBubbleTail(ctx, x, y);
        this.drawBubbleOval(ctx, x, y);
    }

    /**
     * Draws the tail of the speech bubble.
     *
     * @param {CanvasRenderingContext2D} ctx - The drawing context.
     * @param {number} x - Tail base x-position.
     * @param {number} y - Tail base y-position.
     */
    drawBubbleTail(ctx, x, y) {
        ctx.beginPath();
        ctx.moveTo(x + 170, y + 62);
        ctx.lineTo(x + 200, y + 62);
        ctx.lineTo(x + 235, y + 88);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
    }

    /**
     * Draws the main oval speech bubble.
     *
     * @param {CanvasRenderingContext2D} ctx - The drawing context.
     * @param {number} x - Bubble x-position.
     * @param {number} y - Bubble y-position.
     */
    drawBubbleOval(ctx, x, y) {
        ctx.beginPath();
        ctx.ellipse(x + 110, y + 35, 110, 35, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
    }

    /**
     * Writes the boss dialogue text inside the speech bubble.
     *
     * @param {CanvasRenderingContext2D} ctx - The drawing context.
     * @param {number} x - Bubble x-position.
     * @param {number} y - Bubble y-position.
     */
    drawBubbleText(ctx, x, y) {
        ctx.fillStyle = "#073b66";
        ctx.font = "bold 16px Arial";
        ctx.textAlign = "center";
        ctx.fillText("You can only defeat me", x + 110, y + 28);
        ctx.fillText("with 4 poison bubbles!", x + 110, y + 52);
    }
}