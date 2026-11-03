/**
 * Controls the player character, including movement, attacks, animation,
 * Endboss dialogue, and speech-bubble rendering.
 * @extends MovableObject
 */
class Character extends MovableObject {
    /** Character height in pixels. */
    height = 250;

    /** Character width in pixels. */
    width = 240;

    /** Character's initial vertical position. */
    y = 80;

    /** Character's movement speed. */
    speed = 5;

    /** Time when the Endboss attack animation started. */
    bossAttackStartedAt = 0;

    /** Whether the Endboss attack animation is active. */
    bossAttackActive = false;

    /** World instance this character belongs to. */
    world;

    /** Horizontal offset of the character's collision box. */
    collisionOffsetX = 45;

    /** Vertical offset of the character's collision box. */
    collisionOffsetY = 115;

    /** Width of the character's collision box. */
    collisionWidth = 150;

    /** Height of the character's collision box. */
    collisionHeight = 75;

    /** Time when the death animation started. */
    deadAnimationStartedAt = 0;

    /** Whether the death animation has finished. */
    deadAnimationFinished = false;

    /** Whether a fin attack is currently active. */
    finAttackActive = false;

    /** Time when the fin attack started. */
    finAttackStartedAt = 0;

    /** Enemies already hit during the current fin attack. */
    finAttackHits = new Set();

    /** Vertical position where the current bounce began. */
    bounceStartY = 0;

    /** Whether the character is currently bouncing. */
    isBouncing = false;

    IMAGES_WALKING = [
        './images/Grafiken-Sharkie/1.Sharkie/3.Swim/1.png',
        './images/Grafiken-Sharkie/1.Sharkie/3.Swim/2.png',
        './images/Grafiken-Sharkie/1.Sharkie/3.Swim/3.png',
        './images/Grafiken-Sharkie/1.Sharkie/3.Swim/4.png',
        './images/Grafiken-Sharkie/1.Sharkie/3.Swim/5.png',
        './images/Grafiken-Sharkie/1.Sharkie/3.Swim/6.png'
    ];

    IMAGES_JUMPING = [
        './images/Grafiken-Sharkie/1.Sharkie/3.Swim/1.png',
        './images/Grafiken-Sharkie/1.Sharkie/3.Swim/2.png',
        './images/Grafiken-Sharkie/1.Sharkie/3.Swim/3.png',
        './images/Grafiken-Sharkie/1.Sharkie/3.Swim/4.png',
        './images/Grafiken-Sharkie/1.Sharkie/3.Swim/5.png',
        './images/Grafiken-Sharkie/1.Sharkie/3.Swim/6.png'
    ];

    IMAGES_DEAD = [
        './images/Grafiken-Sharkie/1.Sharkie/6.dead/2.Electro_shock/1.png',
        './images/Grafiken-Sharkie/1.Sharkie/6.dead/2.Electro_shock/2.png',
        './images/Grafiken-Sharkie/1.Sharkie/6.dead/2.Electro_shock/3.png',
        './images/Grafiken-Sharkie/1.Sharkie/6.dead/2.Electro_shock/4.png',
        './images/Grafiken-Sharkie/1.Sharkie/6.dead/2.Electro_shock/5.png',
        './images/Grafiken-Sharkie/1.Sharkie/6.dead/2.Electro_shock/6.png',
        './images/Grafiken-Sharkie/1.Sharkie/6.dead/2.Electro_shock/7.png',
        './images/Grafiken-Sharkie/1.Sharkie/6.dead/2.Electro_shock/8.png',
        './images/Grafiken-Sharkie/1.Sharkie/6.dead/2.Electro_shock/9.png',
        './images/Grafiken-Sharkie/1.Sharkie/6.dead/2.Electro_shock/10.png'
    ];

    IMAGES_HURT = [
        './images/Grafiken-Sharkie/1.Sharkie/5.Hurt/1.Poisoned/1.png',
        './images/Grafiken-Sharkie/1.Sharkie/5.Hurt/1.Poisoned/2.png',
        './images/Grafiken-Sharkie/1.Sharkie/5.Hurt/1.Poisoned/3.png',
        './images/Grafiken-Sharkie/1.Sharkie/5.Hurt/1.Poisoned/4.png',
        './images/Grafiken-Sharkie/1.Sharkie/5.Hurt/1.Poisoned/5.png'
    ];

