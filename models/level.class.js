/**
 * Holds the objects and boundary data for a game level.
 */
class Level {
    enemies;
    backgroundObjects;
    coins;
    bubbles;
    /** The horizontal position where the level ends. */
    level_end_x = 2200;

    /**
     * Creates a level with its enemies, backgrounds, coins, and bubbles.
     * @param {MovableObject[]} enemies - Enemies in the level.
     * @param {BackgroundObject[]} backgroundObjects - Background sections.
     * @param {Coin[]} coins - Collectible coins.
     * @param {Bubble[]} bubbles - Collectible bubbles.
     */
    constructor(enemies, backgroundObjects, coins, bubbles) {
        this.enemies = enemies;
       
        this.backgroundObjects = backgroundObjects;
        this.coins = coins;
        this.bubbles = bubbles;
    }
}