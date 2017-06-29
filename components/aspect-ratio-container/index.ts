import './style.scss';

import { Children } from 'mithril';
import { div, Properties } from '../../html';

export type AspectRatioContainerProperties = Properties<HTMLDivElement> & { aspectRatio: { x: number, y: number } };

export const AspectRatioContainer = ({ aspectRatio, ...props }: AspectRatioContainerProperties, content?: Children) => (
  div({ ...props, className: `aspect-ratio-container ${props.className || ''}` }, [
    div({ style: { paddingBottom: `${100 * aspectRatio.y / aspectRatio.x}%` } }),
    content
  ])
);
