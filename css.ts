import { ComponentNode } from './html';

export const getAnimationDuration = ($el: Element) => parseFloat(window.getComputedStyle($el).animationDuration);

export const setAnimation = (animationClass: string, duration?: number) => ({ dom }: ComponentNode) => new Promise((resolve) => {
  dom.classList.add(animationClass);
  setTimeout(() => {
    resolve();
    dom.classList.remove(animationClass);
  }, duration != null ? duration : 0.95 * getAnimationDuration(dom) * 1e3);
});
