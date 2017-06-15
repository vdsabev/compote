export var getAnimationDuration = function ($el) { return parseFloat(window.getComputedStyle($el).animationDuration); };
export var setAnimation = function (animationClass, duration) { return function (_a) {
    var dom = _a.dom;
    return new Promise(function (resolve) {
        dom.classList.add(animationClass);
        setTimeout(function () {
            resolve();
            dom.classList.remove(animationClass);
        }, duration != null ? duration : 0.95 * getAnimationDuration(dom) * 1e3);
    });
}; };
