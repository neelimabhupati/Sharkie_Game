/**
 * Base class for objects that can be drawn on the canvas.
 */
class DrawbleObject {
     /** @type {HTMLImageElement | undefined} */
    image;

     /** @type {Object.<string, HTMLImageElement>} */
    imageCache = {};

     /** @type {number} Index of the current animation image. */
    currentImageIndex = 0;

    /** @type {number} Horizontal position on the canvas. */
    x = 120;

    /** @type {number} Vertical position on the canvas. */
    y = 280;

    /** @type {number} Display height in pixels. */
    height = 150;

    /** @type {number} Display width in pixels. */
    width = 100;

    /**
     * Creates an image and sets its source path.
     * @param {string} path - Path to the image file.
     */
    loadImage(path) {
        this.image = new Image();
        this.image.src = path;
    }

    /**
     * Draws the current image on the canvas.
     * @param {CanvasRenderingContext2D} ctx - Canvas drawing context.
     */
    draw(ctx) {
        ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
    }

    /**
     * Optional hook for drawing an object's frame; currently does nothing because hiding the red box.
     * @param {CanvasRenderingContext2D} ctx - Canvas drawing context.
     */
    drawFrame(ctx) {
        // if (this instanceof Character || this instanceof Chicken) {
        //     const x = this.x + (this.collisionOffsetX ?? 0);
        //     const y = this.y + (this.collisionOffsetY ?? 0);
        //     const width = this.collisionWidth ?? this.width;
        //     const height = this.collisionHeight ?? this.height;

        //     ctx.beginPath();
        //     ctx.lineWidth = 3;
        //     ctx.strokeStyle = 'red';
        //     ctx.rect(x, y, width, height);
        //     ctx.stroke();
        // }
    }

    /**
     * Loads images into the cache, keyed by their source paths.
     * @param {string[]} arr - Image file paths to load.
     */
    loadImages(arr) {
        arr.forEach((path) => {
            let image = new Image();
            image.src = path;
            this.imageCache[path] = image;
        });
    }

}