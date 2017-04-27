(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "./style.scss", "../../html"], factory);
    }
})(function (require, exports) {
    "use strict";
    exports.__esModule = true;
    require("./style.scss");
    var html_1 = require("../../html");
    exports.AspectRatioContainer = function (aspectRatio, content) { return (html_1.div({ className: 'aspect-ratio-container' }, [
        html_1.div({ style: { 'padding-bottom': 100 * aspectRatio.y / aspectRatio.x + "%" } }),
        content
    ])); };
});
