import * as PIXI from "pixi.js";

export default class CardStack extends PIXI.Container {
  private cards: PIXI.Sprite[] = [];
  private offset: number;

  constructor(pos: PIXI.Point, offset: number = 12) {
    super();
    this.position.set(pos.x, pos.y);
    this.offset = offset;
  }

  public get count(): number {
    return this.cards.length;
  }

  public pushCard(card: PIXI.Sprite): void {
    this.cards.push(card);
    this.refreshPositions();
  }

  public popCard(): PIXI.Sprite | null {
    if (this.cards.length === 0) return null;
    const [removedCard] = this.cards.splice(this.cards.length - 1, 1);
    this.refreshPositions();
    return removedCard;
  }

  private refreshPositions(): void {
    this.cards.forEach((card, index) => {
      const { x, y } = this.getPositionForIndex(index);
      card.position.set(x, y);
      card.zIndex = index;
    });
  }

  public getPositionForIndex(index: number): PIXI.Point {
    return new PIXI.Point(this.x, this.y + this.offset * index);
  }
}
