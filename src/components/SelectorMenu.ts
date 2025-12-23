import { Container } from "pixi.js";
import { Button } from "./Button";
import { SceneManager, SceneName } from "../SceneManager";

export class SelectorMenu extends Container {
  constructor() {
    super();
    this.initialize();
  }

  private initialize(): void {
    this.position.set(10, SceneManager.instance.gameVerCenter - 75);

    const buttons = [
      { label: "Ace of Shadows", scene: SceneName.AceOfShadows },
      { label: "Magic Words", scene: SceneName.MagicWords },
      { label: "Phoenix Flame", scene: SceneName.PhoenixFlame },
    ];

    buttons.forEach((buttonConfig, index) => {
      const button = new Button({
        label: buttonConfig.label,
        width: 200,
        height: 50,
        onClick: () => {
          SceneManager.instance.loadScene(buttonConfig.scene);
        },
      });
      button.position.y = index * 55;
      this.addChild(button);
    });
  }
}
