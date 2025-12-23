import * as PIXI from "pixi.js";
import TweenManager from "../TweenManager";
import { waitForTween } from "../utils";

export class LoadingOverlay extends PIXI.Container {
  private background: PIXI.Graphics;
  private loadingText: PIXI.Text;

  constructor(width: number = 800, height: number = 600) {
    super();
    this.background = new PIXI.Graphics();
    this.loadingText = new PIXI.Text();
    this.zIndex = 999;
    this.initialize(width, height);
  }

  private initialize(width: number, height: number): void {
    // Create semi-transparent black background
    this.background.rect(0, 0, width, height);
    this.background.fill({ color: 0x000000, alpha: 0.7 });
    this.addChild(this.background);

    // Create "Loading" text
    this.loadingText = new PIXI.Text({
      text: "Loading",
      style: {
        fontFamily: "Arial",
        fontSize: 32,
        fill: 0xffffff,
        align: "center",
      },
    });

    // Center the text
    this.loadingText.anchor.set(0.5, 0.5);
    this.loadingText.position.set(width / 2, height / 2);

    this.addChild(this.loadingText);
    this.alpha = 0.0;
  }

  public async show(): Promise<void> {
    this.visible = true;
    await waitForTween(TweenManager.createTween(this).to({ alpha: 1.0 }, 300));
  }

  public async hide(): Promise<void> {
    await waitForTween(TweenManager.createTween(this).to({ alpha: 0.0 }, 300));
    this.visible = false;
  }

  public destroy(): void {
    this.background.destroy();
    this.loadingText.destroy();
    super.destroy();
  }
}
