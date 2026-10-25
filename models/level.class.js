class Level {
    enemies;
    backgroundObjects;
    coins;
    bubble;
    level_end_x = 2200;

    constructor(enemies, backgroundObjects, coins, bubbles) {
        this.enemies = enemies;
       
        this.backgroundObjects = backgroundObjects;
        this.coins = coins;
        this.bubbles = bubbles;
    }
}