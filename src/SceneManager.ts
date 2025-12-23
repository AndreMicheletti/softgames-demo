import * as PIXI from "pixi.js";
import { AceOfShadowsScene } from "./scenes/AceOfShadowsScene";
import { IScene } from "./scenes/IScene";
import { SelectorMenu } from "./components/SelectorMenu";
import { LoadingOverlay } from "./components/LoadingOverlay";
import { GAME_HEIGHT, GAME_WIDTH } from "./main";
import { MagicWordsScene } from "./scenes/MagicWords";
import { PhoenixFlameScene } from "./scenes/PhoenixFlame";

export type SceneConstructor = new () => IScene;

export enum SceneName {
  AceOfShadows = "AceOfShadows",
  MagicWords = "MagicWords",
  PhoenixFlame = "PhoenixFlame",
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
    [SceneName.MagicWords]: MagicWordsScene,
    [SceneName.PhoenixFlame]: PhoenixFlameScene,
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
  public async loadScene(sceneName: SceneName): Promise<boolean> {
    const SceneClass = this.scenes[sceneName];

    if (!SceneClass) {
      console.warn(`Scene "${sceneName}" not found`);
      return false;
    }

    const newScene = new SceneClass();

    await this.loadingOverlay?.show();
    await newScene.load();
    await this.loadingOverlay?.hide();

    // Destroy current scene if exists
    if (this.currentScene) {
      await this.currentScene.onExit();
      this.destroyCurrentScene();
    }

    // Create and add new scene
    this.currentScene = newScene;
    this.currentSceneName = sceneName;
    this.container.addChild(this.currentScene);

    await this.currentScene.onEnter();

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

  public async load(): Promise<void> {
    this.loadingOverlay = new LoadingOverlay(GAME_WIDTH, GAME_HEIGHT);
    this.container.addChild(this.loadingOverlay);

    await this.loadingOverlay.show();
    await PIXI.Assets.load("assets/game_sheet.json");
    await this.loadingOverlay.hide();

    this.selectorMenu = new SelectorMenu();
    this.container.addChild(this.selectorMenu);
  }
}
