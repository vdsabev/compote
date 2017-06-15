import { ComponentNode } from './html';
export declare const getAnimationDuration: ($el: Element) => number;
export declare const setAnimation: (animationClass: string, duration?: number) => ({dom}: ComponentNode) => Promise<{}>;
