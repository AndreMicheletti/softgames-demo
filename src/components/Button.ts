import { Container, Text, NineSlicePlane, Texture } from "pixi.js";

interface ButtonOptions {
  label: string;
  width?: number;
  height?: number;
  textColor?: number;
  onClick?: () => void;
  margin?: number;
}

export class Button extends Container {
  private background: NineSlicePlane | null = null;
  private contentLabel: Text;
  private isHovered = false;
  private textColor: number;
  private onClick?: () => void;
  private buttonWidth: number;
  private buttonHeight: number;

  constructor(options: ButtonOptions) {
    super();

    const {
      label,
      width = 120,
      height = 40,
      textColor = 0xffffff,
      onClick,
      margin = 10,
    } = options;

    this.buttonWidth = width;
    this.buttonHeight = height;
    this.textColor = textColor;
    this.onClick = onClick;

    this.initializeButton(width, height, margin);

    // Create text label
    this.contentLabel = new Text(label, {
      fontFamily: "Arial",
      fontSize: 22,
      fill: this.textColor,
      align: "center",
      stroke: {
        color: "#000000",
        width: 4,
        alpha: 0.3,
      },
    });
    this.contentLabel.anchor.set(0.5);
    this.contentLabel.position.set(this.buttonWidth / 2, this.buttonHeight / 2);
    this.addChild(this.contentLabel);

    // Enable interactivity
    this.eventMode = "static";
    this.cursor = "pointer";

    // Add event listeners
    this.on("pointerenter", () => this.onHover());
    this.on("pointerleave", () => this.onHoverLeave());
    this.on("pointertap", () => this.onButtonClick());
  }

  private async initializeButton(
    width: number,
    height: number,
    margin: number,
  ): Promise<void> {
    try {
      // Get the texture from the loaded sprite sheet
      const texture = Texture.from("button_square_depth_gloss.png");

      // Create a 9-slice plane with the specified margins
      this.background = new NineSlicePlane(
        texture,
        margin,
        margin,
        margin,
        margin,
      );
      this.background.width = width;
      this.background.height = height;

      // Add background to the beginning so text appears on top
      this.addChildAt(this.background, 0);
    } catch (error) {
      console.error("Failed to load button texture:", error);
    }
  }

  private onHover(): void {
    if (!this.isHovered) {
      this.isHovered = true;
      // Apply a slight tint or scale on hover
      if (this.background) {
        this.background.tint = 0xcccccc;
      }
    }
  }

  private onHoverLeave(): void {
    if (this.isHovered) {
      this.isHovered = false;
      // Reset to normal
      if (this.background) {
        this.background.tint = 0xffffff;
      }
    }
  }

  private onButtonClick(): void {
    if (this.onClick) {
      this.onClick();
    }
  }

  /**
   * Resize the button
   */
  public resize(width: number, height: number): void {
    if (this.background) {
      this.background.width = width;
      this.background.height = height;
    }
    this.buttonWidth = width;
    this.buttonHeight = height;
    this.contentLabel.position.set(width / 2, height / 2);
  }
}
