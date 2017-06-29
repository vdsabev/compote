"use strict";
exports.__esModule = true;
var html_1 = require("../../html");
var clockSize = 17.5;
var clockMargin = 3;
exports.clockCenter = clockSize / 2;
exports.clockRadius = clockSize / 2 - clockMargin;
exports.hoursLineMultiplier = 0.4;
exports.minutesLineMultiplier = 0.55;
exports.timeToXY = function (maxTime) { return function (time) {
    var multiplier = 2 * Math.PI * time / maxTime;
    return [Math.sin(multiplier), -Math.cos(multiplier)];
}; };
exports.hoursToXY = exports.timeToXY(12);
exports.minutesToXY = exports.timeToXY(60);
exports.Clock = function (date, _a) {
    var dynamic = (_a === void 0 ? {} : _a).dynamic;
    var _b = dynamic ? exports.hoursToXY(date.getHours()) : [1, 0], hoursX = _b[0], hoursY = _b[1];
    var _c = dynamic ? exports.minutesToXY(date.getMinutes()) : [0, -1], minutesX = _c[0], minutesY = _c[1];
    return (html_1.svg({
        width: { baseVal: { value: clockSize + 2 * clockMargin } },
        height: { baseVal: { value: clockSize } },
        viewBox: { baseVal: { x: 0, y: 0, width: clockSize, height: clockSize } },
        style: {
            strokeLinecap: 'round'
        }
    }, [
        html_1.circle({
            cx: { baseVal: { value: exports.clockCenter } },
            cy: { baseVal: { value: exports.clockCenter } },
            r: { baseVal: { value: exports.clockRadius } },
            style: {
                fill: 'none',
                stroke: 'white',
                strokeWidth: '2.25'
            }
        }),
        html_1.line({
            x1: { baseVal: { value: exports.clockCenter } },
            y1: { baseVal: { value: exports.clockCenter } },
            x2: { baseVal: { value: exports.clockCenter + exports.hoursLineMultiplier * hoursX * exports.clockRadius } },
            y2: { baseVal: { value: exports.clockCenter + exports.hoursLineMultiplier * hoursY * exports.clockRadius } },
            style: {
                stroke: 'white',
                strokeWidth: '1.25'
            }
        }),
        html_1.line({
            x1: { baseVal: { value: exports.clockCenter } },
            y1: { baseVal: { value: exports.clockCenter } },
            x2: { baseVal: { value: exports.clockCenter + exports.minutesLineMultiplier * minutesX * exports.clockRadius } },
            y2: { baseVal: { value: exports.clockCenter + exports.minutesLineMultiplier * minutesY * exports.clockRadius } },
            style: {
                stroke: 'white',
                strokeWidth: '1.25'
            }
        })
    ]));
};
