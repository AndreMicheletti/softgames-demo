import { Group, Tween } from "@tweenjs/tween.js";

export default class TweenManager {
  public static defaultGroup = new Group();

  public static groups: Map<string, Group> = new Map();

  public static createTween(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    target: any,
    groupName: string | null = null,
  ): Tween {
    const group = groupName ? TweenManager.getOrCreateGroup(groupName) : null;
    return new Tween(target, group || TweenManager.defaultGroup);
  }

  public static addGroup(name: string): Group {
    const group = new Group();
    TweenManager.groups.set(name, group);
    return group;
  }

  public static getGroup(name: string): Group | undefined {
    return TweenManager.groups.get(name);
  }

  private static getOrCreateGroup(name: string): Group | undefined {
    const group = TweenManager.groups.get(name);
    if (!group) {
      return TweenManager.addGroup(name);
    }
    return group;
  }

  public static destroyGroup(name: string): void {
    const group = this.getGroup(name);
    group?.removeAll();
    TweenManager.groups.delete(name);
  }

  public static update(): void {
    TweenManager.defaultGroup.update();
    TweenManager.groups.forEach((group) => group.update());
  }
}
