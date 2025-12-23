import * as PIXI from "pixi.js";

export interface IScene extends PIXI.Container {
  load(): Promise<void>;
  update(deltaTime: number): void;
  destroy(): void;
  onEnter(): Promise<void>;
  onExit(): Promise<void>;
}
