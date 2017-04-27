(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports"], factory);
    }
})(function (require, exports) {
    "use strict";
    exports.__esModule = true;
    exports.flex = function (value) {
        value = (value == null ? '' : value).toString();
        return {
            '-webkit-box-flex': value,
            '-moz-box-flex': value,
            '-webkit-flex': value,
            '-ms-flex': value,
            'flex': value
        };
    };
});
