let level1;

function initLevel() {

    level1 = new Level([

        new PufferFish(550),
        new PufferFish(1100),
        new PufferFish(1750),
        // new Jellyfish(800, 140),
        // new Jellyfish(1450, 250),
        new Jellyfish(1100, 300),
        new Jellyfish(1850, 120),
        new Endboss()
    ],

        [
            new BackgroundObject(
                './images/Grafiken-Sharkie/3. Background/Light/1.png',
                0
            ),
            new BackgroundObject(
                './images/Grafiken-Sharkie/3. Background/Light/2.png',
                719
            ),
            new BackgroundObject(
                './images/Grafiken-Sharkie/3. Background/Light/1.png',
                719 * 2
            ),
            new BackgroundObject(
                './images/Grafiken-Sharkie/3. Background/Light/2.png',
                719 * 3
            ),
        ],
        [
            new Coin(150 + Math.random() * 100, 200 + Math.random() * 120),
            new Coin(350 + Math.random() * 100, 200 + Math.random() * 120),
            new Coin(550 + Math.random() * 100, 200 + Math.random() * 120),
            new Coin(750 + Math.random() * 100, 200 + Math.random() * 120),
            new Coin(950 + Math.random() * 100, 200 + Math.random() * 120),
            new Coin(1150 + Math.random() * 100, 200 + Math.random() * 120),
            new Coin(1350 + Math.random() * 100, 200 + Math.random() * 120),
            new Coin(1550 + Math.random() * 100, 200 + Math.random() * 120),
            new Coin(1750 + Math.random() * 100, 200 + Math.random() * 120),
            new Coin(1950 + Math.random() * 100, 200 + Math.random() * 120)
        ],

        [
            new Bubble(300 + Math.random() * 100, 340),
            new Bubble(650 + Math.random() * 100, 340),
            new Bubble(1000 + Math.random() * 100, 340),
            new Bubble(1350 + Math.random() * 100, 340),
            new Bubble(1700 + Math.random() * 100, 340)
        ].concat([
            new Bubble(350, 50, "./images/Grafiken-Sharkie/1.Sharkie/4.Attack/Bubble trap/Poisoned Bubble (for whale).png"),
            new Bubble(610, 130, "./images/Grafiken-Sharkie/1.Sharkie/4.Attack/Bubble trap/Poisoned Bubble (for whale).png"),
            new Bubble(870, 50, "./images/Grafiken-Sharkie/1.Sharkie/4.Attack/Bubble trap/Poisoned Bubble (for whale).png"),
            new Bubble(1130, 130, "./images/Grafiken-Sharkie/1.Sharkie/4.Attack/Bubble trap/Poisoned Bubble (for whale).png"),
            new Bubble(1390, 50, "./images/Grafiken-Sharkie/1.Sharkie/4.Attack/Bubble trap/Poisoned Bubble (for whale).png"),
            new Bubble(1650, 130, "./images/Grafiken-Sharkie/1.Sharkie/4.Attack/Bubble trap/Poisoned Bubble (for whale).png"),
            new Bubble(1910, 50, "./images/Grafiken-Sharkie/1.Sharkie/4.Attack/Bubble trap/Poisoned Bubble (for whale).png"),
            new Bubble(2170, 130, "./images/Grafiken-Sharkie/1.Sharkie/4.Attack/Bubble trap/Poisoned Bubble (for whale).png")
        ]));
        
}
