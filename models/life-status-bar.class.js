/**
 * Represents the player's life status bar in the game HUD.
 * Displays the appropriate image based on the player's remaining health.
 *
 * @extends DrawbleObject
 */
class LifeStatusBar extends DrawbleObject {

    /** Images representing life levels from 0% to 100%. */
    IMAGES = [
        './images/Grafiken-Sharkie/4. Marcadores/green/Life/0_  copia 3.png',
        './images/Grafiken-Sharkie/4. Marcadores/green/Life/20_ copia 4.png',
        './images/Grafiken-Sharkie/4. Marcadores/green/Life/40_  copia 3.png',
        './images/Grafiken-Sharkie/4. Marcadores/green/Life/60_  copia 3.png',
        './images/Grafiken-Sharkie/4. Marcadores/green/Life/80_  copia 3.png',
        './images/Grafiken-Sharkie/4. Marcadores/green/Life/100_  copia 2.png',
    ];

    /** Current life percentage. */
    percentage = 100;

    /**
     * Initializes the life status bar by loading its images,
     * positioning it in the HUD, and setting the initial life level to 100%.
     */
    constructor() {
        super();
        this.loadImages(this.IMAGES);
        this.x = 50;
        this.y = 30;
        this.width = 200;
        this.height = 60;
        this.setPercentage(100);
    }

    /**
     * Updates the life percentage and displays the matching status bar image.
     *
     * @param {number} percentage - The player's current life percentage.
     */
    setPercentage(percentage) {
        this.percentage = percentage;
        let path = this.IMAGES[this.resultImageIndex()];
        this.image = this.imageCache[path];
    }

    /**
     * Returns the image index that corresponds to the current life percentage.
     *
     * @returns {number} The index of the matching image in the image array.
     */
    resultImageIndex() {
        if (this.percentage == 100) {
            return 5;
        } else if (this.percentage == 80) {
            return 4;
        } else if (this.percentage > 60) {
            return 3;
        } else if (this.percentage > 40) {
            return 2;
        } else if (this.percentage > 20) {
            return 1;
        } else {
            return 0;
        }
    }
}