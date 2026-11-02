class Endboss extends MovableObject {

    height = 600;
    width = 250;
    y = -130;
    hits = 0;
    defeated = false;
    hurtUntil = 0;

    world;
    messageShownAt = null;

    introStarted = false;
    introFinished = false;
    introFrame = 0;

    phase = "waiting";
    attackFrame = 0;
    phaseEndsAt = 0;

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

    IMAGES_HURT = [
        './images/Grafiken-Sharkie/2.Enemy/3 Final Enemy/Hurt/1.png',
        './images/Grafiken-Sharkie/2.Enemy/3 Final Enemy/Hurt/2.png',
        './images/Grafiken-Sharkie/2.Enemy/3 Final Enemy/Hurt/3.png',
        './images/Grafiken-Sharkie/2.Enemy/3 Final Enemy/Hurt/4.png'
    ];

    IMAGES_DEAD = [
        './images/Grafiken-Sharkie/2.Enemy/3 Final Enemy/Dead/Mesa de trabajo 2.png',
        './images/Grafiken-Sharkie/2.Enemy/3 Final Enemy/Dead/Mesa de trabajo 2 copia 6.png',
        './images/Grafiken-Sharkie/2.Enemy/3 Final Enemy/Dead/Mesa de trabajo 2 copia 7.png',
        './images/Grafiken-Sharkie/2.Enemy/3 Final Enemy/Dead/Mesa de trabajo 2 copia 8.png',
        './images/Grafiken-Sharkie/2.Enemy/3 Final Enemy/Dead/Mesa de trabajo 2 copia 9.png',
        './images/Grafiken-Sharkie/2.Enemy/3 Final Enemy/Dead/Mesa de trabajo 2 copia 10.png'
    ];

    IMAGES_INTRODUCE = Array.from(
        { length: 10 },
        (_, index) =>
            `./images/Grafiken-Sharkie/2.Enemy/3 Final Enemy/1.Introduce/${index + 1}.png`
    );

    IMAGES_ATTACK = Array.from(
        { length: 6 },
        (_, index) =>
            `./images/Grafiken-Sharkie/2.Enemy/3 Final Enemy/Attack/${index + 1}.png`
    );

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

    animate() {
        setInterval(() => this.updateBoss(), 300);
    }

    updateBoss() {
        if (this.defeated) return;
        if (this.chaseSharkieIfNeeded()) return;

        if (this.phase === "waiting") {
            if (this.world.character.x < 1800) return;
            this.phase = "introduce";
            this.introFrame = 0;
        }

        if (this.phase === "introduce") return this.playIntroduction();
        if (Date.now() < this.hurtUntil) return this.playAnimation(this.IMAGES_HURT);
        if (this.phase === "floating") return this.updateFloating();
        if (this.phase === "attack") this.updateAttack();
    }

    chaseSharkieIfNeeded() {
        if (!this.world || this.world.replyShownAt === null) return false;
        if (this.world.collectedPoisonBubbles >= 4) return false;
        this.chaseSharkie();
        return true;
    }

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

    playAttackFrame() {
        const image = this.IMAGES_ATTACK[this.attackFrame];
        this.image = this.imageCache[image];
        this.attackFrame = (this.attackFrame + 1) % this.IMAGES_ATTACK.length;
    }

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

    updateFloating() {
        this.playAnimation(this.IMAGES_WALKING);
        if (Date.now() < this.phaseEndsAt) return;
        this.phase = "attack";
        this.attackFrame = 0;
    }

    updateAttack() {
        this.x = Math.max(2200, this.x - 3);
        this.playAttackFrame();

        if (this.attackFrame === 0) {
            this.phase = "floating";
            this.phaseEndsAt = Date.now() + 50;
        }
    }

    hitByBubbles() {
        if (this.defeated) return false;

        this.hits++;
        this.hurtUntil = Date.now() + 800;

        if (this.hits < 4) return false;

        this.defeated = true;
        this.startDeathAnimation();
        return true;
    }

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

    showDeathFrame(frame) {
        const imagePath = this.IMAGES_DEAD[frame];
        this.image = this.imageCache[imagePath];
    }

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

    canShowDialogue() {
        if (this.defeated || !this.world) return false;
        if (!this.introFinished) return false;
        return this.isBossVisible();
    }

    isBossVisible() {
        const screenX = this.x + this.world.camera_x;
        return screenX < this.world.canvas.width &&
            screenX + this.width > 0;
    }

    startDialogue() {
        if (this.messageShownAt !== null) return;
        startBossBgm();
        this.messageShownAt = Date.now();
    }

    logDialogue() {
        if (Date.now() - (this.lastDialogueLogAt || 0) < 1000) return;
        console.log("Poison bubbles:", this.world.collectedPoisonBubbles);
        this.lastDialogueLogAt = Date.now();
    }

    replyTimeIsOver() {
        return Date.now() - this.messageShownAt >= 7500;
    }

    drawDialogueBubble(ctx) {
        const moveX = Math.sin(Date.now() / 250) * 5;
        const moveY = Math.sin(Date.now() / 400) * 8;
        const x = this.x - 210 + moveX;
        const y = this.y + 150 + moveY;

        this.drawBubbleShape(ctx, x, y);
        this.drawBubbleText(ctx, x, y);
    }

    drawBubbleShape(ctx, x, y) {
        ctx.fillStyle = "#ffffff";
        ctx.strokeStyle = "#073b66";
        ctx.lineWidth = 3;
        this.drawBubbleTail(ctx, x, y);
        this.drawBubbleOval(ctx, x, y);
    }

    drawBubbleTail(ctx, x, y) {
        ctx.beginPath();
        ctx.moveTo(x + 170, y + 62);
        ctx.lineTo(x + 200, y + 62);
        ctx.lineTo(x + 235, y + 88);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
    }

    drawBubbleOval(ctx, x, y) {
        ctx.beginPath();
        ctx.ellipse(x + 110, y + 35, 110, 35, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
    }

    drawBubbleText(ctx, x, y) {
        ctx.fillStyle = "#073b66";
        ctx.font = "bold 16px Arial";
        ctx.textAlign = "center";
        ctx.fillText("You can only defeat me", x + 110, y + 28);
        ctx.fillText("with 4 poison bubbles!", x + 110, y + 52);
    }
}