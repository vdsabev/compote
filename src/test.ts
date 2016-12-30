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

  const { Component, Parser, Value, Watch, tag } = core;

  run({
    Component: {
      $updateAttributeExpressions: {
        'should remove empty style properties'(done: Function) {
          const attributes: Record<string, any> = { style: 'a: b; c: d; empty: ;' };
          const $el = {
            setAttribute(key: string, value: any) {
              attributes[key] = value;
            }
          };
          Component.prototype['$updateAttributeExpressions'].call(Component.prototype, $el, attributes);
          expect.equal(attributes['style'], 'a: b; c: d;');
          done();
        }
      }
    },

    Decorators: {
      Value: {
        method: {
          'should replace original property descriptor method'(done: Function) {
            function value() { /**/ }
            const propertyDescriptor = { value };
            Value(<any>{}, 'a', propertyDescriptor);
            expect.notEqual(propertyDescriptor.value, value);
            done();
          },

          'should return function value when not rendering'(done: Function) {
            const propertyDescriptor = { value: (...args: string[]) => args.join('') };
            Value(<any>{}, 'a', propertyDescriptor);
            expect.equal(propertyDescriptor.value('a', 'b', 'c'), 'abc');
            done();
          },

          'should return function expression when rendering'(done: Function) {
            const propertyDescriptor = {
              $rendering: true,
              $id: 'a',
              value: (...args: string[]) => args.join('')
            };
            Value(<any>{}, 'b', propertyDescriptor);
            expect.equal(propertyDescriptor.value('c', 'd', 'e'), Parser.surroundExpression(`a.b('c', 'd', 'e')`));
            done();
          }
        },

        property: {
          'should define property with getter & setter'(done: Function) {
            const component: any = { $update() { /**/ } };
            Value(component, 'a');
            component.a = 'b';
            expect.equal(component.$$a, 'b');
            expect.equal(component.a, 'b');
            done();
          },

          'should return expression when rendering'(done: Function) {
            const component: any = { $id: 'a', $rendering: true, $update() { /**/ } };
            Value(component, 'b');
            expect.equal(component.b, Parser.surroundExpression('a.b'));
            done();
          },

          'should call update when setting'(done: Function) {
            let updateCalls = 0;
            const component: any = { $update: () => updateCalls++ };
            Value(component, 'a');
            component.a = 'b';
            expect.equal(updateCalls, 1);
            done();
          }
        }
      },

      Watch: {
        'should initialize watches list and push values in'(done: Function) {
          const component: any = {};
          Watch<any>('a', 'b', 'c')(component, 'd', { value() { /**/ } });
          expect.equal(component.$watches.length, 1);
          expect.equal(component.$watches[0][0], 'd');
          expect.equal(component.$watches[0][1][0], 'a');
          expect.equal(component.$watches[0][1][1], 'b');
          expect.equal(component.$watches[0][1][2], 'c');
          done();
        }
      }
    },

    HTML: {
      tag: {
        'should return function that renders a tree'(done: Function) {
          const tagFn = tag('a');
          expect.equal(typeof tagFn, 'function');

          const children: any[] = [];
          const tree = tagFn({ b: 'c' }, children);
          expect.equal(tree[0].tagName, 'a');
          expect.equal(tree[0].b, 'c');
          expect.equal(tree[1], children);
          done();
        }
      }
    },

    Parser: {
      parse: {
        'should parse property expression'(done: Function) {
          new Component({
            data: {
              a: 'b',
              $onInit(this: core.Component) {
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
              $onInit(this: core.Component) {
                const value = Parser.parse(`{{Compote.${this.$id}.a()}}`);
                expect.equal(value, 'b');
                done();
              }
            }
          });
        },

        'should parse string argument'(done: Function) {
          new Component({
            data: {
              a: (b: string) => b.repeat(3),
              $onInit(this: core.Component) {
                const value = Parser.parse(`{{Compote.${this.$id}.a('b')}}`);
                expect.equal(value, 'bbb');
                done();
              }
            }
          });
        }
      }
    }
  });
}