    IMAGES_BOSS_ATTACK = [
        './images/Grafiken-Sharkie/1.Sharkie/4.Attack/Bubble trap/For Whale/1.png',
        './images/Grafiken-Sharkie/1.Sharkie/4.Attack/Bubble trap/For Whale/2.png',
        './images/Grafiken-Sharkie/1.Sharkie/4.Attack/Bubble trap/For Whale/3.png',
        './images/Grafiken-Sharkie/1.Sharkie/4.Attack/Bubble trap/For Whale/4.png',
        './images/Grafiken-Sharkie/1.Sharkie/4.Attack/Bubble trap/For Whale/5.png',
        './images/Grafiken-Sharkie/1.Sharkie/4.Attack/Bubble trap/For Whale/6.png',
        './images/Grafiken-Sharkie/1.Sharkie/4.Attack/Bubble trap/For Whale/7.png',
        './images/Grafiken-Sharkie/1.Sharkie/4.Attack/Bubble trap/For Whale/8.png'
    ];

    IMAGES_FIN_SLAP = [
        "./images/Grafiken-Sharkie/1.Sharkie/4.Attack/Fin slap/1.png",
        "./images/Grafiken-Sharkie/1.Sharkie/4.Attack/Fin slap/2.png",
        "./images/Grafiken-Sharkie/1.Sharkie/4.Attack/Fin slap/3.png",
        "./images/Grafiken-Sharkie/1.Sharkie/4.Attack/Fin slap/4.png",
        "./images/Grafiken-Sharkie/1.Sharkie/4.Attack/Fin slap/5.png",
        "./images/Grafiken-Sharkie/1.Sharkie/4.Attack/Fin slap/6.png",
        "./images/Grafiken-Sharkie/1.Sharkie/4.Attack/Fin slap/7.png",
        "./images/Grafiken-Sharkie/1.Sharkie/4.Attack/Fin slap/8.png"
    ];

    /** Loads the character images and starts its animation loops. */
    constructor() {
        super();
        this.loadImage('./images/Grafiken-Sharkie/1.Sharkie/3.Swim/1.png'); this.loadImages(this.IMAGES_WALKING);
        this.loadImages(this.IMAGES_FIN_SLAP);
        this.loadImages(this.IMAGES_JUMPING);
        this.loadImages(this.IMAGES_BOSS_ATTACK);
        this.loadImages(this.IMAGES_HURT);
        this.loadImages(this.IMAGES_DEAD);
        this.animate();
    }

    /** Starts a fin attack if one is not already active and the character is alive. */
    startFinAttack() {
        if (this.finAttackActive || this.isDead()) return;

        this.finAttackActive = true;
        this.finAttackStartedAt = Date.now();
        this.finAttackHits = new Set();
    }

    /**
    * Checks whether the fin-slap attack hits the given enemy.
    * @param {MovableObject} enemy - Enemy to check.
    * @returns {boolean} Whether the attack hits the enemy.
    */
    isFinSlapColliding(enemy) {
        const attackBox = this.getFinSlapBox();
        const enemyBox = this.getEnemyBox(enemy);
        return this.boxesOverlap(attackBox, enemyBox);
    }

    /** Calculates the character's fin-slap attack box. */
    getFinSlapBox() {
        const x = this.otherDirection
            ? this.x + this.collisionOffsetX - 80
            : this.x + this.collisionOffsetX + this.collisionWidth - 10;

        return {
            x,
            y: this.y + this.collisionOffsetY,
            width: 90,
            height: this.collisionHeight
        };
    }

    /**
    * Builds the enemy's collision box using its position and dimensions.
    * @param {MovableObject} enemy - Enemy to get the collision box for.
    * @returns {{x: number, y: number, width: number, height: number}} The enemy's collision box.
    */
    getEnemyBox(enemy) {
        return {
            x: this.getEnemyX(enemy),
            y: this.getEnemyY(enemy),
            width: this.getEnemyWidth(enemy),
            height: this.getEnemyHeight(enemy)
        };
    }

    /** Gets the enemy collision box's horizontal position. */
    getEnemyX(enemy) {
        const offset = enemy.collisionOffsetX != null
            ? enemy.collisionOffsetX : 0;
        return enemy.x + offset;
    }

    /** Gets the enemy collision box's vertical position. */
    getEnemyY(enemy) {
        const offset = enemy.collisionOffsetY != null
            ? enemy.collisionOffsetY : 0;
        return enemy.y + offset;
    }

    /** Gets the enemy collision box's width. */
    getEnemyWidth(enemy) {
        return enemy.collisionWidth != null
            ? enemy.collisionWidth : enemy.width;
    }

    /** Gets the enemy collision box's height. */
    getEnemyHeight(enemy) {
        return enemy.collisionHeight != null
            ? enemy.collisionHeight : enemy.height;
    }

    /**
    * Checks whether two rectangular boxes overlap.
    * @param {{x: number, y: number, width: number, height: number}} box1 - First box.
    * @param {{x: number, y: number, width: number, height: number}} box2 - Second box.
    * @returns {boolean} Whether the boxes overlap.
    */
    boxesOverlap(box1, box2) {
        return box1.x < box2.x + box2.width &&
            box1.x + box1.width > box2.x &&
            box1.y < box2.y + box2.height &&
            box1.y + box1.height > box2.y;
    }

