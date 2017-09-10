import './style.scss';
import { div } from 'compote/html';
export var Loading = {
    view: function () { return (div({ "class": 'absolute stretch flex-row justify-content-center align-items-center' }, [
        div({ "class": 'loading-arc width-md height-md br-50p spin-right-animation' })
    ])); }
};
