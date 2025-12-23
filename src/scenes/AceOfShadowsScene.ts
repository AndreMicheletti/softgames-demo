import * as PIXI from "pixi.js";
import { IScene } from "./IScene";

export class AceOfShadowsScene extends PIXI.Container implements IScene {
  public initialize(): void {}

  public async load(): Promise<void> {
    // Load assets or perform async setup here if needed
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public update(_deltaTime: number): void {
    // Add update logic here
  }

  public destroy(): void {
    super.destroy();
  }
}
