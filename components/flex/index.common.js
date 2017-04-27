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
