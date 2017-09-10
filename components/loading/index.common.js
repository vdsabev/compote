"use strict";
exports.__esModule = true;
require("./style.scss");
var html_1 = require("compote/html");
exports.Loading = {
    view: function () { return (html_1.div({ "class": 'absolute stretch flex-row justify-content-center align-items-center' }, [
        html_1.div({ "class": 'loading-arc width-md height-md br-50p spin-right-animation' })
    ])); }
};
