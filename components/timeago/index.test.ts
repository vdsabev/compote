/// <reference path="../index.d.ts" />

import 'jest';

jest.mock('../../html', () => require('../../html.common.js'));
jest.mock('../clock', () => require('../clock/index.common.js'));

import * as m from 'mithril';
import { setHyperscriptFunction } from '../../html';
setHyperscriptFunction(m);

import { Timeago } from './index';

describe(`Timeago`, () => {
  it(`should render div`, () => {
    expect(Timeago(new Date()).tag).toBe('div');
  });
});
