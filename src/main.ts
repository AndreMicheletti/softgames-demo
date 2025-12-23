import { Application, Ticker, Text } from "pixi.js";
import { SceneManager } from "./SceneManager";
import TweenManager from "./TweenManager";

// Fixed game resolution
const GAME_WIDTH = 800;
const GAME_HEIGHT = 600;

export const APP_BACKGROUND = "#1099bb";

function requestFullscreen(canvas: HTMLCanvasElement): Promise<void> {
  return new Promise<void>((resolve) => {
    const overlay = document.getElementById("fullscreen-overlay")!;

    overlay.onclick = () => {
      overlay.remove();
      canvas.requestFullscreen();
      resolve();
    };
  });
}

(async () => {
  const app = new Application();
  const isMobile = /Mobi|Android/i.test(navigator.userAgent);
  console.log("isMobile:", isMobile);
  await app.init({
    background: APP_BACKGROUND,
    width: isMobile ? GAME_HEIGHT : GAME_WIDTH,
    height: isMobile ? GAME_WIDTH : GAME_HEIGHT,
    autoDensity: true,
  });
  if (isMobile) {
    app.renderer.resolution = window.devicePixelRatio || 1;
  }

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

  await requestFullscreen(app.canvas);

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
