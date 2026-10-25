class Endboss extends MovableObject {

    height = 600;
    width = 250;
    y = -130;
    hits = 0;
    defeated = false;
    hurtUntil = 0;

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

    constructor() {
        super();
        this.loadImage(this.IMAGES_WALKING[0]);
        this.loadImages(this.IMAGES_WALKING);
        this.loadImages(this.IMAGES_HURT);
        this.loadImages(this.IMAGES_DEAD);
        this.x = 2500;
        this.animate();
    }

    animate() {
        setInterval(() => {
            if (this.defeated) {
                return;
            }

            if (Date.now() < this.hurtUntil) {
                this.playAnimation(this.IMAGES_HURT);
            } else {
                this.playAnimation(this.IMAGES_WALKING);
            }
        }, 200);
    }

    hitByBottle() {
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

        if (this.defeated) return;

        const moveX = Math.sin(Date.now() / 250) * 5;
        const moveY = Math.sin(Date.now() / 400) * 8;

        const bubbleX = this.x - 210 + moveX;
        const bubbleY = this.y + 150 + moveY;
        const bubbleWidth = 220;
        const bubbleHeight = 70;

        ctx.fillStyle = "#ffffff";
        ctx.strokeStyle = "#073b66";
        ctx.lineWidth = 3;

        // Speech tail
        ctx.beginPath();
        ctx.moveTo(bubbleX + bubbleWidth - 50, bubbleY + bubbleHeight - 8);
        ctx.lineTo(bubbleX + bubbleWidth - 20, bubbleY + bubbleHeight - 8);
        ctx.lineTo(bubbleX + bubbleWidth + 15, bubbleY + bubbleHeight + 18);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();

        // Bubble box
        ctx.beginPath();
        ctx.roundRect(bubbleX, bubbleY, bubbleWidth, bubbleHeight, 12);
        ctx.fill();
        ctx.stroke();

        // Bubble text
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