/**
 * Represents a throwable poison bubble used to attack the Endboss.
 *
 * @extends MovableObject
 */
class ThrowableObject extends MovableObject {

    /** Image used for the poison bubble. */
    IMAGES_ROTATION = [
        './images/Grafiken-Sharkie/1.Sharkie/4.Attack/Bubble trap/Poisoned Bubble (for whale).png'
    ];

    /**
     * Creates a poison bubble at the given position and launches it
     * in the specified direction.
     *
     * @param {number} x - Horizontal starting position.
     * @param {number} y - Vertical starting position.
     * @param {number} direction - Direction of travel (positive or negative).
     */
    constructor(x, y, direction) {
        super();
        this.loadImage(this.IMAGES_ROTATION[0]);
        this.loadImages(this.IMAGES_ROTATION);
        this.x = x;
        this.y = y;
        this.height = 80;
        this.width = 90;
        this.direction = direction;
        this.throw();
    }

    /**
     * Moves the poison bubble horizontally in its launch direction.
     */
    throw() {
        setInterval(() => {
            this.x += 6 * this.direction;
        }, 1000 / 60);
    }
}