/**
 * Represents a puffer fish enemy that swims across the game world.
 *
 * @extends MovableObject
 */
class PufferFish extends MovableObject {
    /** Vertical position of the puffer fish. */
    y = 360;

    /** Height of the puffer fish sprite. */
    height = 65;

    /** Width of the puffer fish sprite. */
    width = 80;

    /** Whether the puffer fish has been defeated. */
    dead = false;

    /** Sprite images used for the swimming animation. */
    IMAGES_WALKING = [
        './images/Grafiken-Sharkie/2.Enemy/1.Puffer fish (3 color options)/1.Swim/1.swim1.png',
        './images/Grafiken-Sharkie/2.Enemy/1.Puffer fish (3 color options)/1.Swim/1.swim2.png',
        './images/Grafiken-Sharkie/2.Enemy/1.Puffer fish (3 color options)/1.Swim/1.swim3.png',
        './images/Grafiken-Sharkie/2.Enemy/1.Puffer fish (3 color options)/1.Swim/1.swim4.png',
        './images/Grafiken-Sharkie/2.Enemy/1.Puffer fish (3 color options)/1.Swim/1.swim5.png'
    ];

    /**
     * Creates a puffer fish at the given horizontal position.
     * If no position is provided, a random starting position is chosen.
     *
     * @param {number} [x] - Horizontal starting position.
     * @param {number} [y] - Vertical starting position.
     */
    constructor(x = 200 + Math.random() * 500 , y = 360) {
        super();
        this.loadImage(this.IMAGES_WALKING[0]);
        this.loadImages(this.IMAGES_WALKING);
        this.x = x;
        this.y = y;
        this.speed = 0.15 + Math.random() * 0.25;
        this.animate();
    }

    /**
     * Starts the puffer fish's movement and swimming animation loops.
     * The fish moves left continuously, and its swimming frames play while alive.
     */
    animate() {
        setInterval(() => {
            this.moveLeft();
        }, 1000 / 60);

        setInterval(() => {
            if (this.dead) return;
            this.playAnimation(this.IMAGES_WALKING);
        }, 200);
    }

    /**
     * Marks the puffer fish as defeated, stops its movement,
     * and displays its death image.
     */
    die() {
        this.dead = true;
        this.speed = 0;
        this.loadImage('./images/Grafiken-Sharkie/2.Enemy/1.Puffer fish (3 color options)/4.DIE/1.Dead 1 (can animate by going up).png');
    }
}