class WorldInteractions {
    checkCollisions() {
        this.checkEnemyCollisions();
        this.checkEndbossCollisions();
        this.checkCoinCollisions();
        this.checkBubbleCollisions();
    }

    checkEnemyCollisions() {
        for (let i = this.level.enemies.length - 1; i >= 0; i--) {
            this.handleEnemyCollision(this.level.enemies[i]);
        }
    }

    handleEnemyCollision(enemy) {
        if (enemy.dead) return;
        if (this.checkFinAttackCollision(enemy)) return;
        if (!this.character.isColliding(enemy)) return;
        this.handleEnemyHit(enemy);
    }

    handleEnemyHit(enemy) {
        if (!this.isEnemyStomp(enemy)) {
            this.damageCharacter();
            return;
        }

        enemy.die();
        this.character.jump();
        this.removeEnemyAfterDelay(enemy);
    }

    checkFinAttackCollision(enemy) {
        if (enemy instanceof Endboss) return false;
        if (!this.character.finAttackActive) return false;
        if (this.character.finAttackHits.has(enemy)) return false;
        if (!this.character.isFinSlapColliding(enemy)) return false;
        this.character.finAttackHits.add(enemy);
        enemy.die();
        this.removeEnemyAfterDelay(enemy);
        return true;
    }

    isEnemyStomp(enemy) {
        const canStomp =
            enemy instanceof PufferFish || enemy instanceof Jellyfish;

        return canStomp && this.keyboard.DOWN;
    }

    removeEnemyAfterDelay(enemy) {
        setTimeout(() => this.removeEnemy(enemy), 500);
    }

    removeEnemy(enemy) {
        const index = this.level.enemies.indexOf(enemy);
        if (index !== -1) this.level.enemies.splice(index, 1);
    }

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

    stopHurtSound() {
        this.hurtSound.pause();
        this.hurtSound.currentTime = 0;
    }

    playHurtSound() {
        this.hurtSound.currentTime = 0;
        this.hurtSound.play().catch(error => {
            console.error("Could not play hurt sound:", error);
        });
    }

    checkEndbossCollisions() {
        const boss = this.level.enemies.find(
            enemy => enemy instanceof Endboss
        );
        if (!boss || boss.defeated) return;
        for (let i = this.throwableObjects.length - 1; i >= 0; i--) {
            if (this.hitEndbossWithBubble(boss, i)) break;
        }
    }

    hitEndbossWithBubble(boss, index) {
        const bubble = this.throwableObjects[index];
        if (!bubble.isColliding(boss)) return false;
        this.throwableObjects.splice(index, 1);
        if (!boss.hitByBubbles()) return false;

        // this.fightSound.currentTime = 0;
        // this.fightSound.play().catch(error => {
        //     console.error("Could not play fight sound:", error);
        // });

        setTimeout(() => this.finishEndboss(boss), 1500);
        return true;
    }

    finishEndboss(boss) {
        this.removeEnemy(boss);
        setTimeout(() => this.showWinScreen(), 600);
    }

    showWinScreen() {
        this.gameWon = true;
        startWinningBgm();
    }

    checkCoinCollisions() {
        for (let i = this.level.coins.length - 1; i >= 0; i--) {
            const coin = this.level.coins[i];
            if (this.character.isColliding(coin)) this.collectCoin(coin, i);
        }
    }

    collectCoin(coin, index) {
        this.level.coins.splice(index, 1);
        this.collectedCoins++;
        this.playCoinSound();
        this.updateCoinStatus();
    }

    playCoinSound() {
        this.coinSound.currentTime = 0;
        this.coinSound.play().catch(error => {
            console.error("Could not play coin sound:", error);
        });
    }

    updateCoinStatus() {
        const percentage = (this.collectedCoins / this.totalCoins) * 100;
        this.coinStatusBar.setPercentage(percentage);
    }

    checkBubbleCollisions() {
        for (let i = this.level.bubbles.length - 1; i >= 0; i--) {
            const bubble = this.level.bubbles[i];
            if (!this.character.isColliding(bubble)) continue;
            if (this.collectedBubbles >= this.totalBubbles) continue;
            this.collectBubble(bubble, i);
        }
    }

    collectBubble(bubble, index) {
        this.level.bubbles.splice(index, 1);
        this.collectedBubbles++;
        this.playBubbleSound();
        this.countPoisonBubble(bubble);
        this.updateBubbleStatus();
    }

    playBubbleSound() {
        this.bubbleSound.currentTime = 0;
        this.bubbleSound.play().catch(error => {
            console.error("Could not play bubble sound:", error);
        });
    }

    countPoisonBubble(bubble) {
        if (!bubble.isPoisoned) return;
        this.collectedPoisonBubbles++;
        console.log("Poison bubbles collected:", this.collectedPoisonBubbles);
    }

    updateBubbleStatus() {
        const percentage = (this.collectedBubbles / this.totalBubbles) * 100;
        this.BubblesStatusBar.setPercentage(percentage);
    }
}