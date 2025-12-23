import * as PIXI from "pixi.js";
import { AceOfShadowsScene } from "./scenes/AceOfShadowsScene";
import { IScene } from "./scenes/IScene";
import { SelectorMenu } from "./components/SelectorMenu";
import { LoadingOverlay } from "./components/LoadingOverlay";
import { waitForSeconds } from "./utils";
import { GAME_HEIGHT, GAME_WIDTH } from "./main";

export type SceneConstructor = new () => IScene;

export enum SceneName {
  AceOfShadows = "AceOfShadows",
}

export class SceneManager {
  private static _instance: SceneManager | null = null;

  private currentScene: IScene | null = null;
  private currentSceneName: string | null = null;
  private container: PIXI.Container;

  private selectorMenu: SelectorMenu | null = null;
  private loadingOverlay: LoadingOverlay | null = null;

  private scenes: Record<SceneName, SceneConstructor> = {
    [SceneName.AceOfShadows]: AceOfShadowsScene,
  };

  private constructor(container: PIXI.Container) {
    this.container = container;
    this.createElements();
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
  public async loadScene(sceneName: SceneName): Promise<boolean> {
    const SceneClass = this.scenes[sceneName];

    if (!SceneClass) {
      console.warn(`Scene "${sceneName}" not found`);
      return false;
    }

    const newScene = new SceneClass();
    newScene.initialize();

    await this.loadingOverlay?.show();
    await waitForSeconds(2);
    await newScene.load();
    await this.loadingOverlay?.hide();

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
   * Update the current scene
   */
  public update(deltaTime: number): void {
    this.currentScene?.update(deltaTime);
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

  private createElements(): void {
    this.selectorMenu = new SelectorMenu();
    this.container.addChild(this.selectorMenu);

    this.loadingOverlay = new LoadingOverlay(GAME_WIDTH, GAME_HEIGHT);
    this.container.addChild(this.loadingOverlay);
  }
}
