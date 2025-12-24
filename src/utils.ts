import * as PIXI from "pixi.js";
import { Tween } from "@tweenjs/tween.js";

export function waitForSeconds(seconds: number): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(resolve, seconds * 1000);
  });
}

export function waitForTween(tween: Tween, start = true): Promise<void> {
  return new Promise((resolve) => {
    tween.onComplete(resolve);
    if (start) {
      tween.start();
    }
  });
}

export function isMobile(): boolean {
  return /Mobi|Android/i.test(navigator.userAgent) || PIXI.isMobile.any;
}
