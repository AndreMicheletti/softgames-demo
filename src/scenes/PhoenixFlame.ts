import * as PIXI from "pixi.js";
import { IScene } from "./IScene";
import TweenManager from "../TweenManager";
import { GAME_WIDTH } from "../main";

export class PhoenixFlameScene extends PIXI.Container implements IScene {
  private titleLabel: PIXI.Text;
  private readonly tweenGroupName = "phoenixFlame";

  constructor() {
    super();

    this.titleLabel = this.createTitle();
    this.addChild(this.titleLabel);
  }

  public async load(): Promise<void> {
    await PIXI.Assets.load("assets/game_sheet.json");
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public update(_deltaTime: number): void {
    // Do nothing
  }

  public destroy(): void {
    TweenManager.destroyGroup(this.tweenGroupName);
    super.destroy({ children: true });
  }

  public async onEnter(): Promise<void> {}

  public async onExit(): Promise<void> {
    // Do nothing
  }

  private createTitle(): PIXI.Text {
    const titleLabel = new PIXI.Text({
      text: "Phoenix Flame",
      style: {
        fontFamily: "Arial",
        fontSize: 32,
        fontWeight: "bold",
        fill: 0xffffff,
        align: "center",
      },
    });
    titleLabel.anchor.set(0.5, 0);
    titleLabel.position.set(GAME_WIDTH / 2, 20);
    return titleLabel;
  }
}
