/**
 * Represents the coin status bar displayed in the game HUD.
 * It shows the player's collected coin progress through different image states.
 *
 * @extends DrawbleObject
 */
class CoinStatusBar extends DrawbleObject {
    /**
     * Collection of coin bar images representing progress from 0% to 100%.
     * Each image corresponds to a 20% interval.
     *
     * @type {string[]}
     */
    IMAGES = [
        './images/Grafiken-Sharkie/4. Marcadores/green/Coin/0_  copia 4.png',
        './images/Grafiken-Sharkie/4. Marcadores/green/Coin/20_  copia 2.png',
        './images/Grafiken-Sharkie/4. Marcadores/green/Coin/40_  copia 4.png',
        './images/Grafiken-Sharkie/4. Marcadores/green/Coin/60_  copia 4.png',
        './images/Grafiken-Sharkie/4. Marcadores/green/Coin/80_  copia 4.png',
        './images/Grafiken-Sharkie/4. Marcadores/green/Coin/100_ copia 4.png'
    ];

    /** Current coin percentage value.*/
    percentage = 0;

    /**
     * Creates a coin status bar and initializes its visual state.
     */
    constructor() {
        super();
        /**
         * Loads all coin bar images into cache for quick rendering.
         */
        this.loadImages(this.IMAGES);
        /**
         * Position and size of the coin bar in the HUD.
         */
        this.x = 50;
        this.y = 60;
        this.width = 200;
        this.height = 60;
        /**
         * Set the initial coin percentage to 0%.
         */
        this.setPercentage(0);
    }

    /**
     * Updates the current percentage and displays the matching image.
     *
     * @param {number} percentage - The coin percentage from 0 to 100.
     */
    setPercentage(percentage) {
        this.percentage = Math.max(0, Math.min(100, percentage));
        /**
         * Selects the image that matches the current percentage.
         */
        const imagePath = this.IMAGES[this.resultImageIndex()];
        this.image = this.imageCache[imagePath];

    }

    /**
     * Calculates the index of the image to use based on the current percentage.
     *
     * @returns {number} The image index for the current progress state.
     */
    resultImageIndex() {
        return Math.floor(this.percentage / 20);
    }

}