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
        setInterval(() => {
            if (this.defeated) return;

            if (this.world?.replyShownAt !== null &&
                this.world?.collectedPoisonBubbles < 4) {
                const sharkie = this.world.character;
                const targetX = sharkie.x + sharkie.width - 40;

                if (this.x > targetX) {
                    this.x = Math.max(targetX, this.x - 12);
                } else {
                    this.world.gameLost = true;
                    return;
                }

                const path = this.IMAGES_ATTACK[this.attackFrame];
                this.image = this.imageCache[path];
                this.attackFrame = (this.attackFrame + 1) % this.IMAGES_ATTACK.length;
                return;
            }

            if (this.phase === "waiting") {
                if (this.world?.character.x >= 1800) {
                    this.phase = "introduce";
                    this.introFrame = 0;
                } else {
                    return;
                }
            }

            if (this.phase === "introduce") {
                const path = this.IMAGES_INTRODUCE[this.introFrame];
                this.image = this.imageCache[path];
                this.introFrame++;

                if (this.introFrame >= this.IMAGES_INTRODUCE.length) {
                    this.introFinished = true;
                    this.phase = "floating";
                    this.phaseEndsAt = Date.now() + 2000;
                }
                return;
            }

            if (Date.now() < this.hurtUntil) {
                this.playAnimation(this.IMAGES_HURT);
                return;
            }

            if (this.phase === "floating") {
                this.playAnimation(this.IMAGES_WALKING);

                if (Date.now() >= this.phaseEndsAt) {
                    this.phase = "attack";
                    this.attackFrame = 0;
                    // this.phaseEndsAt = Date.now() + 4000;
                }
                return;
            }

            if (this.phase === "attack") {
                this.x = Math.max(2200, this.x - 3);
                const path = this.IMAGES_ATTACK[this.attackFrame];
                this.image = this.imageCache[path];
                this.attackFrame++;

                if (this.attackFrame >= this.IMAGES_ATTACK.length) {
                    this.phase = "floating";
                    this.phaseEndsAt = Date.now() + 300;
                }
            }
        }, 300);
    }

    hitByBubbles() {
        if (this.defeated) {
            return false;
        }

        this.hits++;
        this.hurtUntil = Date.now() + 800;

        if (this.hits >= 4) {
            this.defeated = true;

            let frame = 0;
            const deathAnimation = setInterval(() => {
                if (frame >= this.IMAGES_DEAD.length) {
                    clearInterval(deathAnimation);
                    return;
                }

                this.image = this.imageCache[this.IMAGES_DEAD[frame]];
                frame++;
            }, 200);

            return true;
        }

        return false;
    }

    draw(ctx) {
        super.draw(ctx);

        if (this.defeated || !this.world) return;

        const screenX = this.x + this.world.camera_x;
        const bossIsVisible =
            screenX < this.world.canvas.width &&
            screenX + this.width > 0;

        if (!bossIsVisible) return;
        if (!this.introFinished) return;

        if (this.messageShownAt === null) {
            startBossBgm();
            this.messageShownAt = Date.now();

        }

        if (Date.now() - (this.lastDialogueLogAt || 0) >= 1000) {
            console.log(
                'Poison bubbles:', this.world.collectedPoisonBubbles,
                'Seconds since boss message:',
                Math.floor((Date.now() - this.messageShownAt) / 1000)
            );
            this.lastDialogueLogAt = Date.now();
        }

        const sharkieCanReply =
            Date.now() - this.messageShownAt >= 7000;

        if (sharkieCanReply) {
            stopBossBgm();
            return;
        }

        const moveX = Math.sin(Date.now() / 250) * 5;
        const moveY = Math.sin(Date.now() / 400) * 8;

        const bubbleX = this.x - 210 + moveX;
        const bubbleY = this.y + 150 + moveY;
        const bubbleWidth = 220;
        const bubbleHeight = 70;

        ctx.fillStyle = "#ffffff";
        ctx.strokeStyle = "#073b66";
        ctx.lineWidth = 3;

        ctx.beginPath();
        ctx.moveTo(bubbleX + bubbleWidth - 50, bubbleY + bubbleHeight - 8);
        ctx.lineTo(bubbleX + bubbleWidth - 20, bubbleY + bubbleHeight - 8);
        ctx.lineTo(bubbleX + bubbleWidth + 15, bubbleY + bubbleHeight + 18);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();

        ctx.beginPath();
        ctx.ellipse(
            bubbleX + bubbleWidth / 2,
            bubbleY + bubbleHeight / 2,
            bubbleWidth / 2,
            bubbleHeight / 2,
            0,
            0,
            Math.PI * 2
        );
        ctx.fill();
        ctx.stroke();

        ctx.fillStyle = "#073b66";
        ctx.font = "bold 16px Arial";
        ctx.textAlign = "center";
        ctx.fillText(
            "You can only defeat me",
            bubbleX + bubbleWidth / 2,
            bubbleY + 28
        );
        ctx.fillText(
            "with 4 poison bubbles!",
            bubbleX + bubbleWidth / 2,
            bubbleY + 52
        );
    }
}