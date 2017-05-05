import 'jest';

import { Keyboard } from './index';

it(`should return 13 for ENTER`, () => {
  expect(Keyboard.ENTER).toBe(13);
});

it(`should return 27 for ESCAPE`, () => {
  expect(Keyboard.ESCAPE).toBe(27);
});
