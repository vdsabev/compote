import { ComponentNode } from './html';
export declare const getAnimationDuration: ($el: HTMLElement) => number;
export declare const setAnimation: (animationClass: string, timingScale?: number) => ({dom}: ComponentNode) => Promise<{}>;
