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
  };

  function run(tests: Tests) {
    for (let key in tests) {
      if (tests.hasOwnProperty(key)) {
        const test = tests[key];
        console.warn('\t'.repeat(expect.level) + key);
        expect.level++;

        if (typeof test === 'object') {
          run(test);
        }
        else {
          test();
        }

        expect.level--;
      }
    }
  }

  const renderer = new core.Renderer();

  run({
    Renderer: {
      parse: {
        tagName: {
          'should parse `tagName`'() {
            const tree = renderer.parse(`<div></div>`);
            expect.equal(tree.tagName, 'div');
          }
        },

        attributes: {
          'should parse a single attribute'() {
            const tree = renderer.parse(`<div a="1"></div>`);
            expect.equal(tree.attributes.a, '1');
          },

          'should parse multiple attributes'() {
            const tree = renderer.parse(`<div a="1" b="2" c="3"></div>`);
            expect.equal(tree.attributes.a, '1');
            expect.equal(tree.attributes.b, '2');
            expect.equal(tree.attributes.c, '3');
          },

          'should parse handlers'() {
            const tree = renderer.parse(`<div onClick="a(b)"></div>`);
            expect.equal(tree.attributes.onClick, 'a(b)');
          },

          'should parse multiple handler arguments'() {
            const tree = renderer.parse(`<div onClick="a(b,c)"></div>`);
            expect.equal(tree.attributes.onClick, 'a(b,c)');
          },

          'should parse 1-deep handlers'() {
            const tree = renderer.parse(`<div onClick="a.b(c)"></div>`);
            expect.equal(tree.attributes.onClick, 'a.b(c)');
          },

          'should parse 2-deep handlers'() {
            const tree = renderer.parse(`<div onClick="a.b.c(d)"></div>`);
            expect.equal(tree.attributes.onClick, 'a.b.c(d)');
          }
        },

        content: {
          'should parse a single character'() {
            const tree = renderer.parse(`<div>a</div>`);
            expect.equal(tree.content, 'a');
          },

          'should parse multiple characters'() {
            const tree = renderer.parse(`<div>abc</div>`);
            expect.equal(tree.content, 'abc');
          }
        }
      }
    }
  });
}
