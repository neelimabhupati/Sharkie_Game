/**
 * Displays the number of bubbles collected using a status-bar image.
 * @extends DrawbleObject
 */
class BubblesStatusBar extends DrawbleObject {
    /** @type {string[]} Images for each 20% status level. */
    IMAGES = [
        './images/Grafiken-Sharkie/4. Marcadores/green/poisoned bubbles/0_ copia 2.png',
        './images/Grafiken-Sharkie/4. Marcadores/green/poisoned bubbles/20_ copia 3.png',
        './images/Grafiken-Sharkie/4. Marcadores/green/poisoned bubbles/40_ copia 2.png',
        './images/Grafiken-Sharkie/4. Marcadores/green/poisoned bubbles/60_ copia 2.png',
        './images/Grafiken-Sharkie/4. Marcadores/green/poisoned bubbles/80_ copia 2.png',
        './images/Grafiken-Sharkie/4. Marcadores/green/poisoned bubbles/100_ copia 3.png'
    ];

    /** @type {number} Current bubble status percentage, from 0 to 100. */
    percentage = 0;

    /** Loads the status images and initializes the bar. */
    constructor() {
        super();
        this.loadImages(this.IMAGES);
        this.x = 50;
        this.y = 90;
        this.width = 200;
        this.height = 60;
        this.setPercentage(0);
    }

    /**
     * Updates the bar image to match the given percentage.
     * @param {number} percentage - Status percentage, clamped to 0–100.
     */
    setPercentage(percentage) {
        this.percentage = Math.max(0, Math.min(100, percentage));
        const imagePath = this.IMAGES[Math.floor(this.percentage / 20)];
        this.image = this.imageCache[imagePath];
    }

}