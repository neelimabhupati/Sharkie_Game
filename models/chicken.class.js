class Chicken extends MovableObject {
    y = 360;
    height = 65;
    width = 80;
    dead = false;

    IMAGES_WALKING = [
        './images/Grafiken-Sharkie/2.Enemy/1.Puffer fish (3 color options)/1.Swim/1.swim1.png',
        './images/Grafiken-Sharkie/2.Enemy/1.Puffer fish (3 color options)/1.Swim/1.swim2.png',
        './images/Grafiken-Sharkie/2.Enemy/1.Puffer fish (3 color options)/1.Swim/1.swim3.png',
        './images/Grafiken-Sharkie/2.Enemy/1.Puffer fish (3 color options)/1.Swim/1.swim4.png',
        './images/Grafiken-Sharkie/2.Enemy/1.Puffer fish (3 color options)/1.Swim/1.swim5.png'
    ];

    constructor(x = 200 + Math.random() * 500) {
        super();
        this.loadImage(this.IMAGES_WALKING[0]);
        this.loadImages(this.IMAGES_WALKING);
        this.x = x;
        this.speed = 0.15 + Math.random() * 0.25;
        this.animate();
    }

    animate() {
        setInterval(() => {
            if (!this.world?.gameStarted || this.dead) return;

            this.moveLeft();
        }, 1000 / 60);

        setInterval(() => {
            if (this.dead) return;

            if (this.world?.gameStarted) {
                this.x -= this.speed;
            }

            this.playAnimation(this.IMAGES_SWIMMING);
        }, 200);
    }

    die() {
        this.dead = true;
        this.speed = 0;
        this.loadImage('./images/Grafiken-Sharkie/2.Enemy/1.Puffer fish (3 color options)/4.DIE/1.Dead 1 (can animate by going up).png');
    }
}