"use strict";
var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) if (e.indexOf(p[i]) < 0)
            t[p[i]] = s[p[i]];
    return t;
};
exports.__esModule = true;
require("./style.scss");
var html_1 = require("../../html");
exports.AspectRatioContainer = function (_a, content) {
    var aspectRatio = _a.aspectRatio, className = _a.className, props = __rest(_a, ["aspectRatio", "className"]);
    return (html_1.div(__assign({}, props, { "class": "aspect-ratio-container " + (props["class"] || className || '') }), [
        html_1.div({ style: { paddingBottom: 100 * aspectRatio.y / aspectRatio.x + "%" } }),
        content
    ]));
};
