import { Application, Ticker } from "pixi.js";
import { SceneManager, SceneName } from "./SceneManager";
import TweenManager from "./TweenManager";

// Fixed game resolution
export const GAME_WIDTH = 800;
export const GAME_HEIGHT = 600;

(async () => {
  const app = new Application();
  await app.init({
    background: "#1099bb",
    width: GAME_WIDTH,
    height: GAME_HEIGHT,
    autoDensity: true,
  });

  const container = document.getElementById("pixi-container")!;
  container.appendChild(app.canvas);

  // Start the PIXI application ticker
  app.ticker.add((ticker: Ticker) => {
    sceneManager.update(ticker.deltaMS);
    TweenManager.defaultGroup.update(ticker.deltaMS);
  });

  // Initialize SceneManager with the app stage
  const sceneManager = SceneManager.initialize(app.stage);

  // Load the initial scene
  sceneManager.loadScene(SceneName.AceOfShadows);

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
