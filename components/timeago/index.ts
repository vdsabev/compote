import { div } from '../../html';
import timeago from 'timeago.js';

import { Clock } from '../clock';

export const Timeago = (date: Date) => (
  div({ class: 'flex-row justify-content-start align-items-center', title: date.toLocaleString() }, [
    Clock(date),
    // TODO: Cache instance & automatically update `timeago`
    timeago().format(date)
  ])
);
