import * as PIXI from "pixi.js";

export interface IScene extends PIXI.Container {
  initialize(): void;
  load(): Promise<void>;
  update(deltaTime: number): void;
  destroy(): void;
}
