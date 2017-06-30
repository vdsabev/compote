"use strict";
exports.__esModule = true;
var html_1 = require("../../html");
var timeago_js_1 = require("timeago.js");
var clock_1 = require("../clock");
exports.Timeago = function (date) { return (html_1.div({ "class": 'flex-row justify-content-start align-items-center', title: date.toLocaleString() }, [
    clock_1.Clock(date),
    // TODO: Cache instance & automatically update `timeago`
    timeago_js_1["default"]().format(date)
])); };
