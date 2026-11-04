/**
 * Provides movement, gravity, collision detection, health, and animation
 * behavior for game objects that can move.
 *
 * @extends DrawbleObject
 */
class MovableObject extends DrawbleObject {
    /** Movement speed of the object. */
    speed = 0.15;

    /** Whether the object is facing the opposite direction. */
    otherDirection = false;

    /** Current vertical speed, affected by gravity. */
    speedY = 0;

    /** Amount by which gravity changes the vertical speed. */
    acceleration = 1;

    /** Current energy of the object. */
    energy = 100;

    /** Timestamp of the object's most recent hit. */
    lastHit = 0;

    /**
     * Applies gravity over time while the object is above the ground
     * or still moving upward.
     */
    applyGravity() {
        setInterval(() => {
            if (this.isAboveGround() || this.speedY > 0) {
                this.y -= this.speedY;
                this.speedY -= this.acceleration;
            }
        }, 1000 / 25);
    }

    /**
     * Checks whether the object is above the ground.
     * Throwable objects are treated as always being above the ground.
     *
     * @returns {boolean} True if the object is above the ground.
     */
    isAboveGround() {
        if (this instanceof ThrowableObject) { // Throwable objects should always fall
            return true;
        }
        return this.y < 180;
    }

    /**
     * Checks whether this object overlaps another object.
     *
     * @param {MovableObject} otherObject - The object to check for a collision.
     * @returns {boolean} True if the objects' collision boxes overlap.
     */
    isColliding(otherObject) {
        const box1 = this.getCollisionBox(this);
        const box2 = this.getCollisionBox(otherObject);
        return this.boxesOverlap(box1, box2);
    }

    /**
     * Creates a collision box using an object's position, size, and optional offsets.
     *
     * @param {MovableObject} object - The object whose collision box is created.
     * @returns {{x: number, y: number, width: number, height: number}} The object's collision box.
     */
    getCollisionBox(object) {
        return {
            x: this.getCollisionX(object),
            y: this.getCollisionY(object),
            width: this.getCollisionWidth(object),
            height: this.getCollisionHeight(object)
        };
    }

    /**
     * Gets an object's horizontal collision position, including its optional offset.
     *
     * @param {MovableObject} object - The object whose collision position is checked.
     * @returns {number} The horizontal collision position.
     */
    getCollisionX(object) {
        const offset = object.collisionOffsetX != null
            ? object.collisionOffsetX : 0;
        return object.x + offset;
    }

    /**
     * Gets an object's vertical collision position, including its optional offset.
     *
     * @param {MovableObject} object - The object whose collision position is checked.
     * @returns {number} The vertical collision position.
     */
    getCollisionY(object) {
        const offset = object.collisionOffsetY != null
            ? object.collisionOffsetY : 0;
        return object.y + offset;
    }

    /**
     * Gets an object's collision width, or its regular width if none is specified.
     *
     * @param {MovableObject} object - The object whose collision width is checked.
     * @returns {number} The collision width.
     */
    getCollisionWidth(object) {
        return object.collisionWidth != null
            ? object.collisionWidth : object.width;
    }

    /**
     * Gets an object's collision height, or its regular height if none is specified.
     *
     * @param {MovableObject} object - The object whose collision height is checked.
     * @returns {number} The collision height.
     */
    getCollisionHeight(object) {
        return object.collisionHeight != null
            ? object.collisionHeight : object.height;
    }

    /**
     * Checks whether two rectangular boxes overlap.
     *
     * @param {{x: number, y: number, width: number, height: number}} box1 - The first box.
     * @param {{x: number, y: number, width: number, height: number}} box2 - The second box.
     * @returns {boolean} True if the boxes overlap.
     */
    boxesOverlap(box1, box2) {
        return box1.x < box2.x + box2.width &&
            box1.x + box1.width > box2.x &&
            box1.y < box2.y + box2.height &&
            box1.y + box1.height > box2.y;
    }

    /**
     * Reduces the object's energy by 25 and records when the hit occurred.
     */
    hit() {
        this.energy -= 25;
        if (this.energy < 0) this.energy = 0;
        this.lastHit = Date.now();
    }

    /**
     * Checks whether the object was hit within the last second.
     *
     * @returns {boolean} True if the object is still in its hurt period.
     */
    isHurt() {
        let timepassed = new Date().getTime() - this.lastHit; // difference in ms
        timepassed = timepassed / 1000; // Difference in s
        return timepassed < 1;
    }

    /**
     * Checks whether the object's energy has reached zero.
     *
     * @returns {boolean} True if the object has no energy left.
     */
    isDead() {
        return this.energy == 0;
    }

    /** Moves the object to the right by its current speed. */
    moveRight() {
        this.x += this.speed;

    }

    /** Moves the object to the left by its current speed. */
    moveLeft() {
        this.x -= this.speed;
    }

    /**
     * Displays the next image in the given animation sequence.
     *
     * @param {string[]} images - Image paths for the animation frames.
     */
    playAnimation(images) {
        let i = this.currentImageIndex % images.length;
        let path = images[i];
        this.image = this.imageCache[path];
        this.currentImageIndex++;
    }

    /** Starts the object's upward movement by setting its vertical speed. */
    jump() {
        this.speedY = 20;
    }
}