/**
 * A collectible bubble that can be normal or poisoned.
 * @extends DrawbleObject
 */
class Bubble extends DrawbleObject {
    /**
     * Creates a bubble at the given position.
     * @param {number} x - Horizontal position in the game world.
     * @param {number} y - Vertical position in the game world.
     * @param {string} [imagePath='./images/Grafiken-Sharkie/1.Sharkie/4.Attack/Bubble trap/Bubble.png']
     *        Path to the bubble image.
     */
    constructor(
        x,
        y,
        imagePath = './images/Grafiken-Sharkie/1.Sharkie/4.Attack/Bubble trap/Bubble.png'
    ) {
        super();
        // this.loadImage('./images/Grafiken-Sharkie/1.Sharkie/4.Attack/Bubble trap/Bubble.png');
        this.loadImage(imagePath);
        this.isPoisoned = imagePath.includes('Poisoned Bubble');
        this.x = x;
        this.y = y;
        this.width = 60;
        this.height = 80;
    }
}