    /** Starts the character's Endboss attack animation. */
    playBossAttack() {
        this.bossAttackStartedAt = Date.now();
        this.bossAttackActive = true;
    }

    /** Starts a bounce after the character stomps an enemy. */
    jump() {
        this.bounceStartY = this.y;
        this.speedY = 12;
        this.isBouncing = true;
    }

    /** Updates the character's position during a bounce. */
    moveBounce() {
        this.y -= this.speedY;
        this.speedY -= 0.6;
        if (this.y < this.bounceStartY) return;
        this.y = this.bounceStartY;
        this.speedY = 0;
        this.isBouncing = false;
    }

    /** Starts the character's movement and animation update loops. */
    animate() {
        setInterval(() => this.updateMovement(), 1000 / 60);
        setInterval(() => this.updateAnimation(), 50);
    }

    /** Updates character movement and the camera position. */
    updateMovement() {
        if (this.bossAttackActive) return;
        this.moveLeftOrRight();
        this.moveUpOrDown();
        this.world.camera_x = Math.min(0, -this.x + 100);
    }

    /** Moves the character left or right according to keyboard input. */
    moveLeftOrRight() {
        if (this.world.keyboard.RIGHT && this.x < this.world.level.level_end_x) {
            this.moveRight();
            this.otherDirection = false;
        }
        if (this.world.keyboard.LEFT && this.x > 0) {
            this.moveLeft();
            this.otherDirection = true;
        }
    }

    /** Moves the character up or down according to keyboard input. */
    moveUpOrDown() {
        if (this.isBouncing) {
            this.moveBounce();
            return;
        }
        if (this.world.keyboard.UP && this.y > 0) this.y -= this.speed;
        if (this.world.keyboard.DOWN && this.y < 480 - this.height) {
            this.y += this.speed;
        }
    }

    /** Selects the animation that matches the character's current state. */
    updateAnimation() {
        if (this.isDead()) return this.updateDeadAnimation();
        if (this.isHurt()) return this.playAnimation(this.IMAGES_HURT);
        if (this.finAttackActive) return this.updateFinAttackAnimation();
        if (this.bossAttackActive) return this.updateBossAttackAnimation();
        this.playAnimation(this.IMAGES_WALKING);
    }

    /** Advances the death animation and marks it finished when complete. */
    updateDeadAnimation() {
        if (this.deadAnimationFinished) return;
        if (!this.deadAnimationStartedAt) this.deadAnimationStartedAt = Date.now();
        const frame = Math.floor((Date.now() - this.deadAnimationStartedAt) / 150);
        if (frame < this.IMAGES_DEAD.length) {
            this.image = this.imageCache[this.IMAGES_DEAD[frame]];
        } else {
            this.deadAnimationFinished = true;
        }
    }

    /** Advances the fin-slap animation and ends the attack when complete. */
    updateFinAttackAnimation() {
        const frame = Math.floor((Date.now() - this.finAttackStartedAt) / 80);
        if (frame >= this.IMAGES_FIN_SLAP.length) {
            this.finAttackActive = false;
        } else {
            this.image = this.imageCache[this.IMAGES_FIN_SLAP[frame]];
        }
    }

    /** Advances the Endboss attack animation and ends it when complete. */
    updateBossAttackAnimation() {
        const frame = Math.floor((Date.now() - this.bossAttackStartedAt) / 100);
        if (frame >= this.IMAGES_BOSS_ATTACK.length) {
            this.bossAttackActive = false;
        } else {
            this.image = this.imageCache[this.IMAGES_BOSS_ATTACK[frame]];
        }
    }

    /**
    * Draws the character and, when appropriate, the Endboss speech bubble.
    * @param {CanvasRenderingContext2D} ctx - Canvas drawing context.
    */
    draw(ctx) {
        super.draw(ctx);
        const endboss = this.getEndboss();
        if (!this.canShowReply(endboss)) return;
        if (this.world.dPressedAfterReply) return;

        const enoughBubbles = this.hasEnoughBubbles();
        this.startBossReply(enoughBubbles);
        const showHint = this.shouldShowHint(enoughBubbles);
        this.drawSpeechBubble(ctx, showHint, enoughBubbles);
    }

    /** Finds and returns the Endboss in the current level. */
    getEndboss() {
        return this.world.level.enemies.find(
            enemy => enemy instanceof Endboss
        );
    }

    /**
    * Checks whether the Endboss reply can be shown.
    * @param {Endboss | undefined} endboss - Endboss to check.
    * @returns {boolean} Whether the reply can be shown.
    */
    canShowReply(endboss) {
        if (this.otherDirection || !endboss) return false;
        if (endboss.messageShownAt === null) return false;
        return Date.now() - endboss.messageShownAt >= 2000;
    }

