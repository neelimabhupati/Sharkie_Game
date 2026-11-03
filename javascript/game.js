let canvas;
let world;
let keyboard = new Keyboard();

let audioMuted = false;

const homeBgm = new Audio(
    "./assets/audio/Home screen_bgm.mp3"
);
homeBgm.loop = true;
homeBgm.volume = 0.4;


const gameBgm = new Audio(
    "./assets/audio/Start Game_bgm.mp3"
);
gameBgm.loop = true;
gameBgm.volume = 0.25;

const bossBgm = new Audio(
    "./assets/audio/endboss_bgm.mp3"
);
bossBgm.loop = true;
bossBgm.volume = 1;

const yesHaveBgm = new Audio(
    "./assets/audio/yes i have.mp3"
);
yesHaveBgm.loop = true;
yesHaveBgm.volume = 0.25;

const winningBgm = new Audio(
    "./assets/audio/winning bgm.mp3"
);
winningBgm.loop = true;
winningBgm.volume = 0.3;

/** Initializes the canvas and creates the game world. */
function init() {
    canvas = document.getElementById("canvas");
    world = new World(canvas, keyboard);
}

/** Starts a new game and switches from the start screen. */
function startGame() {
    showGameScreen();
    stopHomeMusic();
    createGame();
    playGameMusic();
}

/** Displays the game screen and hides the start screen. */
function showGameScreen() {
    document.getElementById("replay-button").style.display = "none";
    document.getElementById("start-screen").style.display = "none";
    document.getElementById("game-container").style.display = "block";
    document.getElementById("canvas").style.display = "block";
}

/** Stops and resets the home-screen background music. */
function stopHomeMusic() {
    homeBgm.pause();
    homeBgm.currentTime = 0;
}

/** Creates a new game, initializes its level, and applies the mute setting. */
function createGame() {
    keyboard = new Keyboard();
    initLevel();
    init();
    applyMuteToWorldSounds();
}

/** Starts the game background music. */
function playGameMusic() {
    gameBgm.currentTime = 0;
    gameBgm.play().catch(error => {
        console.error("Could not play game music:", error);
    });
}

/** Toggles mute state for the game's audio tracks. */
function toggleMute() {
    audioMuted = !audioMuted;
    setAudioTracksMuted();
    updateVolumeButtons();
}

/** Applies the current mute state to all available audio tracks. */
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

/** Updates the volume buttons to show the current mute state. */
function updateVolumeButtons() {
    const icon = audioMuted ? "🔇" : "🔊";
    const label = audioMuted ? "Unmute audio" : "Mute audio";

    updateVolumeButton("home-volume-button", icon, label);
    updateVolumeButton("volume-button", icon, label);
}

/**
 * Updates a volume button's icon and accessible label.
 * @param {string} buttonId - ID of the button to update.
 * @param {string} icon - Icon to display.
 * @param {string} label - Accessible label and tooltip text.
 */
function updateVolumeButton(buttonId, icon, label) {
    const button = document.getElementById(buttonId);
    button.textContent = icon;
    button.setAttribute("aria-label", label);
    button.title = label;
}

/** Applies the current mute state to sounds owned by the game world. */
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

/** Stops and resets all background music tracks. */
function stopAllBgm() {
    [homeBgm, gameBgm, bossBgm, yesHaveBgm, winningBgm].forEach(track => {
        track.pause();
        track.currentTime = 0;
    });
}

/** Stops other music and starts the "Yes, I have" track. */
function startYesHaveBgm() {
    stopAllBgm();
    yesHaveBgm.play().catch(error => {
        console.error("Could not play Yes, I have music:", error);
    });
}

/** Stops other music and starts the victory music. */
function startWinningBgm() {
    stopAllBgm();
    winningBgm.play().catch(error => {
        console.error("Could not play winning music:", error);
    });
}

/** Stops and resets the game background music. */
function stopGameBgm() {
    gameBgm.pause();
    gameBgm.currentTime = 0;
}

/** Pauses the game music and starts the Endboss music if it is not already playing. */
function startBossBgm() {
    gameBgm.pause();

    if (bossBgm.paused) {
        bossBgm.currentTime = 0;
        bossBgm.play().catch(error => {
            console.error("Could not play Endboss music:", error);
        });
    }
}

/** Stops the Endboss music and resumes game music when allowed. */
function stopBossBgm() {
    pauseBossBgm();
    resumeGameBgm();
}

/** Pauses and resets the Endboss music. */
function pauseBossBgm() {
    if (bossBgm.paused) return;
    bossBgm.pause();
    bossBgm.currentTime = 0;
}

