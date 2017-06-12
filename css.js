export var getAnimationDuration = function ($el) { return parseFloat(window.getComputedStyle($el).animationDuration); };
export var setAnimation = function (animationClass, timingScale) {
    if (timingScale === void 0) { timingScale = 0.95; }
    return function (_a) {
        var dom = _a.dom;
        dom.classList.add(animationClass);
        return new Promise(function (resolve) {
            setTimeout(resolve, timingScale * getAnimationDuration(dom) * 1e3);
        });
    };
};
