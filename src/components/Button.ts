import { Container, Text, Graphics } from "pixi.js";

interface ButtonOptions {
  label: string;
  width?: number;
  height?: number;
  backgroundColor?: number;
  textColor?: number;
  hoverColor?: number;
  onClick?: () => void;
}

export class Button extends Container {
  private background: Graphics;
  private contentLabel: Text;
  private isHovered = false;
  private backgroundColor: number;
  private hoverColor: number;
  private onClick?: () => void;

  constructor(options: ButtonOptions) {
    super();

    const {
      label,
      width = 120,
      height = 40,
      backgroundColor = 0x4a90e2,
      textColor = 0xffffff,
      hoverColor = 0x357abd,
      onClick,
    } = options;

    this.backgroundColor = backgroundColor;
    this.hoverColor = hoverColor;
    this.onClick = onClick;

    // Create background rectangle
    this.background = new Graphics();
    this.background.fillStyle.color = backgroundColor;
    this.background.rect(0, 0, width, height);
    this.background.fill();
    this.addChild(this.background);

    // Create text label
    this.contentLabel = new Text({
      text: label,
      style: {
        fontFamily: "Arial",
        fontSize: 16,
        fill: textColor,
        align: "center",
      },
    });
    this.contentLabel.anchor.set(0.5);
    this.contentLabel.position.set(width / 2, height / 2);
    this.addChild(this.contentLabel);

    // Enable interactivity
    this.eventMode = "static";
    this.cursor = "pointer";

    // Add event listeners
    this.on("pointerenter", () => this.onHover());
    this.on("pointerleave", () => this.onHoverLeave());
    this.on("pointertap", () => this.onButtonClick());
  }

  private onHover(): void {
    if (!this.isHovered) {
      this.isHovered = true;
      this.background.clear();
      this.background.fillStyle.color = this.hoverColor;
      this.background.rect(0, 0, this.background.width, this.background.height);
      this.background.fill();
    }
  }

  private onHoverLeave(): void {
    if (this.isHovered) {
      this.isHovered = false;
      this.background.clear();
      this.background.fillStyle.color = this.backgroundColor;
      this.background.rect(0, 0, this.background.width, this.background.height);
      this.background.fill();
    }
  }

  private onButtonClick(): void {
    if (this.onClick) {
      this.onClick();
    }
  }
}
