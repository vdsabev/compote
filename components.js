const ts = require('typescript');
const glob = require('glob');

function compile(fileNames, options) {
  const program = ts.createProgram(fileNames, options);
  const emitResult = program.emit();

  const allDiagnostics = ts.getPreEmitDiagnostics(program).concat(emitResult.diagnostics);

  // allDiagnostics.forEach((diagnostic) => {
  //   const { line, character } = diagnostic.file.getLineAndCharacterOfPosition(diagnostic.start);
  //   const message = ts.flattenDiagnosticMessageText(diagnostic.messageText, '\n');
  //   console.log(`${diagnostic.file.fileName} (${line + 1},${character + 1}): ${message}`);
  // });

  const exitCode = emitResult.emitSkipped ? 1 : 0;
  process.exit(exitCode);
}

compile(glob.sync('./components/**/index.ts'), {
  lib: ['es6', 'dom'],
  module: ts.ModuleKind.UMD
});
