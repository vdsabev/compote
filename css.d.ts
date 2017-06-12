import { ComponentNode } from './html';
export declare const getAnimationDuration: ($el: Element) => number;
export declare const setAnimation: (animationClass: string, timingScale?: number) => ({dom}: ComponentNode) => Promise<{}>;
