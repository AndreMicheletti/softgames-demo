import * as PIXI from "pixi.js";
import { MainScene } from "./MainScene";

export type SceneConstructor = new () => PIXI.Container;

export enum SceneName {
  Main = "Main",
}

export class SceneManager {
  private static _instance: SceneManager | null = null;

  private currentScene: PIXI.Container | null = null;
  private currentSceneName: string | null = null;
  private container: PIXI.Container;

  private scenes: Record<SceneName, SceneConstructor> = {
    [SceneName.Main]: MainScene,
  };

  private constructor(container: PIXI.Container) {
    this.container = container;
  }

  /**
   * Initialize the SceneManager singleton instance
   */
  public static initialize(container: PIXI.Container): SceneManager {
    if (!SceneManager._instance) {
      SceneManager._instance = new SceneManager(container);
    }
    return SceneManager._instance;
  }

  /**
   * Get the SceneManager singleton instance
   */
  public static get instance(): SceneManager {
    if (!SceneManager._instance) {
      throw new Error(
        "SceneManager not initialized. Call SceneManager.initialize() first.",
      );
    }
    return SceneManager._instance;
  }

  /**
   * Load and display a scene by name
   */
  public loadScene(sceneName: SceneName): boolean {
    const SceneClass = this.scenes[sceneName];

    if (!SceneClass) {
      console.warn(`Scene "${sceneName}" not found`);
      return false;
    }

    // Destroy current scene if exists
    if (this.currentScene) {
      this.destroyCurrentScene();
    }

    // Create and add new scene
    this.currentScene = new SceneClass();
    this.currentSceneName = sceneName;
    this.container.addChild(this.currentScene);

    return true;
  }

  /**
   * Change to a different scene
   */
  public changeScene(sceneName: SceneName): boolean {
    return this.loadScene(sceneName);
  }

  /**
   * Destroy the current scene
   */
  private destroyCurrentScene(): void {
    if (this.currentScene) {
      this.currentScene.destroy();
      this.currentScene = null;
      this.currentSceneName = null;
    }
  }

  /**
   * Get the current active scene
   */
  public getCurrentScene(): PIXI.Container | null {
    return this.currentScene;
  }

  /**
   * Get the name of the current active scene
   */
  public getCurrentSceneName(): string | null {
    return this.currentSceneName;
  }

  /**
   * Cleanup all resources
   */
  public destroy(): void {
    this.destroyCurrentScene();
  }
}
