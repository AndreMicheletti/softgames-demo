import { Group, Tween } from "@tweenjs/tween.js";

export default class TweenManager {
  public static defaultGroup = new Group();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public static createTween(target: any): Tween {
    return new Tween(target, TweenManager.defaultGroup);
  }
}
