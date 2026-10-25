class Bottle extends DrawbleObject {
    constructor(
        x,
        y,
        imagePath = './images/Grafiken-Sharkie/1.Sharkie/4.Attack/Bubble trap/Bubble.png' 
    ) {
        super();
        this.loadImage('./images/Grafiken-Sharkie/1.Sharkie/4.Attack/Bubble trap/Bubble.png');
        this.loadImage(imagePath);
        this.isPoisoned = imagePath.includes('Poisoned Bubble');
        this.x = x;
        this.y = y;
        this.width = 60;
        this.height = 80;
    }
}