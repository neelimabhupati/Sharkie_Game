# Sharkie

A browser-based underwater adventure game built with HTML, CSS, and vanilla JavaScript. Play as Sharkie, collect coins and bubbles, avoid sea enemies, and defeat the Endboss.

## Features

- Canvas-based gameplay with animated characters and enemies
- Collectible coins and bubbles
- Tail-slap and poison-bubble attacks
- Health and collectible status bars
- Sound effects and background music, with a mute control
- Touch controls for mobile devices
- Fullscreen, replay, and home-screen controls
- Landscape-mode notice for smaller screens

## How to Play

Move Sharkie through the underwater level, collect items, avoid enemies, and defeat the Endboss.

| Action | Keyboard | Touch |
| --- | --- | --- |
| Move | Arrow keys | Direction buttons |
| Tail-slap | `Space` | Tail slap |
| Throw a poison bubble | `D` | Poison bubble |
| Stomp a Pufferfish or Jellyfish while touching it | `↓` Down Arrow | Down button |

Collect poison bubbles and hit the Endboss four times to defeat it.

## Getting Started

### Requirements

- A modern web browser
- Visual Studio Code with the Live Server extension, or another local static web server

### Run locally

1. Clone or download this repository.
2. Open the project folder in Visual Studio Code.
3. Open `index.html` with Live Server.
4. Play in landscape orientation for the best experience.

This project uses plain HTML, CSS, and JavaScript. No build step is required.

## Project Structure

```text
.
├── index.html
├── javascript/
│   └── game.js
├── models/
│   ├── levels/
│   │   └── level1.js
│   └── *.class.js
├── styles/
├── assets/
│   ├── audio/
│   └── ...
├── images/
└── docs/
```

## Technologies, Credits & Project Purpose

**Technologies:** HTML5, CSS3, JavaScript, and HTML Canvas

**Game development:** Neelima Bhupati  
**Graphics and character assets:** Sharkie asset pack  
**Project inspiration:** El Pollo Loco tutorial project  
**Music sources:** Freesound and Pixabay Music

This is a personal learning project and is not intended for commercial use.