import './style.scss';

import { Children } from 'mithril';
import { div } from '../../html';

export const AspectRatioContainer = (aspectRatio: { x: number, y: number }, content: Children) => (
  div({ className: 'aspect-ratio-container' }, [
    div({ style: { 'padding-bottom': `${100 * aspectRatio.y / aspectRatio.x}%` } }),
    content
  ])
);
