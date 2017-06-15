import { ComponentNode } from './html';

export const getAnimationDuration = ($el: Element) => parseFloat(window.getComputedStyle($el).animationDuration);

export const setAnimation = (animationClass: string, duration?: number) => ({ dom }: ComponentNode) => {
  dom.classList.add(animationClass);
  return new Promise((resolve) => {
    setTimeout(resolve, duration == null ? 0.95 * getAnimationDuration(dom) * 1e3 : duration);
  });
};