    /** Checks whether the character has collected enough poisoned bubbles. */
    hasEnoughBubbles() {
        return this.world.collectedPoisonBubbles >= 4;
    }

    /**
    * Starts the Endboss reply and plays the matching sound once.
    * @param {boolean} enoughBubbles - Whether enough poisoned bubbles were collected.
    */
    startBossReply(enoughBubbles) {
        if (this.world.replyShownAt !== null) return;
        this.world.replyShownAt = Date.now();
        this.world.dPressedAfterReply = false;
        this.playBossReplySound(enoughBubbles);
    }

    /**
    * Plays the reply sound that matches the collected bubble count.
    * @param {boolean} enoughBubbles - Whether enough poisoned bubbles were collected.
    */
    playBossReplySound(enoughBubbles) {
        if (enoughBubbles) {
            startYesHaveBgm();
            return;
        }

        stopAllBgm();
        this.playLossSound();
    }

    /** Plays the loss sound when the character lacks enough poisoned bubbles. */
    playLossSound() {
        this.world.deadSound.currentTime = 0;
        this.world.deadSound.play().catch(error => {
            console.error("Could not play loss sound:", error);
        });
    }

    /**
    * Checks whether the attack hint should be displayed.
    * @param {boolean} enoughBubbles - Whether enough poisoned bubbles were collected.
    * @returns {boolean} Whether the hint should be displayed.
    */
    shouldShowHint(enoughBubbles) {
        if (!enoughBubbles || this.world.dPressedAfterReply) return false;
        return Date.now() - this.world.replyShownAt >= 3000;
    }

    /**
     * Draws the Endboss speech bubble and its text.
    * @param {CanvasRenderingContext2D} ctx - Canvas drawing context.
    * @param {boolean} showHint - Whether to show the attack hint.
    * @param {boolean} enoughBubbles - Whether enough poisoned bubbles were collected.
    */
    drawSpeechBubble(ctx, showHint, enoughBubbles) {
        const x = this.x + this.width - 110;
        const y = this.getSpeechBubbleY();
        this.drawSpeechBubbleShape(ctx, x, y);
        this.drawSpeechText(ctx, x, y, showHint, enoughBubbles);
    }

    /** Calculates the speech bubble's vertical position, including its floating motion. */
    getSpeechBubbleY() {
        const moveY = Math.sin(Date.now() / 300) * 4;
        return this.y + 20 + moveY;
    }

    /** Draws the speech bubble's tail and oval. */
    drawSpeechBubbleShape(ctx, x, y) {
        this.drawSpeechTail(ctx, x, y);
        this.drawSpeechBubbleOval(ctx, x, y);
    }

    /** Draws the triangular tail of the speech bubble. */
    drawSpeechTail(ctx, x, y) {
        ctx.fillStyle = "#ffffff";
        ctx.strokeStyle = "#073b66";
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(x + 30, y + 65);
        ctx.lineTo(x + 65, y + 65);
        ctx.lineTo(x + 5, y + 92);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
    }

    /** Draws the oval body of the speech bubble. */
    drawSpeechBubbleOval(ctx, x, y) {
        ctx.beginPath();
        ctx.ellipse(x + 110, y + 35, 110, 35, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
    }

    /**
     * Draws the appropriate text inside the speech bubble.
     * @param {CanvasRenderingContext2D} ctx - Canvas drawing context.
     * @param {number} x - Horizontal position of the speech bubble.
     * @param {number} y - Vertical position of the speech bubble.
     * @param {boolean} showHint - Whether to show the attack hint.
     * @param {boolean} enoughBubbles - Whether enough poisoned bubbles were collected.
     */
    drawSpeechText(ctx, x, y, showHint, enoughBubbles) {
        ctx.fillStyle = "#073b66";
        ctx.font = "bold 16px Arial";
        ctx.textAlign = "center";

        if (showHint) this.drawHintText(ctx, x, y);
        else if (enoughBubbles) this.drawEnoughBubblesText(ctx, x, y);
        else this.drawNotEnoughBubblesText(ctx, x, y);
    }

    /** Draws the hint explaining how to defeat the Endboss. */
    drawHintText(ctx, x, y) {
        ctx.fillText("Hint: Press D 4 times", x + 110, y + 29);
        ctx.fillText("to defeat the Endboss!", x + 110, y + 53);
    }

    /** Draws the reply shown when enough poisoned bubbles were collected. */
    drawEnoughBubblesText(ctx, x, y) {
        ctx.fillText("Yes, I have!", x + 110, y + 29);
        ctx.fillText("Rest in peace!", x + 110, y + 53);
    }

    /** Draws the reply shown when there are not enough poisoned bubbles. */
    drawNotEnoughBubblesText(ctx, x, y) {
        ctx.fillText("No, I don't have :(", x + 110, y + 41);
    }

}