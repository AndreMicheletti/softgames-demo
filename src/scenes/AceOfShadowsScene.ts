import * as PIXI from "pixi.js";
import { IScene } from "./IScene";
import { GAME_HOZ_CENTER, GAME_VER_CENTER, GAME_WIDTH } from "../main";
import CardStack from "../components/CardStack";
import { waitForTween } from "../utils";
import TweenManager from "../TweenManager";
import { Easing } from "@tweenjs/tween.js";
import { Button } from "../components/Button";

const SUITS = ["hearts", "diamonds", "clubs", "spades"];
const RANKS = [
  "A",
  "02",
  "03",
  "04",
  "05",
  "06",
  "07",
  "08",
  "09",
  "10",
  "J",
  "Q",
  "K",
];

const CARDS_NUM = 144;
const CARD_WIDTH = 64;
const CARD_HEIGHT = 64;

const CARD_OFFSET = 2;

export class AceOfShadowsScene extends PIXI.Container implements IScene {
  private titleLabel: PIXI.Text;
  private fastButton: Button;
  private cards: PIXI.Sprite[] = [];

  private stackPositions: PIXI.Point[] = [
    new PIXI.Point(GAME_HOZ_CENTER - 100, GAME_VER_CENTER - 150),
    new PIXI.Point(GAME_HOZ_CENTER + 100, GAME_VER_CENTER - 150),
  ];

  private cardStacks: CardStack[] = [];
  private reverse = false;

  private tweenGroupName = "aceOfShadowsGroup";

  private fastMode = false;

  constructor() {
    super();

    this.titleLabel = this.createTitle();
    this.addChild(this.titleLabel);

    this.fastButton = this.createFastButton();
    this.fastButton.position.set(GAME_WIDTH - 160, 20);
    this.addChild(this.fastButton);

    this.cardStacks.push(new CardStack(this.stackPositions[0], CARD_OFFSET));
    this.cardStacks.push(new CardStack(this.stackPositions[1], CARD_OFFSET));

    this.addChild(this.cardStacks[0]);
    this.addChild(this.cardStacks[1]);

    this.createCards();
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
    this.cards.forEach((card) => card.destroy());
    this.cardStacks.forEach((stack) => stack.destroy());
    this.titleLabel?.destroy();
    super.destroy();
  }

  public async onEnter(): Promise<void> {
    this.doRecursiveAnimation();
  }

  public async onExit(): Promise<void> {
    // Do nothing
  }

  private createCards(): void {
    for (let i = 0; i < CARDS_NUM; i++) {
      const suit = SUITS[i % SUITS.length];
      const rank = RANKS[Math.floor(i / SUITS.length) % RANKS.length];
      const texture = PIXI.Texture.from(`card_${suit}_${rank}.png`);
      const card = new PIXI.Sprite(texture);
      card.width = CARD_WIDTH;
      card.height = CARD_HEIGHT;
      card.anchor.set(0.5, 0.5);
      this.cards.push(card);
      this.addChild(card);

      this.cardStacks[0].pushCard(card);
    }
  }

  private createTitle(): PIXI.Text {
    const titleLabel = new PIXI.Text({
      text: "Ace of Shadows",
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

  private createFastButton(): Button {
    return new Button({
      label: "FAST!!!",
      width: 140,
      height: 40,
      onClick: () => {
        this.fastMode = true;
      },
    });
  }

  private async doRecursiveAnimation(): Promise<void> {
    const currentStack = this.reverse ? this.cardStacks[0] : this.cardStacks[1];
    const targetStack = this.reverse ? this.cardStacks[1] : this.cardStacks[0];
    if (currentStack.count === 0) {
      this.reverse = !this.reverse;
      this.doRecursiveAnimation();
      return;
    }

    const currentCard = currentStack.popCard();
    const targetPos = targetStack.getPositionForIndex(targetStack.count);
    await waitForTween(
      TweenManager.createTween(currentCard!, this.tweenGroupName)
        .to(
          {
            x: targetPos.x,
            y: targetPos.y,
          },
          this.getDuration(),
        )
        .easing(Easing.Cubic.In)
        .delay(this.getDelay()),
    );
    targetStack.pushCard(currentCard!);
    this.doRecursiveAnimation();
  }

  private getDuration(): number {
    return this.fastMode ? 200 : 2000;
  }

  private getDelay(): number {
    return this.fastMode ? 0 : 1000;
  }
}
