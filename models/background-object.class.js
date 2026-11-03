/**
 * A background layer positioned in the game world.
 * @extends MovableObject
 */
class BackgroundObject extends MovableObject {

    /** @type {number} Background image width in pixels. */
    width = 720; 

    /** @type {number} Background image height in pixels. */
    height = 480; 

    /**
     * Creates a background object at the given horizontal position.
     * @param {string} imagePath - Path to the background image.
     * @param {number} x - Horizontal position in the game world.
     */
    constructor(imagePath, x) {
        super();
        this.loadImage(imagePath);
        this.x = x;
        this.y = 480 - this.height;              
    }
}