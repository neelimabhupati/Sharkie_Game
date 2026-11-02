class Character extends MovableObject {
    height = 250;
    width = 240;
    y = 80;
    speed = 5;

    bossAttackStartedAt = 0;
    bossAttackActive = false;
    world;
    // walking_sound = new Audio('./audio/walking.mp3');

    collisionOffsetX = 45;
    collisionOffsetY = 115;
    collisionWidth = 150;
    collisionHeight = 75;


    deadAnimationStartedAt = 0;
    deadAnimationFinished = false;

    finAttackActive = false;
    finAttackStartedAt = 0;
    finAttackHits = new Set();

    bounceStartY = 0;
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
    IMAGES_FIN_SLAP = Array.from(
        { length: 8 },
        (_, index) =>
            `./images/Grafiken-Sharkie/1.Sharkie/4.Attack/Fin slap/${index + 1}.png`
    );

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

    startFinAttack() {
        if (this.finAttackActive || this.isDead()) return;

        this.finAttackActive = true;
        this.finAttackStartedAt = Date.now();
        this.finAttackHits = new Set();
    }

    isFinSlapColliding(enemy) {
        const attackBox = this.getFinSlapBox();
        const enemyBox = this.getEnemyBox(enemy);
        return this.boxesOverlap(attackBox, enemyBox);
    }

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

    getEnemyBox(enemy) {
        return {
            x: enemy.x + (
                enemy.collisionOffsetX != null ? enemy.collisionOffsetX : 0
            ),
            y: enemy.y + (
                enemy.collisionOffsetY != null ? enemy.collisionOffsetY : 0
            ),
            width: enemy.collisionWidth != null
                ? enemy.collisionWidth
                : enemy.width,
            height: enemy.collisionHeight != null
                ? enemy.collisionHeight
                : enemy.height
        };
    }

    boxesOverlap(box1, box2) {
        return box1.x < box2.x + box2.width &&
            box1.x + box1.width > box2.x &&
            box1.y < box2.y + box2.height &&
            box1.y + box1.height > box2.y;
    }
    playBossAttack() {
        this.bossAttackStartedAt = Date.now();
        this.bossAttackActive = true;
    }
    jump() {
        this.bounceStartY = this.y;
        this.speedY = 12;
        this.isBouncing = true;
    }

    moveBounce() {
        this.y -= this.speedY;
        this.speedY -= 0.6;
        if (this.y < this.bounceStartY) return;
        this.y = this.bounceStartY;
        this.speedY = 0;
        this.isBouncing = false;
    }

    animate() {
        setInterval(() => this.updateMovement(), 1000 / 60);
        setInterval(() => this.updateAnimation(), 50);
    }

    updateMovement() {
        if (this.bossAttackActive) return;
        this.moveLeftOrRight();
        this.moveUpOrDown();
        this.world.camera_x = Math.min(0, -this.x + 100);
    }

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

    updateAnimation() {
        if (this.isDead()) return this.updateDeadAnimation();
        if (this.isHurt()) return this.playAnimation(this.IMAGES_HURT);
        if (this.finAttackActive) return this.updateFinAttackAnimation();
        if (this.bossAttackActive) return this.updateBossAttackAnimation();
        this.playAnimation(this.IMAGES_WALKING);
    }

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

    updateFinAttackAnimation() {
        const frame = Math.floor((Date.now() - this.finAttackStartedAt) / 80);
        if (frame >= this.IMAGES_FIN_SLAP.length) {
            this.finAttackActive = false;
        } else {
            this.image = this.imageCache[this.IMAGES_FIN_SLAP[frame]];
        }
    }

    updateBossAttackAnimation() {
        const frame = Math.floor((Date.now() - this.bossAttackStartedAt) / 100);
        if (frame >= this.IMAGES_BOSS_ATTACK.length) {
            this.bossAttackActive = false;
        } else {
            this.image = this.imageCache[this.IMAGES_BOSS_ATTACK[frame]];
        }
    }

    // draw(ctx) {
    //     super.draw(ctx);

    //     const endboss = this.world?.level.enemies.find(
    //         enemy => enemy instanceof Endboss
    //     );

    //     if (
    //         this.otherDirection || !endboss ||
    //         endboss.messageShownAt === null ||
    //         Date.now() - endboss.messageShownAt < 2000

    //     ) {
    //         // console.log('Poison bubbles collected:', this.collectedPoisonBubbles);
    //         return;
    //     }

    //     if (this.world.dPressedAfterReply) {
    //         return;
    //     }

    //     const hasEnoughPoisonBubbles =
    //         this.world.collectedPoisonBubbles >= 4;

    //     if (this.world.replyShownAt === null) {
    //         this.world.replyShownAt = Date.now();
    //         this.world.dPressedAfterReply = false;

    //         if (hasEnoughPoisonBubbles) {
    //             startYesHaveBgm();

    //         } else {
    //             stopAllBgm();
    //             this.world.deadSound.currentTime = 0;
    //             this.world.deadSound.play().catch(error => {
    //                 console.error("Could not play loss sound:", error);
    //             });
    //         }
    //     }
    //     const showHint =
    //         hasEnoughPoisonBubbles &&
    //         Date.now() - this.world.replyShownAt >= 3000 &&
    //         !this.world.dPressedAfterReply;

    //     const moveY = Math.sin(Date.now() / 300) * 4;
    //     const bubbleX = this.x + this.width - 110;
    //     const bubbleY = this.y + 20 + moveY;
    //     const bubbleWidth = 220;
    //     const bubbleHeight = 70;

    //     ctx.fillStyle = '#ffffff';
    //     ctx.strokeStyle = '#073b66';
    //     ctx.lineWidth = 3;

    //     // Sharkie వైపు చూపించే speech tail
    //     ctx.beginPath();
    //     ctx.moveTo(bubbleX + 30, bubbleY + bubbleHeight - 5);
    //     ctx.lineTo(bubbleX + 65, bubbleY + bubbleHeight - 5);
    //     ctx.lineTo(bubbleX + 5, bubbleY + bubbleHeight + 22);
    //     ctx.closePath();
    //     ctx.fill();
    //     ctx.stroke();

    //     ctx.beginPath();
    //     ctx.ellipse(
    //         bubbleX + bubbleWidth / 2,
    //         bubbleY + bubbleHeight / 2,
    //         bubbleWidth / 2,
    //         bubbleHeight / 2,
    //         0,
    //         0,
    //         Math.PI * 2
    //     );
    //     ctx.fill();
    //     ctx.stroke();

    //     ctx.fillStyle = '#073b66';
    //     ctx.font = 'bold 16px Arial';
    //     ctx.textAlign = 'center';

    //     if (showHint) {
    //         ctx.fillText(
    //             'Hint: Press D 4 times',
    //             bubbleX + bubbleWidth / 2,
    //             bubbleY + 29
    //         );
    //         ctx.fillText(
    //             'to defeat the Endboss!',
    //             bubbleX + bubbleWidth / 2,
    //             bubbleY + 53
    //         );
    //     } else if (hasEnoughPoisonBubbles) {
    //         ctx.fillText(
    //             'Yes, I have!',
    //             bubbleX + bubbleWidth / 2,
    //             bubbleY + 29
    //         );
    //         ctx.fillText(
    //             'Rest in peace!',
    //             bubbleX + bubbleWidth / 2,
    //             bubbleY + 53
    //         );
    //     } else {
    //         ctx.fillText(
    //             "No, I don't have :( ",
    //             bubbleX + bubbleWidth / 2,
    //             bubbleY + bubbleHeight / 2 + 6
    //         );
    //         // ctx.fillText(
    //         //     'I need 4 poison bubbles!',
    //         //     bubbleX + bubbleWidth / 2,
    //         //     bubbleY + 53
    //         // );
    //     }
    // }
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

    getEndboss() {
        return this.world.level.enemies.find(
            enemy => enemy instanceof Endboss
        );
    }

    canShowReply(endboss) {
        if (this.otherDirection || !endboss) return false;
        if (endboss.messageShownAt === null) return false;
        return Date.now() - endboss.messageShownAt >= 2000;
    }

    hasEnoughBubbles() {
        return this.world.collectedPoisonBubbles >= 4;
    }

    startBossReply(enoughBubbles) {
        if (this.world.replyShownAt !== null) return;
        this.world.replyShownAt = Date.now();
        this.world.dPressedAfterReply = false;
        this.playBossReplySound(enoughBubbles);
    }

    playBossReplySound(enoughBubbles) {
        if (enoughBubbles) {
            startYesHaveBgm();
            return;
        }

        stopAllBgm();
        this.playLossSound();
    }

    playLossSound() {
        this.world.deadSound.currentTime = 0;
        this.world.deadSound.play().catch(error => {
            console.error("Could not play loss sound:", error);
        });
    }

    shouldShowHint(enoughBubbles) {
        if (!enoughBubbles || this.world.dPressedAfterReply) return false;
        return Date.now() - this.world.replyShownAt >= 3000;
    }

    drawSpeechBubble(ctx, showHint, enoughBubbles) {
        const x = this.x + this.width - 110;
        const y = this.getSpeechBubbleY();
        this.drawSpeechBubbleShape(ctx, x, y);
        this.drawSpeechText(ctx, x, y, showHint, enoughBubbles);
    }

    getSpeechBubbleY() {
        const moveY = Math.sin(Date.now() / 300) * 4;
        return this.y + 20 + moveY;
    }

    drawSpeechBubbleShape(ctx, x, y) {
        this.drawSpeechTail(ctx, x, y);
        this.drawSpeechBubbleOval(ctx, x, y);
    }

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

    drawSpeechBubbleOval(ctx, x, y) {
        ctx.beginPath();
        ctx.ellipse(x + 110, y + 35, 110, 35, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
    }

    drawSpeechText(ctx, x, y, showHint, enoughBubbles) {
        ctx.fillStyle = "#073b66";
        ctx.font = "bold 16px Arial";
        ctx.textAlign = "center";

        if (showHint) this.drawHintText(ctx, x, y);
        else if (enoughBubbles) this.drawEnoughBubblesText(ctx, x, y);
        else this.drawNotEnoughBubblesText(ctx, x, y);
    }

    drawHintText(ctx, x, y) {
        ctx.fillText("Hint: Press D 4 times", x + 110, y + 29);
        ctx.fillText("to defeat the Endboss!", x + 110, y + 53);
    }

    drawEnoughBubblesText(ctx, x, y) {
        ctx.fillText("Yes, I have!", x + 110, y + 29);
        ctx.fillText("Rest in peace!", x + 110, y + 53);
    }

    drawNotEnoughBubblesText(ctx, x, y) {
        ctx.fillText("No, I don't have :(", x + 110, y + 41);
    }

}