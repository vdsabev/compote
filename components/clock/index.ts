import { svg, circle, line } from '../../html';

const clockSize = 17.5;
const clockMargin = 3;
export const clockCenter = clockSize / 2;
export const clockRadius = clockSize / 2 - clockMargin;
export const hoursLineMultiplier = 0.4;
export const minutesLineMultiplier = 0.55;

export const timeToXY = (maxTime: number) => (time: number): [number, number] => {
  const multiplier = 2 * Math.PI * time / maxTime;
  return [Math.sin(multiplier), -Math.cos(multiplier)];
};

export const hoursToXY = timeToXY(12);
export const minutesToXY = timeToXY(60);

export type ClockOptions = {
  dynamic?: boolean
};

export const Clock = (date: Date, { dynamic }: ClockOptions = {}) => {
  const [hoursX, hoursY] = dynamic ? hoursToXY(date.getHours()) : [1, 0];
  const [minutesX, minutesY] = dynamic ? minutesToXY(date.getMinutes()) : [0, -1];

  return (
    svg({
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
    ])
  );
};
