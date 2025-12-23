import { Container } from "pixi.js";
import { Button } from "./Button";

export class SelectorMenu extends Container {
  constructor() {
    super();
    this.initialize();
  }

  private initialize(): void {
    this.position.set(10, 10);

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
      this.addChild(button);
    });
  }
}
