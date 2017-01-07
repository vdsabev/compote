module compote.examples.todomvc.test {
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

  run({
    Component: {
      parseTree: {
        'should parse tag name'(done: Function) {
          const [tagName, properties, children] = Compote['parseTree'](['div']);
          expect.equal(tagName, 'div');
          expect.equal(properties, undefined);
          expect.equal(children, undefined);
          done();
        },

        'should parse shorthand text content instead of properties'(done: Function) {
          const [tagName, properties, children] = Compote['parseTree'](['div', 'content']);
          expect.equal(tagName, 'div');
          expect.equal(properties.textContent, 'content');
          expect.equal(children, undefined);
          done();
        },

        'should parse shorthand children instead of properties'(done: Function) {
          const [tagName, properties, children] = Compote['parseTree'](['div', ['content']]);
          expect.equal(tagName, 'div');
          expect.equal(properties, undefined);
          expect.equal(children[0], 'content');
          done();
        },

        'should parse shorthand properties without children'(done: Function) {
          const [tagName, properties, children] = Compote['parseTree'](['div', { a: 'b' }]);
          expect.equal(tagName, 'div');
          expect.equal(properties.a, 'b');
          expect.equal(children, undefined);
          done();
        },

        'should parse text content instead of children'(done: Function) {
          const [tagName, properties, children] = Compote['parseTree'](['div', { a: 'b' }, 'content']);
          expect.equal(tagName, 'div');
          expect.equal(properties.a, 'b');
          expect.equal(properties.textContent, 'content');
          expect.equal(children, undefined);
          done();
        },

        'should parse children'(done: Function) {
          const [tagName, properties, children] = Compote['parseTree'](['div', { a: 'b' }, ['content']]);
          expect.equal(tagName, 'div');
          expect.equal(properties.a, 'b');
          expect.equal(children[0], 'content');
          done();
        },

        'should parse children recursively'(done: Function) {
          const [tagName, properties, children] = Compote['parseTree'](
            ['div', [
              ['div', 'a'],
              ['div', 'b'],
              ['div', 'c']
            ]]
          );

          expect.equal(tagName, 'div');
          expect.equal(properties, undefined);

          expect.equal(children[0][0], 'div');
          expect.equal(children[0][1].textContent, 'a');

          expect.equal(children[1][0], 'div');
          expect.equal(children[1][1].textContent, 'b');

          expect.equal(children[2][0], 'div');
          expect.equal(children[2][1].textContent, 'c');

          done();
        },

        'should parse component class and merge properties & children'(done: Function) {
          class TestComponent extends Component {
            render() {
              return ['div', { a: 'b' }, ['c', 'd']];
            }
          }

          const [tagName, properties, children] = Compote['parseTree']([TestComponent, { a: 'e' }, ['f']]);
          expect.equal(tagName, 'div');
          expect.equal(properties.a, 'e');
          expect.equal(children.length, 1);
          expect.equal(children[0], 'f');
          done();
        },

        'should parse component class and default to original properties & children'(done: Function) {
          class TestComponent extends Component {
            render() {
              return ['div', { a: 'b' }, ['c', 'd']];
            }
          }

          const [tagName, properties, children] = Compote['parseTree']([TestComponent]);
          expect.equal(tagName, 'div');
          expect.equal(properties.a, 'b');
          expect.equal(children[0], 'c');
          expect.equal(children[1], 'd');
          done();
        },

        'should parse component class and assign data to instance'(done: Function) {
          class TestComponent extends Component {
            render() {
              return ['div', { a: this.a }];
            }

            a = 'b';
          }

          const [tagName, properties, children] = Compote['parseTree']([TestComponent, { $data: { a: 'c' } }]);
          expect.equal(tagName, 'div');
          expect.equal(properties.a, 'c');
          expect.equal(children, undefined);
          done();
        }
      }
    }
  });
}
