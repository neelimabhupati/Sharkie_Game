let level1;

function initLevel(){


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

    Array.from({ length: 10 }, (_, index) =>
        new Coin(
            150 + index * 200 + Math.random() * 100,
            200 + Math.random() * 120
        )
    ),

    Array.from({ length: 5 }, (_, index) =>
        new Bubble(
            300 + index * 350 + Math.random() * 100,
            340
        )
    ).concat(
        Array.from({ length: 8 }, (_, index) =>
            new Bubble(
                350 + index * 260,
                50 + (index % 2) * 80,
                './images/Grafiken-Sharkie/1.Sharkie/4.Attack/Bubble trap/Poisoned Bubble (for whale).png'
            )
        )
    ));

}
