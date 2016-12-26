module compote.test {
  const expect = {
    level: 0,
    equal(actual: any, expected: any) {
      if (actual !== expected) {
        console.error(`${'\t'.repeat(expect.level)}Expected ${JSON.stringify(expected)}, actual ${JSON.stringify(actual)}`);
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

          await new Promise((resolve, reject) => {
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

  const { Component, Parser } = core;

  run({
    Parser: {
      parse: {
        'should parse property expression'(done: Function) {
          new Component({
            data: {
              a: 'b',
              $onInit() {
                const value = Parser.parse(`{{${this.$id}.a}}`);
                expect.equal(value, 'b');
                done();
              }
            }
          });
        },

        'should parse function expression'(done: Function) {
          new Component({
            data: {
              a: () => 'b',
              $onInit() {
                const value = Parser.parse(`{{Compote.${this.$id}.a(event)}}`);
                expect.equal(value, 'b');
                done();
              }
            }
          });
        }
      }
    }
  });
}