/** Resumes game music if the current game state allows it. */
function resumeGameBgm() {
    if (!canResumeGameBgm()) return;

    gameBgm.play().catch(error => {
        console.error("Could not resume game music:", error);
    });
}

/**
 * Determines whether game music can resume.
 * @returns {boolean} Whether the game music can resume.
 */
function canResumeGameBgm() {
    return world &&
        world.replyShownAt === null &&
        !world.gameLost &&
        !world.gameWon &&
        gameBgm.paused;
}

/** Reloads the page to replay the game. */
function replayGame() {
    window.location.reload();
}

/** Reloads the page to return to the home screen. */
function goHome() {
    window.location.reload();
}

/** Enters or exits fullscreen mode for the game container. */
function toggleFullscreen() {
    const gameContainer = document.getElementById("game-container");

    if (document.fullscreenElement) {
        document.exitFullscreen();
    } else {
        gameContainer.requestFullscreen();
    }
}

/** Updates the fullscreen button's label after a fullscreen change. */
function handleFullscreenChange() {
    const button = document.getElementById("fullscreen-button");
    const isFullscreen = Boolean(document.fullscreenElement);
    const label = isFullscreen ? "Exit fullscreen" : "Enter fullscreen";

    button.setAttribute("aria-label", label);
    button.title = label;
}

/**
 * Handles a key press and updates the corresponding game control.
 * @param {KeyboardEvent} event - Keyboard event from the browser.
 */
function handleKeyDown(event) {
    setKeyboardKey(event.keyCode, true);
    if (event.keyCode === 68) markReplyAsAnswered();
}

/**
 * Handles a key release and updates the corresponding game control.
 * @param {KeyboardEvent} event - Keyboard event from the browser.
 */
function handleKeyUp(event) {
    setKeyboardKey(event.keyCode, false);
}

/**
 * Sets the pressed state of a game control.
 * @param {number} keyCode - Key code to update.
 * @param {boolean} isPressed - Whether the key is currently pressed.
 */
function setKeyboardKey(keyCode, isPressed) {
    if (keyCode === 39) keyboard.RIGHT = isPressed;
    if (keyCode === 37) keyboard.LEFT = isPressed;
    if (keyCode === 38) keyboard.UP = isPressed;
    if (keyCode === 40) keyboard.DOWN = isPressed;
    if (keyCode === 32) keyboard.SPACE = isPressed;
    if (keyCode === 68) keyboard.D = isPressed;
}

/** Marks the Endboss reply as answered when the D key is pressed. */
function markReplyAsAnswered() {
    if (world && world.replyShownAt !== null) {
        world.dPressedAfterReply = true;
    }
}

/**
 * Starts home-screen music when the user clicks the start screen.
 * @param {MouseEvent} event - Click event from the browser.
 */
function handleStartScreenClick(event) {
    if (!event.target.closest("#start-screen")) return;
    if (!homeBgm.paused) return;

    homeBgm.play().catch(error => {
        console.error("Could not play home screen music:", error);
    });
}

/** Registers the game's keyboard, fullscreen, and click event listeners. */
function addGameEventListeners() {
    document.addEventListener("fullscreenchange", handleFullscreenChange);
    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);
    document.addEventListener("click", handleStartScreenClick, true);
}

/**
 * Registers pointer handlers for a touch-control button.
 * @param {string} buttonId - ID of the touch button.
 * @param {string} key - Game control key associated with the button.
 */
function setupTouchControl(buttonId, key) {
    const button = document.getElementById(buttonId);
    button.addEventListener("pointerdown", event => pressTouchKey(event, button, key));
    button.addEventListener("pointerup", event => releaseTouchKey(event, key));
    button.addEventListener("pointercancel", event => releaseTouchKey(event, key));
    button.addEventListener("lostpointercapture", event => releaseTouchKey(event, key));
}

/**
 * Presses a game control in response to a pointer press.
 * @param {PointerEvent} event - Pointer event from the browser.
 * @param {HTMLButtonElement} button - Touch-control button being pressed.
 * @param {string} key - Game control key to activate.
 */
function pressTouchKey(event, button, key) {
    event.preventDefault();
    button.setPointerCapture(event.pointerId);
    keyboard[key] = true;
    if (key === "D") markReplyAsAnswered();
}

/**
 * Releases a game control in response to a pointer release.
 * @param {PointerEvent} event - Pointer event from the browser.
 * @param {string} key - Game control key to deactivate.
 */
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