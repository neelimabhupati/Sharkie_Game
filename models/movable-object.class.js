class MovableObject extends DrawbleObject {
    speed = 0.15;
    otherDirection = false;
    speedY = 0;
    acceleration = 1;
    energy = 100;
    lastHit = 0;

    applyGravity() {
        setInterval(() => {
            if (this.isAboveGround() || this.speedY > 0) {
                this.y -= this.speedY;
                this.speedY -= this.acceleration;
            }
        }, 1000 / 25);
    }

    isAboveGround() {
        if (this instanceof ThrowableObject) { // Throwable objects should always fall
            return true;
        }
        return this.y < 180;
    }

    isColliding(otherObject) {
        const box1 = this.getCollisionBox(this);
        const box2 = this.getCollisionBox(otherObject);
        return this.boxesOverlap(box1, box2);
    }

    getCollisionBox(object) {
        return {
            x: this.getCollisionX(object),
            y: this.getCollisionY(object),
            width: this.getCollisionWidth(object),
            height: this.getCollisionHeight(object)
        };
    }

    getCollisionX(object) {
        const offset = object.collisionOffsetX != null
            ? object.collisionOffsetX : 0;
        return object.x + offset;
    }

    getCollisionY(object) {
        const offset = object.collisionOffsetY != null
            ? object.collisionOffsetY : 0;
        return object.y + offset;
    }

    getCollisionWidth(object) {
        return object.collisionWidth != null
            ? object.collisionWidth : object.width;
    }

    getCollisionHeight(object) {
        return object.collisionHeight != null
            ? object.collisionHeight : object.height;
    }

    boxesOverlap(box1, box2) {
        return box1.x < box2.x + box2.width &&
            box1.x + box1.width > box2.x &&
            box1.y < box2.y + box2.height &&
            box1.y + box1.height > box2.y;
    }

    hit() {
        this.energy -= 25;
        if (this.energy < 0) this.energy = 0;
        this.lastHit = Date.now();
    }

    isHurt() {
        let timepassed = new Date().getTime() - this.lastHit; // difference in ms
        timepassed = timepassed / 1000; // Difference in s
        return timepassed < 1;
    }

    isDead() {
        return this.energy == 0;
    }

    moveRight() {
        this.x += this.speed;

    }

    moveLeft() {
        this.x -= this.speed;
    }

    playAnimation(images) {
        let i = this.currentImageIndex % images.length;
        let path = images[i];
        this.image = this.imageCache[path];
        this.currentImageIndex++;
    }

    jump() {
        this.speedY = 20;
    }

}