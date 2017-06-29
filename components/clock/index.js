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
        width: { baseVal: { value: clockSize + 2 * clockMargin } },
        height: { baseVal: { value: clockSize } },
        viewBox: { baseVal: { x: 0, y: 0, width: clockSize, height: clockSize } },
        style: {
            strokeLinecap: 'round'
        }
    }, [
        circle({
            cx: { baseVal: { value: clockCenter } },
            cy: { baseVal: { value: clockCenter } },
            r: { baseVal: { value: clockRadius } },
            style: {
                fill: 'none',
                stroke: 'white',
                strokeWidth: '2.25'
            }
        }),
        line({
            x1: { baseVal: { value: clockCenter } },
            y1: { baseVal: { value: clockCenter } },
            x2: { baseVal: { value: clockCenter + hoursLineMultiplier * hoursX * clockRadius } },
            y2: { baseVal: { value: clockCenter + hoursLineMultiplier * hoursY * clockRadius } },
            style: {
                stroke: 'white',
                strokeWidth: '1.25'
            }
        }),
        line({
            x1: { baseVal: { value: clockCenter } },
            y1: { baseVal: { value: clockCenter } },
            x2: { baseVal: { value: clockCenter + minutesLineMultiplier * minutesX * clockRadius } },
            y2: { baseVal: { value: clockCenter + minutesLineMultiplier * minutesY * clockRadius } },
            style: {
                stroke: 'white',
                strokeWidth: '1.25'
            }
        })
    ]));
};
