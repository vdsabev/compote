import { ComponentNode } from './html';

export const getAnimationDuration = ($el: Element) => parseFloat(window.getComputedStyle($el).animationDuration);

export const setAnimation = (animationClass: string, timingScale = 0.95) => ({ dom }: ComponentNode) => {
  dom.classList.add(animationClass);
  return new Promise((resolve) => {
    setTimeout(resolve, timingScale * getAnimationDuration(dom) * 1e3);
  });
};
