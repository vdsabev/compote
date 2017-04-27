import './style.scss';
import { div } from '../../html';
export var AspectRatioContainer = function (aspectRatio, content) { return (div({ className: 'aspect-ratio-container' }, [
    div({ style: { 'padding-bottom': 100 * aspectRatio.y / aspectRatio.x + "%" } }),
    content
])); };
