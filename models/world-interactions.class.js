/**
 * Handles collisions between the character and objects in the game world,
 * including enemies, the Endboss, coins, and collectible bubbles.
 */
class WorldInteractions {
    /**
     * Checks for all types of collisions in the current game world.
     */
    checkCollisions() {
        this.checkEnemyCollisions();
        this.checkEndbossCollisions();
        this.checkCoinCollisions();
        this.checkBubbleCollisions();
    }

    /**
     * Checks whether the character collides with any enemy.
     */
    checkEnemyCollisions() {
        for (let i = this.level.enemies.length - 1; i >= 0; i--) {
            this.handleEnemyCollision(this.level.enemies[i]);
        }
    }

    /**
     * Handles a collision between the character and an enemy.
     *
     * @param {MovableObject} enemy - The enemy to check.
     */
    handleEnemyCollision(enemy) {
        if (enemy.dead) return;
        if (this.checkFinAttackCollision(enemy)) return;
        if (!this.character.isColliding(enemy)) return;
        this.handleEnemyHit(enemy);
    }

    /**
     * Applies the appropriate result when the character hits an enemy:
     * damage to the character or a stomp that defeats the enemy.
     *
     * @param {MovableObject} enemy - The enemy hit by the character.
     */
    handleEnemyHit(enemy) {
        if (!this.isEnemyStomp(enemy)) {
            this.damageCharacter();
            return;
        }

        this.playEnemyHitSound();
        this.character.jump();
        enemy.die();
        this.removeEnemyAfterDelay(enemy);
    }

    /** Plays the sound when an enemy is defeated. */
    playEnemyHitSound() {
        this.enemyHitSound.currentTime = 0;
        this.enemyHitSound.play().catch(error => {
            console.error("Could not play enemy hit sound:", error);
        });
    }
    /**
     * Checks whether the character's fin attack hits an enemy.
     *
     * @param {MovableObject} enemy - The enemy to check.
     * @returns {boolean} True if the fin attack hits and defeats the enemy.
     */
    checkFinAttackCollision(enemy) {
        if (enemy instanceof Endboss) return false;
        if (!this.character.finAttackActive) return false;
        if (this.character.finAttackHits.has(enemy)) return false;
        if (!this.character.isFinSlapColliding(enemy)) return false;
        this.character.finAttackHits.add(enemy);
        this.playEnemyHitSound();
        enemy.die();
        this.removeEnemyAfterDelay(enemy);
        return true;
    }

    /**
     * Checks whether the character is stomping a supported enemy while
     * the down key is pressed.
     *
     * @param {MovableObject} enemy - The enemy to check.
     * @returns {boolean} True if the collision counts as a stomp.
     */
    isEnemyStomp(enemy) {
        const canStomp =
            enemy instanceof PufferFish || enemy instanceof Jellyfish;

        return canStomp && this.keyboard.DOWN;
    }

    /**
     * Schedules an enemy to be removed after a short delay.
     *
     * @param {MovableObject} enemy - The enemy to remove.
     */
    removeEnemyAfterDelay(enemy) {
        setTimeout(() => this.removeEnemy(enemy), 500);
    }

    /**
     * Removes an enemy from the current level.
     *
     * @param {MovableObject} enemy - The enemy to remove.
     */
    removeEnemy(enemy) {
        const index = this.level.enemies.indexOf(enemy);
        if (index !== -1) this.level.enemies.splice(index, 1);
    }

    /**
     * Damages the character, updates the life bar, and plays the hurt sound
     * when the character is not already dead or hurt.
     */
    damageCharacter() {
        if (this.character.isDead() || this.character.isHurt()) return;

        this.character.hit();
        this.lifeStatusBar.setPercentage(this.character.energy);

        if (this.character.isDead()) {
            this.stopHurtSound();
            return;
        }

        this.playHurtSound();
    }

    /**
     * Stops the hurt sound and resets it to the beginning.
     */
    stopHurtSound() {
        this.hurtSound.pause();
        this.hurtSound.currentTime = 0;
    }

    /**
     * Plays the hurt sound from the beginning and logs playback errors.
     */
    playHurtSound() {
        this.hurtSound.currentTime = 0;
        this.hurtSound.play().catch(error => {
            console.error("Could not play hurt sound:", error);
        });
    }

