# Snake

A fresh, responsive take on classic Snake. Vanilla HTML, CSS, and JavaScript — no dependencies, downloads, or build step.

## Play locally

```sh
python3 -m http.server 8080
```

Open http://localhost:8080. Alternatively, run `npm start` (requires Python 3).

## Controls

- **Arrow keys / WASD:** steer
- **Space:** start, pause, or resume
- **Escape:** pause or resume
- **R:** restart
- **Mobile:** swipe the board or use the on-screen direction buttons

Eat coral-colored food for 10 points per bite. Avoid walls and your own body. Fill the board to win. Choose Chill, Classic, or Fast before a round. Your personal best is saved separately for each difficulty in your browser when local storage is available. Switching tabs or leaving the window automatically pauses play.

## Development

Serve the repository with any static web server. `engine.js` contains the independent game rules; `game.js` handles rendering and input. Run the rules tests with Node.js 18+:

```sh
npm test
```

To host on GitHub Pages, enable Pages in repository settings and select **Deploy from a branch → main → / (root)** (availability depends on repository visibility and plan).
