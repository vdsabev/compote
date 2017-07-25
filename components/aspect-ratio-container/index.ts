import * as Mithril from '../../node_modules/@types/mithril/index';

import './style.scss';

import { div, Properties } from '../../html';

export type AspectRatioContainerProperties = Properties<HTMLDivElement> & { aspectRatio: { x: number, y: number } };

export const AspectRatioContainer = ({ aspectRatio, className, ...props }: AspectRatioContainerProperties, content?: Mithril.Children) => (
  div({ ...props, class: `aspect-ratio-container ${props.class || className || ''}` }, [
    div({ style: { paddingBottom: `${100 * aspectRatio.y / aspectRatio.x}%` } }),
    content
  ])
);
