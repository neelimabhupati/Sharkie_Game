let canvas;
let world;
let keyboard = new Keyboard();

let audioMuted = false;

const homeBgm = new Audio(
    "./images/Grafiken-Sharkie/7.Sound track/Home screen_bgm.mp3"
);
homeBgm.loop = true;
homeBgm.volume = 0.4;


const gameBgm = new Audio(
    "./images/Grafiken-Sharkie/7.Sound track/Start Game_bgm.mp3"
);
gameBgm.loop = true;
gameBgm.volume = 0.25;

const bossBgm = new Audio(
    "./images/Grafiken-Sharkie/7.Sound track/endboss_bgm.mp3"
);
bossBgm.loop = true;
bossBgm.volume = 1;

const yesHaveBgm = new Audio(
    "./images/Grafiken-Sharkie/7.Sound track/yes i have.mp3"
);
yesHaveBgm.loop = true;
yesHaveBgm.volume = 0.25;

const winningBgm = new Audio(
    "./images/Grafiken-Sharkie/7.Sound track/winning bgm.mp3"
);
winningBgm.loop = true;
winningBgm.volume = 0.3;



function init() {
    canvas = document.getElementById("canvas");
    world = new World(canvas, keyboard);
    // console.log("My Character is:", world.character);
}

function startGame() {
    document.getElementById("start-screen").style.display = "none";
    document.getElementById("game-container").style.display = "block";
    document.getElementById("canvas").style.display = "block";

    homeBgm.pause();
    homeBgm.currentTime = 0;

    keyboard = new Keyboard();
    initLevel();
    init();
    // world.gameStarted = true;
    applyMuteToWorldSounds();

    gameBgm.currentTime = 0;
    gameBgm.play().catch(error => {
        console.error("Could not play game music:", error);
    });

}

function toggleMute() {
    audioMuted = !audioMuted;

    const audioTracks = [
        homeBgm,
        gameBgm,
        bossBgm,
        yesHaveBgm,
        winningBgm
    ];

    if (world) {
        audioTracks.push(
            world.coinSound,
            world.bubbleSound,
            world.hurtSound,
            world.deadSound
        );
    }

    audioTracks.forEach(track => {
        if (track) {
            track.muted = audioMuted;
        }
    });

    const homeVolumeButton = document.getElementById("home-volume-button");
    const gameVolumeButton = document.getElementById("volume-button");
    const icon = audioMuted ? "🔇" : "🔊";
    const label = audioMuted ? "Unmute audio" : "Mute audio";

    homeVolumeButton.textContent = icon;
    homeVolumeButton.setAttribute("aria-label", label);
    homeVolumeButton.title = label;

    gameVolumeButton.textContent = icon;
    gameVolumeButton.setAttribute("aria-label", label);
    gameVolumeButton.title = label;
}

function applyMuteToWorldSounds() {
    if (!world) return;

    [
        world.coinSound,
        world.bubbleSound,
        world.hurtSound,
        world.deadSound
    ].forEach(sound => {
        if (sound) {
            sound.muted = audioMuted;
        }
    });
}

function stopAllBgm() {
    [homeBgm, gameBgm, bossBgm, yesHaveBgm, winningBgm].forEach(track => {
        track.pause();
        track.currentTime = 0;
    });
}

function startYesHaveBgm() {
    stopAllBgm();
    yesHaveBgm.play().catch(error => {
        console.error("Could not play Yes, I have music:", error);
    });
}

function startWinningBgm() {
    stopAllBgm();
    winningBgm.play().catch(error => {
        console.error("Could not play winning music:", error);
    });
}

function stopGameBgm() {
    gameBgm.pause();
    gameBgm.currentTime = 0;
}

function startBossBgm() {
    gameBgm.pause();

    if (bossBgm.paused) {
        bossBgm.currentTime = 0;
        bossBgm.play().catch(error => {
            console.error("Could not play Endboss music:", error);
        });
    }
}

function stopBossBgm() {
    if (!bossBgm.paused) {
        bossBgm.pause();
        bossBgm.currentTime = 0;
    }

    if (
        world &&
        world.replyShownAt === null &&
        !world.gameLost &&
        !world.gameWon &&
        gameBgm.paused
    ) {
        gameBgm.play().catch(error => {
            console.error("Could not resume game music:", error);
        });
    }
}

function replayGame() {
    window.location.reload();

}

function goHome() {
    window.location.reload();
}

function toggleFullscreen() {
    const gameContainer = document.getElementById("game-container");

    if (document.fullscreenElement) {
        document.exitFullscreen();
    } else {
        gameContainer.requestFullscreen();
    }
}

document.addEventListener("fullscreenchange", () => {
    const button = document.getElementById("fullscreen-button");
    const isFullscreen = Boolean(document.fullscreenElement);

    button.setAttribute(
        "aria-label",
        isFullscreen ? "Exit fullscreen" : "Enter fullscreen"
    );
    button.title = isFullscreen ? "Exit fullscreen" : "Enter fullscreen";
});

window.addEventListener('keydown', (event) => {

    if (event.keyCode == 39) {
        keyboard.RIGHT = true;
    }
    if (event.keyCode == 37) {
        keyboard.LEFT = true;
    }
    if (event.keyCode == 38) {
        keyboard.UP = true;
    }
    if (event.keyCode == 40) {
        keyboard.DOWN = true;
    }

    if (event.keyCode == 32) {
        keyboard.SPACE = true;
    }

    if (event.keyCode == 68) {
        keyboard.D = true;

        if (world && world.replyShownAt !== null) {
            world.dPressedAfterReply = true;
        }

    }

    // console.log(event);

});

window.addEventListener('keyup', (event) => {
    if (event.keyCode == 39) {
        keyboard.RIGHT = false;
    }
    if (event.keyCode == 37) {
        keyboard.LEFT = false;
    }
    if (event.keyCode == 38) {
        keyboard.UP = false;
    }
    if (event.keyCode == 40) {
        keyboard.DOWN = false;
    }
    if (event.keyCode == 32) {
        keyboard.SPACE = false;
    }
    if (event.keyCode == 68) {
        keyboard.D = false;
    }
    // console.log(event);

});

document.addEventListener(
    "click",
    (event) => {
        if (event.target.closest("#start-screen") && homeBgm.paused) {
            homeBgm.play().catch((error) => {
                console.error("Could not play home screen music:", error);
            });
        }
    },
    true
);

function setupTouchControl(buttonId, key) {
    const button = document.getElementById(buttonId);

    button.addEventListener("pointerdown", (event) => {
        event.preventDefault();
        button.setPointerCapture(event.pointerId);
        keyboard[key] = true;

        if (key === "D" && world && world.replyShownAt !== null) {
            world.dPressedAfterReply = true;
        }
    });

    const releaseKey = (event) => {
        event.preventDefault();
        keyboard[key] = false;
    };

    button.addEventListener("pointerup", releaseKey);
    button.addEventListener("pointercancel", releaseKey);
    button.addEventListener("lostpointercapture", releaseKey);
}

setupTouchControl("touch-up", "UP");
setupTouchControl("touch-left", "LEFT");
setupTouchControl("touch-down", "DOWN");
setupTouchControl("touch-right", "RIGHT");
setupTouchControl("touch-tail-attack", "SPACE");
setupTouchControl("touch-poison-bubble", "D");