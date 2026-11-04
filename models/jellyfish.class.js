/**
 * Represents a jellyfish enemy that moves leftward across the screen.
 * It can be animated while alive and stopped when defeated.
 *
 * @extends MovableObject
 */
class Jellyfish extends MovableObject {
    /** Width of the jellyfish sprite. */
    width = 100;

    /** Height of the jellyfish sprite. */
    height = 100;

    /** Whether the jellyfish is dead and should stop moving. */
    dead = false;

    /** Animation frames for the jellyfish swimming motion. */
    IMAGES_SWIMMING = [
        './images/Grafiken-Sharkie/2.Enemy/2 Jelly fish/Súper dangerous/Green 1.png',
        './images/Grafiken-Sharkie/2.Enemy/2 Jelly fish/Súper dangerous/Green 2.png',
        './images/Grafiken-Sharkie/2.Enemy/2 Jelly fish/Súper dangerous/Green 3.png',
        './images/Grafiken-Sharkie/2.Enemy/2 Jelly fish/Súper dangerous/Green 4.png'
    ];

    /**
     * Creates a jellyfish at the specified position.
     *
     * @param {number} x - Horizontal starting position.
     * @param {number} y - Vertical starting position.
     */
    constructor(x, y) {
        super();
        this.loadImage(this.IMAGES_SWIMMING[0]);
        this.loadImages(this.IMAGES_SWIMMING);
        this.x = x;
        this.y = y;
        this.speed = 2;
        this.animate();
    }

    /**
     * Marks the jellyfish as dead and stops its movement.
     */
    die() {
        this.dead = true;
        this.speed = 0;
    }

    /**
     * Starts the swimming animation loop.
     * The jellyfish moves left each interval until it is dead.
     */
    animate() {
        setInterval(() => {
            if (this.dead) return;

            this.x -= this.speed;
            this.playAnimation(this.IMAGES_SWIMMING);
        }, 200);
    }
}