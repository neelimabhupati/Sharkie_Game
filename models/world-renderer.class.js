
class WorldRenderer {
    constructor(world) {
        this.world = world;
    }

    draw() {
        this.clearCanvas();

        if (this.drawResultScreen()) {
            this.requestNextFrame();
            return;
        }

        this.drawGameScene();
        this.requestNextFrame();
    }

    clearCanvas() {
        const world = this.world;
        world.ctx.clearRect(0, 0, world.canvas.width, world.canvas.height);
    }

    drawResultScreen() {
        const world = this.world;
        if (!world.gameWon && !world.gameLost) return false;
        document.getElementById("replay-button").style.display = "block";
        const image = world.gameWon ? world.winImage : world.loseImage;
        this.drawResultImage(image);
        return true;
    }

    drawResultImage(image) {
        const world = this.world;
        if (!image.complete || image.naturalWidth === 0) return;
        world.ctx.drawImage(image, 0, 0, world.canvas.width, world.canvas.height);
    }

    drawGameScene() {
        this.drawBackground();
        this.drawStatusBars();
        this.drawGameObjects();
    }

    drawBackground() {
        const world = this.world;
        world.ctx.translate(world.camera_x, 0);
        this.addObjecttoMap(world.level.backgroundObjects);
        world.ctx.translate(-world.camera_x, 0);
    }

    drawStatusBars() {
        const world = this.world;
        this.addToMap(world.lifeStatusBar);
        this.addToMap(world.coinStatusBar);
        this.addToMap(world.BubblesStatusBar);
    }

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

    requestNextFrame() {
        requestAnimationFrame(() => this.draw());
    }

    addObjecttoMap(Objects) {
        Objects.forEach((object) => {
            this.addToMap(object);
        });
    }

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

    flipImage(mo) {
        const ctx = this.world.ctx;
        ctx.save();
        ctx.translate(2 * mo.x + mo.width, 0);
        ctx.scale(-1, 1);
    }

    flipImageBack() {
        this.world.ctx.restore();
    }
}