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

    // character.isColliding(chicken);
    isColliding(mo) {
        const thisX = this.x + (this.collisionOffsetX ?? 0);
        const thisY = this.y + (this.collisionOffsetY ?? 0);
        const thisWidth = this.collisionWidth ?? this.width;
        const thisHeight = this.collisionHeight ?? this.height;

        const otherX = mo.x + (mo.collisionOffsetX ?? 0);
        const otherY = mo.y + (mo.collisionOffsetY ?? 0);
        const otherWidth = mo.collisionWidth ?? mo.width;
        const otherHeight = mo.collisionHeight ?? mo.height;

        return thisX < otherX + otherWidth &&
            thisX + thisWidth > otherX &&
            thisY < otherY + otherHeight &&
            thisY + thisHeight > otherY;
    }

    hit() {
        this.energy -= 5;
        if (this.energy < 0) {
            this.energy = 0;
        } else {
            this.lastHit = new Date().getTime();
        }
    }

    isHurt() {
        let timepassed = new Date().getTime() - this.lastHit; // difference in ms
        timepassed = timepassed / 1000; // Difference in s
        // console.log(timepassed);
        return timepassed < 1;
    }

    isDead() {
        return this.energy == 0;
    }

    moveRight() {
        // console.log("Moving right");
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