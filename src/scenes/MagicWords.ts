import { Easing } from "@tweenjs/tween.js";
import * as PIXI from "pixi.js";
import CustomLoader from "../loader";
import {
  GAME_HEIGHT,
  GAME_HOZ_CENTER,
  GAME_VER_CENTER,
  GAME_WIDTH,
} from "../main";
import TweenManager from "../TweenManager";
import { waitForSeconds, waitForTween } from "../utils";
import { IScene } from "./IScene";

type DialogueLine = {
  name: string;
  text: string;
};

type EmojiAsset = {
  name: string;
  url: string;
};

type AvatarAsset = {
  name: string;
  url: string;
  position: "left" | "right";
};

type ResponseData = {
  dialogue: DialogueLine[];
  emojies: EmojiAsset[];
  avatars: AvatarAsset[];
};

const DATA_ENDPOINT =
  "https://private-624120-softgamesassignment.apiary-mock.com/v2/magicwords";

export class MagicWordsScene extends PIXI.Container implements IScene {
  private titleLabel: PIXI.Text;
  private leftAvatar: PIXI.Sprite;
  private rightAvatar: PIXI.Sprite;
  private dialogueText: PIXI.HTMLText;

  private readonly tweenGroupName = "magicWords";

  private data: ResponseData | null = null;

  private stopped = false;

  constructor() {
    super();

    this.titleLabel = this.createTitle();
    this.addChild(this.titleLabel);

    this.leftAvatar = new PIXI.Sprite();
    this.leftAvatar.anchor.set(0.5);
    this.leftAvatar.position.set(-100, GAME_HEIGHT - 100);
    this.addChild(this.leftAvatar);

    this.rightAvatar = new PIXI.Sprite();
    this.rightAvatar.anchor.set(0.5);
    this.rightAvatar.position.set(GAME_WIDTH + 100, GAME_HEIGHT - 100);
    this.addChild(this.rightAvatar);

    this.dialogueText = new PIXI.HTMLText({
      text: "",
      style: {
        fontFamily: "Arial",
        fontSize: 24,
        fill: 0xffffff,
        wordWrap: true,
        wordWrapWidth: GAME_WIDTH - 150,
      },
    });
    this.dialogueText.anchor.set(0.5);
    this.dialogueText.position.set(GAME_HOZ_CENTER, GAME_VER_CENTER - 50);
    this.dialogueText.alpha = 0.0;

    this.addChild(this.dialogueText);
  }

  public async load(): Promise<void> {
    await PIXI.Assets.load("assets/game_sheet.json");
    await this.fetchAndLoadEndpoint();
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public update(_deltaTime: number): void {
    // Do nothing
  }

  public destroy(): void {
    TweenManager.destroyGroup(this.tweenGroupName);
    super.destroy({ children: true });
  }

  public async onEnter(): Promise<void> {
    this.startDialogue();
  }

  public async onExit(): Promise<void> {
    this.stopped = true;
  }

  private async startDialogue(): Promise<void> {
    if (this.stopped) return;
    for await (const line of this.data!.dialogue) {
      if (this.stopped) return;
      await this.showDialogueLine(line);
    }

    await waitForSeconds(3);

    this.startDialogue();
  }

  private async showDialogueLine(line: DialogueLine): Promise<void> {
    const avatarName = line.name;
    const currentAvatar = this.setAvatarByName(avatarName);
    const initialPosX = currentAvatar.position.x;

    if (this.stopped) return;
    await waitForTween(
      TweenManager.createTween(currentAvatar, this.tweenGroupName)
        .to({ x: GAME_HOZ_CENTER }, 500)
        .easing(Easing.Quadratic.Out),
    );

    this.dialogueText.text = this.convertTextToHTML(line.text);
    await waitForTween(
      TweenManager.createTween(this.dialogueText, this.tweenGroupName)
        .to({ alpha: 1.0 }, 500)
        .easing(Easing.Quadratic.InOut),
    );

    await waitForSeconds(2);

    if (this.stopped) return;
    await waitForTween(
      TweenManager.createTween(this.dialogueText, this.tweenGroupName)
        .to({ alpha: 0.0 }, 500)
        .easing(Easing.Quadratic.InOut),
    );

    await waitForTween(
      TweenManager.createTween(currentAvatar, this.tweenGroupName)
        .to({ x: initialPosX }, 500)
        .easing(Easing.Quadratic.In),
    );
  }

  private setAvatarByName(name: string): PIXI.Sprite {
    const avatar = this.data?.avatars.find((a) => a.name === name) ?? {
      name: "Penny",
      url: "",
      position: "left",
    };
    const sprite =
      avatar.position === "left" ? this.leftAvatar : this.rightAvatar;
    sprite.texture = PIXI.Assets.get(avatar.name) as PIXI.Texture;
    return sprite;
  }

  private convertTextToHTML(text: string): string {
    return text.replace(/{([^}]+)}/g, (match, emojiName) => {
      const emojiAsset = PIXI.Assets.get(emojiName);
      console.log("Emoji asset for", emojiName, ":", emojiAsset);
      if (emojiAsset) {
        return `<img src="${emojiAsset.label}" width="32" height="32" style="margin-bottom: -5px" />`;
      }
      // Return original text with braces if asset not found
      return match;
    });
  }

  private createTitle(): PIXI.Text {
    const titleLabel = new PIXI.Text({
      text: "Magic Words",
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

  private async fetchAndLoadEndpoint(): Promise<void> {
    const response = await fetch(DATA_ENDPOINT);
    this.data = await response.json();

    for (const emoji of this.data!.emojies) {
      await CustomLoader.fetchAndConvertToPNG(emoji.name, emoji.url);
    }
    for (const avatar of this.data!.avatars) {
      await CustomLoader.fetchAndConvertToPNG(avatar.name, avatar.url);
    }
  }
}
