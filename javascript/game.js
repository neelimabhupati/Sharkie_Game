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
    document.getElementById("replay-button").style.display = "none";
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
    setAudioTracksMuted();
    updateVolumeButtons();
}

function setAudioTracksMuted() {
    const tracks = [homeBgm, gameBgm, bossBgm, yesHaveBgm, winningBgm];

    if (world) {
        tracks.push(world.coinSound, world.bubbleSound);
        tracks.push(world.hurtSound, world.deadSound);
    }

    tracks.forEach(track => {
        track.muted = audioMuted;
    });
}

function updateVolumeButtons() {
    const icon = audioMuted ? "🔇" : "🔊";
    const label = audioMuted ? "Unmute audio" : "Mute audio";

    updateVolumeButton("home-volume-button", icon, label);
    updateVolumeButton("volume-button", icon, label);
}

function updateVolumeButton(buttonId, icon, label) {
    const button = document.getElementById(buttonId);
    button.textContent = icon;
    button.setAttribute("aria-label", label);
    button.title = label;
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
    pauseBossBgm();
    resumeGameBgm();
}

function pauseBossBgm() {
    if (bossBgm.paused) return;
    bossBgm.pause();
    bossBgm.currentTime = 0;
}

function resumeGameBgm() {
    if (!canResumeGameBgm()) return;

    gameBgm.play().catch(error => {
        console.error("Could not resume game music:", error);
    });
}

function canResumeGameBgm() {
    return world &&
        world.replyShownAt === null &&
        !world.gameLost &&
        !world.gameWon &&
        gameBgm.paused;
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

function handleFullscreenChange() {
    const button = document.getElementById("fullscreen-button");
    const isFullscreen = Boolean(document.fullscreenElement);
    const label = isFullscreen ? "Exit fullscreen" : "Enter fullscreen";

    button.setAttribute("aria-label", label);
    button.title = label;
}

function handleKeyDown(event) {
    setKeyboardKey(event.keyCode, true);
    if (event.keyCode === 68) markReplyAsAnswered();
}

function handleKeyUp(event) {
    setKeyboardKey(event.keyCode, false);
}

function setKeyboardKey(keyCode, isPressed) {
    if (keyCode === 39) keyboard.RIGHT = isPressed;
    if (keyCode === 37) keyboard.LEFT = isPressed;
    if (keyCode === 38) keyboard.UP = isPressed;
    if (keyCode === 40) keyboard.DOWN = isPressed;
    if (keyCode === 32) keyboard.SPACE = isPressed;
    if (keyCode === 68) keyboard.D = isPressed;
}

function markReplyAsAnswered() {
    if (world && world.replyShownAt !== null) {
        world.dPressedAfterReply = true;
    }
}

function handleStartScreenClick(event) {
    if (!event.target.closest("#start-screen")) return;
    if (!homeBgm.paused) return;

    homeBgm.play().catch(error => {
        console.error("Could not play home screen music:", error);
    });
}

function addGameEventListeners() {
    document.addEventListener("fullscreenchange", handleFullscreenChange);
    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);
    document.addEventListener("click", handleStartScreenClick, true);
}

function setupTouchControl(buttonId, key) {
    const button = document.getElementById(buttonId);
    button.addEventListener("pointerdown", event => pressTouchKey(event, button, key));
    button.addEventListener("pointerup", event => releaseTouchKey(event, key));
    button.addEventListener("pointercancel", event => releaseTouchKey(event, key));
    button.addEventListener("lostpointercapture", event => releaseTouchKey(event, key));
}

function pressTouchKey(event, button, key) {
    event.preventDefault();
    button.setPointerCapture(event.pointerId);
    keyboard[key] = true;
    if (key === "D") markReplyAsAnswered();
}

function releaseTouchKey(event, key) {
    event.preventDefault();
    keyboard[key] = false;
}

addGameEventListeners();
setupTouchControl("touch-up", "UP");
setupTouchControl("touch-left", "LEFT");
setupTouchControl("touch-down", "DOWN");
setupTouchControl("touch-right", "RIGHT");
setupTouchControl("touch-tail-attack", "SPACE");
setupTouchControl("touch-poison-bubble", "D");