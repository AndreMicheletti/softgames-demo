import { Application } from "pixi.js";
import { SceneManager, SceneName } from "./scenes/SceneManager";

// Fixed game resolution
const GAME_WIDTH = 800;
const GAME_HEIGHT = 600;

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

  // Initialize SceneManager with the app stage
  const sceneManager = SceneManager.initialize(app.stage);

  // Load the initial scene
  sceneManager.loadScene(SceneName.Main);

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

  // Initial resize
  handleResize();

  // Listen for window resize events
  window.addEventListener("resize", handleResize);
})();
