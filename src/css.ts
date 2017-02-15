module compote.css {
  export function getAnimationDuration($el: HTMLElement) {
    return parseFloat(window.getComputedStyle($el).animationDuration);
  }
}
