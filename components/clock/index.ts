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
      width: clockSize + 2 * clockMargin,
      height: clockSize,
      viewBox: `0 0 ${clockSize} ${clockSize}`,
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
    ])
  );
};
