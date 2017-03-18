export function getAnimationDuration($el) {
    return parseFloat(window.getComputedStyle($el).animationDuration);
}
