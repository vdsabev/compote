export var getAnimationDuration = function ($el) { return parseFloat(window.getComputedStyle($el).animationDuration); };
export var setAnimation = function (animationClass, duration) { return function (_a) {
    var dom = _a.dom;
    dom.classList.add(animationClass);
    return new Promise(function (resolve) {
        setTimeout(resolve, duration == null ? 0.95 * getAnimationDuration(dom) * 1e3 : duration);
    });
}; };
