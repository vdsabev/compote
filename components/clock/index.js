import { svg, circle, line } from '../../html';
var clockSize = 17.5;
var clockMargin = 3;
export var clockCenter = clockSize / 2;
export var clockRadius = clockSize / 2 - clockMargin;
export var hoursLineMultiplier = 0.4;
export var minutesLineMultiplier = 0.55;
export var timeToXY = function (maxTime) { return function (time) {
    var multiplier = 2 * Math.PI * time / maxTime;
    return [Math.sin(multiplier), -Math.cos(multiplier)];
}; };
export var hoursToXY = timeToXY(12);
export var minutesToXY = timeToXY(60);
export var Clock = function (date, _a) {
    var dynamic = (_a === void 0 ? {} : _a).dynamic;
    var _b = dynamic ? hoursToXY(date.getHours()) : [1, 0], hoursX = _b[0], hoursY = _b[1];
    var _c = dynamic ? minutesToXY(date.getMinutes()) : [0, -1], minutesX = _c[0], minutesY = _c[1];
    return (svg({
        width: clockSize + 2 * clockMargin,
        height: clockSize,
        viewBox: "0 0 " + clockSize + " " + clockSize,
        style: {
            'stroke-linecap': 'round'
        }
    }, [
        circle({
            cx: clockCenter,
            cy: clockCenter,
            r: clockRadius,
            style: {
                fill: 'none',
                stroke: 'white',
                'stroke-width': 2.25
            }
        }),
        line({
            x1: clockCenter,
            y1: clockCenter,
            x2: clockCenter + hoursLineMultiplier * hoursX * clockRadius,
            y2: clockCenter + hoursLineMultiplier * hoursY * clockRadius,
            style: {
                stroke: 'white',
                'stroke-width': 1.25
            }
        }),
        line({
            x1: clockCenter,
            y1: clockCenter,
            x2: clockCenter + minutesLineMultiplier * minutesX * clockRadius,
            y2: clockCenter + minutesLineMultiplier * minutesY * clockRadius,
            style: {
                stroke: 'white',
                'stroke-width': 1.25
            }
        })
    ]));
};
