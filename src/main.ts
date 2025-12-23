import { Application, Ticker, Text } from "pixi.js";
import { SceneManager } from "./SceneManager";
import TweenManager from "./TweenManager";

// Fixed game resolution
export const GAME_WIDTH = 800;
export const GAME_HEIGHT = 600;

export const GAME_HOZ_CENTER = GAME_WIDTH / 2;
export const GAME_VER_CENTER = GAME_HEIGHT / 2;

export const APP_BACKGROUND = "#1099bb";

(async () => {
  const app = new Application();
  await app.init({
    background: APP_BACKGROUND,
    width: GAME_WIDTH,
    height: GAME_HEIGHT,
    autoDensity: true,
  });

  const container = document.getElementById("pixi-container")!;
  container.appendChild(app.canvas);

  // Create FPS display
  const fpsText = new Text({
    text: "FPS: 0",
    style: {
      fontFamily: "Arial",
      fontSize: 16,
      fill: 0xffffff,
      align: "right",
    },
  });
  fpsText.anchor.set(1, 0);
  fpsText.position.set(GAME_WIDTH - 10, 10);
  fpsText.zIndex = 1000;
  app.stage.addChild(fpsText);

  // Initialize SceneManager with the app stage
  const sceneManager = SceneManager.initialize(app);
  const loadingPromise = sceneManager.load();

  // Start the PIXI application ticker
  app.ticker.add((ticker: Ticker) => {
    sceneManager.update(ticker.deltaMS);
    TweenManager.update();

    // Update FPS display
    const fps = Math.round(ticker.FPS);
    fpsText.text = `FPS: ${fps}`;
  });

  await loadingPromise;

  // Handle window resize to scale the canvas while maintaining aspect ratio
  const handleResize = () => {
    const windowWidth = window.innerWidth;
    const windowHeight = window.innerHeight;

    // Calculate scale to fit window while maintaining aspect ratio
    const scaleX = windowWidth / GAME_WIDTH;
    const scaleY = windowHeight / GAME_HEIGHT;
    const scale = Math.min(1.0, Math.min(scaleX, scaleY));

    // Apply scaling to canvas
    app.canvas.style.transform = `scale(${scale})`;
    app.canvas.style.transformOrigin = "top center";
  };

  // Listen for window resize events
  handleResize();
  window.addEventListener("resize", handleResize);
})();
