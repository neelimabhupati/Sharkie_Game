class Jellyfish extends MovableObject {
    width = 100;
    height = 100;
    dead = false;

    IMAGES_SWIMMING = [
        './images/Grafiken-Sharkie/2.Enemy/2 Jelly fish/Súper dangerous/Green 1.png',
        './images/Grafiken-Sharkie/2.Enemy/2 Jelly fish/Súper dangerous/Green 2.png',
        './images/Grafiken-Sharkie/2.Enemy/2 Jelly fish/Súper dangerous/Green 3.png',
        './images/Grafiken-Sharkie/2.Enemy/2 Jelly fish/Súper dangerous/Green 4.png'
    ];

    constructor(x, y) {
        super();
        this.loadImage(this.IMAGES_SWIMMING[0]);
        this.loadImages(this.IMAGES_SWIMMING);
        this.x = x;
        this.y = y;
        this.speed = 1;
        this.animate();
    }
    die() {
        this.dead = true;
        this.speed = 0;
    }
    animate() {
        setInterval(() => {
            if (this.dead) return;

            this.x -= this.speed;
            this.playAnimation(this.IMAGES_SWIMMING);
        }, 200);
    }
}