import * as PIXI from "pixi.js";
import { IScene } from "./IScene";

export class TemplateScene extends PIXI.Container implements IScene {
  constructor() {
    super();
  }

  public async load(): Promise<void> {
    await PIXI.Assets.load("assets/game_sheet.json");
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public update(_deltaTime: number): void {
    // Do nothing
  }

  public destroy(): void {}

  public async onEnter(): Promise<void> {}

  public async onExit(): Promise<void> {
    // Do nothing
  }
}
