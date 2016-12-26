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

  // const { Parser } = core;
  //
  // run({
  //   Parser: {
  //     parseTemplate: {
  //       tagName: {
  //         'should parse `tagName`'() {
  //           const tree = Parser.parseTemplate(`<div></div>`);
  //           expect.equal(tree.tagName, 'div');
  //         },
  //
  //         'should parse spaces'() {
  //           const tree = Parser.parseTemplate(`  \n<div>\n</div>\n  `);
  //           expect.equal(tree.tagName, 'div');
  //         }
  //       }
  //     }
  //   }
  // });
}
