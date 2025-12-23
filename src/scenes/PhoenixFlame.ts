import * as PIXI from "pixi.js";
import { FX, ParticleEmitter } from "revolt-fx";
import TweenManager from "../TweenManager";
import {
  GAME_HEIGHT,
  GAME_HOZ_CENTER,
  GAME_VER_CENTER,
  GAME_WIDTH,
} from "../main";
import { IScene } from "./IScene";
import { waitForTween } from "../utils";

export class PhoenixFlameScene extends PIXI.Container implements IScene {
  private titleLabel: PIXI.Text;
  private readonly tweenGroupName = "phoenixFlame";

  private target: PIXI.Container;
  private blackBg: PIXI.Graphics;

  private revoltFX: FX;
  private greatFireEmiiter: ParticleEmitter | null = null;

  constructor() {
    super();

    this.blackBg = new PIXI.Graphics();
    this.blackBg.rect(0, 0, GAME_WIDTH, GAME_HEIGHT);
    this.blackBg.fill("#000000");
    this.blackBg.alpha = 0.0;
    this.addChild(this.blackBg);

    this.titleLabel = this.createTitle();
    this.addChild(this.titleLabel);

    this.target = new PIXI.Container();
    this.addChild(this.target);
    this.target.position.set(GAME_HOZ_CENTER, GAME_VER_CENTER);

    this.revoltFX = new FX();
  }

  public async load(): Promise<void> {
    await PIXI.Assets.load("assets/game_sheet.json");

    PIXI.Assets.add({
      alias: "fx_settings",
      src: "assets/revoltfx_softgames.json",
    });
    PIXI.Assets.add({
      alias: "fx_spritesheet",
      src: "assets/revoltfx.png",
    });
    PIXI.Assets.add({
      alias: "fx_spritesheet_atlas",
      src: "assets/revoltfx.json",
    });

    const data = await PIXI.Assets.load([
      "fx_settings",
      "fx_spritesheet",
      "fx_spritesheet_atlas",
    ]);
    this.revoltFX.initBundle(data.fx_settings);
  }

  public update(): void {
    this.revoltFX.update();
  }

  public destroy(): void {
    TweenManager.destroyGroup(this.tweenGroupName);
    super.destroy({ children: true });
  }

  public async onEnter(): Promise<void> {
    TweenManager.createTween(this.blackBg, this.tweenGroupName)
      .to({ alpha: 1.0 }, 500)
      .start();
    this.greatFireEmiiter = this.revoltFX.getParticleEmitter("great-fire");
    this.greatFireEmiiter.x = GAME_VER_CENTER;
    this.greatFireEmiiter.y = GAME_HOZ_CENTER;
    this.greatFireEmiiter.init(this, true, 1);
    this.greatFireEmiiter.target = this.target;
  }

  public async onExit(): Promise<void> {
    await waitForTween(
      TweenManager.createTween(this.blackBg, this.tweenGroupName).to(
        { alpha: 0.0 },
        500,
      ),
    );
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
