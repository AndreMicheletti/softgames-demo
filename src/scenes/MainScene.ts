import * as PIXI from "pixi.js";
import { Button } from "../components/Button";

export class MainScene extends PIXI.Container {
  constructor() {
    super();
    this.initialize();
  }

  private initialize(): void {
    // Add scene initialization code here
    // Create in-game menu in top left corner
    const menu = new PIXI.Container();
    menu.position.set(10, 10);

    const buttons = [
      { label: "Ace of Shadows", color: 0x2c3e50 },
      { label: "Magic Words", color: 0x8e44ad },
      { label: "Phoenix Flame", color: 0xe74c3c },
    ];

    buttons.forEach((buttonConfig, index) => {
      const button = new Button({
        label: buttonConfig.label,
        width: 150,
        height: 40,
        backgroundColor: buttonConfig.color,
        hoverColor: 0xffffff,
        onClick: () => {
          console.log(`${buttonConfig.label} clicked!`);
        },
      });
      button.position.y = index * 50;
      menu.addChild(button);
    });

    this.addChild(menu);
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public update(_deltaTime: number): void {
    // Add update logic here
  }

  public destroy(): void {
    super.destroy();
  }
}
