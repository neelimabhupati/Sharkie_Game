/**
 * Handles drawing the game world, its objects, and the win/loss screens.
 */
class WorldRenderer {
    /**
     * Creates a renderer for the given game world.
     *
     * @param {World} world - The game world to render.
     */
    constructor(world) {
        this.world = world;
    }

    /**
     * Clears the canvas, draws the current game screen, and schedules
     * the next animation frame.
     */
    draw() {
        this.clearCanvas();

        if (this.drawResultScreen()) {
            this.requestNextFrame();
            return;
        }

        this.drawGameScene();
        this.requestNextFrame();
    }

    /** Clears the entire game canvas. */
    clearCanvas() {
        const world = this.world;
        world.ctx.clearRect(0, 0, world.canvas.width, world.canvas.height);
    }

    /**
     * Draws the win or loss screen when the game has ended.
     *
     * @returns {boolean} True if a result screen was drawn.
     */
    drawResultScreen() {
        const world = this.world;
        if (!world.gameWon && !world.gameLost) return false;
        document.getElementById("replay-button").style.display = "block";
        const image = world.gameWon ? world.winImage : world.loseImage;
        this.drawResultImage(image);
        return true;
    }

    /**
     * Draws a result image if it has loaded successfully.
     *
     * @param {HTMLImageElement} image - The win or loss screen image.
     */
    drawResultImage(image) {
        const world = this.world;
        if (!image.complete || image.naturalWidth === 0) return;
        world.ctx.drawImage(image, 0, 0, world.canvas.width, world.canvas.height);
    }

    /** Draws the background, status bars, and game objects. */
    drawGameScene() {
        this.drawBackground();
        this.drawStatusBars();
        this.drawGameObjects();
    }

    /** Draws the background objects using the camera offset. */
    drawBackground() {
        const world = this.world;
        world.ctx.translate(world.camera_x, 0);
        this.addObjecttoMap(world.level.backgroundObjects);
        world.ctx.translate(-world.camera_x, 0);
    }

    /** Draws the life, coin, and bubble status bars. */
    drawStatusBars() {
        const world = this.world;
        this.addToMap(world.lifeStatusBar);
        this.addToMap(world.coinStatusBar);
        this.addToMap(world.BubblesStatusBar);
    }

    /** Draws the character, enemies, collectibles, and thrown objects. */
    drawGameObjects() {
        const world = this.world;

        world.ctx.translate(world.camera_x, 0);
        this.addToMap(world.character);
        this.addObjecttoMap(world.level.enemies);
        this.addObjecttoMap(world.level.coins);
        this.addObjecttoMap(world.level.bubbles);
        this.addObjecttoMap(world.throwableObjects);
        world.ctx.translate(-world.camera_x, 0);
    }

    /** Schedules the next game rendering frame. */
    requestNextFrame() {
        requestAnimationFrame(() => this.draw());
    }

    /**
     * Draws each object in the provided collection.
     *
     * @param {DrawableObject[]} Objects - Objects to draw on the map.
     */
    addObjecttoMap(Objects) {
        Objects.forEach((object) => {
            this.addToMap(object);
        });
    }

    /**
     * Draws an object, flipping it horizontally when it faces the opposite direction.
     *
     * @param {DrawableObject} mo - The object to draw.
     */
    addToMap(mo) {
        const ctx = this.world.ctx;

        if (mo.otherDirection) {
            this.flipImage(mo)
        }

        mo.draw(ctx);
        mo.drawFrame(ctx);

        if (mo.otherDirection) {
            this.flipImageBack(mo);
        }
    }

    /**
     * Saves the canvas state and flips it horizontally around the object's position.
     *
     * @param {DrawableObject} mo - The object whose image should be flipped.
     */
    flipImage(mo) {
        const ctx = this.world.ctx;
        ctx.save();
        ctx.translate(2 * mo.x + mo.width, 0);
        ctx.scale(-1, 1);
    }

    /** Restores the canvas state after drawing a flipped object. */
    flipImageBack() {
        this.world.ctx.restore();
    }
}