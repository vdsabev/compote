const ts = require('typescript');
const glob = require('glob');

function compile(fileNames, options) {
  const program = ts.createProgram(fileNames, options);
  program.getSourceFiles().forEach((sourceFile) => {
    const emitResult = program.emit(sourceFile, (fileName, content) => {
      if (options.module === ts.ModuleKind.CommonJS) {
        fileName = fileName.replace(/\.js$/, '.common.js');
      }
      ts.sys.writeFile(fileName, content);
    });
    if (emitResult.emitSkipped) process.exit(1);
  });

  // const allDiagnostics = ts.getPreEmitDiagnostics(program).concat(emitResult.diagnostics);
  // allDiagnostics.forEach((diagnostic) => {
  //   const { line, character } = diagnostic.file.getLineAndCharacterOfPosition(diagnostic.start);
  //   const message = ts.flattenDiagnosticMessageText(diagnostic.messageText, '\n');
  //   console.log(`${diagnostic.file.fileName} (${line + 1},${character + 1}): ${message}`);
  // });
}

const componentsGlob = glob.sync('./components/**/index.ts');

// ES2015
compile(componentsGlob, {
  lib: ['es6', 'dom'],
  module: ts.ModuleKind.ES2015
});

// CommonJS
compile(componentsGlob, {
  lib: ['es6', 'dom'],
  module: ts.ModuleKind.CommonJS
});
