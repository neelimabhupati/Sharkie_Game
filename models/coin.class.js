/**
 * A collectible coin displayed in the game world.
 * @extends DrawbleObject
 */
class Coin extends DrawbleObject {
    /**
     * Creates a coin at the given position.
     * @param {number} x - Horizontal position in the game world.
     * @param {number} y - Vertical position in the game world.
     */
    constructor(x, y) {
        super();
        this.loadImage('./images/Grafiken-Sharkie/4. Marcadores/1. Coins/1.png');
        this.x = x;
        this.y = y;
        this.width = 50;
        this.height = 50;
    }
}