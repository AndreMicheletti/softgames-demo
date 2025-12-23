import { Application, Ticker } from "pixi.js";
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

  // Initialize SceneManager with the app stage
  const sceneManager = SceneManager.initialize(app);
  const loadingPromise = sceneManager.load();

  // Start the PIXI application ticker
  app.ticker.add((ticker: Ticker) => {
    sceneManager.update(ticker.deltaMS);
    TweenManager.update();
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
