// TODO: Rewrite
module compote.test {
  const expect = {
    level: 0,
    equal(actual: any, expected: any) {
      if (actual !== expected) {
        console.error(`${'\t'.repeat(expect.level)}Expected ${JSON.stringify(actual)} === ${JSON.stringify(expected)}`);
      }
    },
    notEqual(actual: any, expected: any) {
      if (actual === expected) {
        console.error(`${'\t'.repeat(expect.level)}Expected ${JSON.stringify(actual)} !== ${JSON.stringify(expected)}`);
      }
    }
  };

  type Tests = {
    [key: string]: Function | Tests
    before?: Function
    beforeEach?: Function
    after?: Function
    afterEach?: Function
  };

  async function run(tests: Tests): Promise<void> {
    const { before, beforeEach, after, afterEach } = tests;

    if (before) {
      before();
    }

    for (let key in tests) {
      if (tests.hasOwnProperty(key) && key !== 'beforeEach') {
        const test = tests[key];
        console.warn('\t'.repeat(expect.level) + key);
        expect.level++;

        if (typeof test === 'object') {
          await run(test);
        }
        else {
          if (beforeEach) {
            beforeEach();
          }

          await new Promise((resolve) => {
            test(() => resolve());
          });

          if (afterEach) {
            afterEach();
          }
        }

        expect.level--;
      }
    }

    if (after) {
      after();
    }
  }

  const { App } = core;

  run({
    App: {
      constructor: {
        'should set `render` and `container` properties'(done: Function) {
          const render = () => 'a';
          const container: any = { appendChild: () => 'b' };
          const app = new App({ render: <any>render, container });
          expect.equal(app.render, render);
          expect.equal(app.container, container);
          done();
        }
      }
    }
  });
}
