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

  const { Parser } = core;

  run({
    Parser: {
      parseTemplate: {
        tagName: {
          'should parse `tagName`'() {
            const tree = Parser.parseTemplate(`<div></div>`);
            expect.equal(tree.tagName, 'div');
          },

          'should parse spaces'() {
            const tree = Parser.parseTemplate(`  \n<div>\n</div>\n  `);
            expect.equal(tree.tagName, 'div');
          }
        },

        attributes: {
          'should parse a single attribute'() {
            const tree = Parser.parseTemplate(`<div a="1"></div>`);
            expect.equal(tree.attributes['a'], '1');
          },

          'should parse multiple attributes'() {
            const tree = Parser.parseTemplate(`<div a="1" b="2" c="3"></div>`);
            expect.equal(tree.attributes['a'], '1');
            expect.equal(tree.attributes['b'], '2');
            expect.equal(tree.attributes['c'], '3');
          },

          'should parse handlers'() {
            const tree = Parser.parseTemplate(`<div onClick="a(b)"></div>`);
            expect.equal(tree.attributes['onClick'], 'a(b)');
          },

          'should parse multiple handler arguments'() {
            const tree = Parser.parseTemplate(`<div onClick="a(b,c)"></div>`);
            expect.equal(tree.attributes['onClick'], 'a(b,c)');
          },

          'should parse 1-deep handlers'() {
            const tree = Parser.parseTemplate(`<div onClick="a.b(c)"></div>`);
            expect.equal(tree.attributes['onClick'], 'a.b(c)');
          },

          'should parse 2-deep handlers'() {
            const tree = Parser.parseTemplate(`<div onClick="a.b.c(d)"></div>`);
            expect.equal(tree.attributes['onClick'], 'a.b.c(d)');
          }
        },

        children: {
          'should parse a single character'() {
            const tree = Parser.parseTemplate(`<div>a</div>`);
            expect.equal(tree.children.length, 1);
            expect.equal(tree.children[0], 'a');
          },

          'should parse multiple characters'() {
            const tree = Parser.parseTemplate(`<div>abc</div>`);
            expect.equal(tree.children.length, 1);
            expect.equal(tree.children[0], 'abc');
          },

          'should parse HTML'() {
            const tree = Parser.parseTemplate(`<a><b></b></a>`);

            expect.equal(tree.tagName, 'a');

            const children = <core.VirtualTree[]>tree.children;
            expect.equal(tree.children.length, 1);

            expect.equal(children[0].tagName, 'b');
          },

          'should parse multiple children'() {
            debugger;
            const tree = Parser.parseTemplate(`
              <a>
                <b></b>
                <c></c>
                <d></d>
              </a>
            `);

            expect.equal(tree.tagName, 'a');

            const children = <core.VirtualTree[]>tree.children;
            expect.equal(tree.children.length, 3);

            expect.equal(children[0].tagName, 'b');
            expect.equal(children[1].tagName, 'c');
            expect.equal(children[2].tagName, 'd');
          }
        }
      }
    }
  });
}