    /**
     * Checks whether a thrown poison bubble hits the Endboss.
     */
    checkEndbossCollisions() {
        const boss = this.level.enemies.find(
            enemy => enemy instanceof Endboss
        );
        if (!boss || boss.defeated) return;
        for (let i = this.throwableObjects.length - 1; i >= 0; i--) {
            if (this.hitEndbossWithBubble(boss, i)) break;
        }
    }

    /**
     * Checks whether a thrown bubble hits the Endboss and handles the hit.
     *
     * @param {Endboss} boss - The Endboss being checked.
     * @param {number} index - Index of the throwable object to check.
     * @returns {boolean} True if this hit defeats the Endboss.
     */
    hitEndbossWithBubble(boss, index) {
        const bubble = this.throwableObjects[index];
        if (!bubble.isColliding(boss)) return false;
        this.throwableObjects.splice(index, 1);
        if (!boss.hitByBubbles()) return false;

        setTimeout(() => this.finishEndboss(boss), 1500);
        return true;
    }

    /**
     * Removes the defeated Endboss and schedules the win screen to appear.
     *
     * @param {Endboss} boss - The defeated Endboss.
     */
    finishEndboss(boss) {
        this.removeEnemy(boss);
        setTimeout(() => this.showWinScreen(), 600);
    }

    /**
     * Sets the game to its won state and starts the victory music.
     */
    showWinScreen() {
        this.gameWon = true;
        startWinningBgm();
    }

    /**
     * Checks whether the character collects any coins.
     */
    checkCoinCollisions() {
        for (let i = this.level.coins.length - 1; i >= 0; i--) {
            const coin = this.level.coins[i];
            if (this.character.isColliding(coin)) this.collectCoin(coin, i);
        }
    }

    /**
     * Removes a collected coin, updates the collection count,
     * plays its sound, and refreshes the coin status bar.
     *
     * @param {Coin} coin - The collected coin.
     * @param {number} index - The coin's index in the level.
     */
    collectCoin(coin, index) {
        this.level.coins.splice(index, 1);
        this.collectedCoins++;
        this.playCoinSound();
        this.updateCoinStatus();
    }

    /**
     * Plays the coin collection sound from the beginning and logs playback errors.
     */
    playCoinSound() {
        this.coinSound.currentTime = 0;
        this.coinSound.play().catch(error => {
            console.error("Could not play coin sound:", error);
        });
    }

    /**
     * Updates the coin status bar based on the number of coins collected.
     */
    updateCoinStatus() {
        const percentage = (this.collectedCoins / this.totalCoins) * 100;
        this.coinStatusBar.setPercentage(percentage);
    }

    /**
     * Checks whether the character collects any bubbles.
     */
    checkBubbleCollisions() {
        for (let i = this.level.bubbles.length - 1; i >= 0; i--) {
            const bubble = this.level.bubbles[i];
            if (!this.character.isColliding(bubble)) continue;
            if (this.collectedBubbles >= this.totalBubbles) continue;
            this.collectBubble(bubble, i);
        }
    }

    /**
     * Removes a collected bubble, updates collection counts,
     * plays its sound, and refreshes the bubble status bar.
     *
     * @param {Bubble} bubble - The collected bubble.
     * @param {number} index - The bubble's index in the level.
     */
    collectBubble(bubble, index) {
        this.level.bubbles.splice(index, 1);
        this.collectedBubbles++;
        this.playBubbleSound();
        this.countPoisonBubble(bubble);
        this.updateBubbleStatus();
    }

    /**
     * Plays the bubble collection sound from the beginning and logs playback errors.
     */
    playBubbleSound() {
        this.bubbleSound.currentTime = 0;
        this.bubbleSound.play().catch(error => {
            console.error("Could not play bubble sound:", error);
        });
    }

    /**
     * Increases the poison bubble count if the collected bubble is poisoned.
     *
     * @param {Bubble} bubble - The collected bubble.
     */
    countPoisonBubble(bubble) {
        if (!bubble.isPoisoned) return;
        this.collectedPoisonBubbles++;
            }

    /**
     * Updates the bubble status bar based on the number of bubbles collected.
     */
    updateBubbleStatus() {
        const percentage = (this.collectedBubbles / this.totalBubbles) * 100;
        this.BubblesStatusBar.setPercentage(percentage);
    }
}