
const requireESM = require('esm')(module);
const Memory = requireESM('../src/web-workbench/classes/Memory').default;
const BasicInterpreter = requireESM('../src/web-workbench/classes/BasicInterpreter').default;
const MathParser = requireESM('../src/web-workbench/classes/MathParser').default;

const memory = new Memory();

const basicInterpreter = new BasicInterpreter(memory);
const mathParser = new MathParser(memory);

const lines = [
  // 'PRINT USING "RIGHT$(\\"XYZ\\", LEN(\\"XYZ\\")-1) #"; RIGHT$("XYZ", LEN("XYZ")-1)'
  'PRINT USING "#"; RIGHT$("XYZ", LEN("XYZ")-1)'

  // 'DIM title',
  // 'LET title = "*** " + "test" + " ***"',
  // 'PRINT title',
  // '// Functions',

  // 'SUB Separator(stars) STATIC',
  // 'PRINT STRING$(stars, "*")',
  // 'END SUB',

  // 'SUB Headline(title$) STATIC',
  // 'LET title$ = "*** " + title + " ***"',
  // 'PRINT ""',
  // 'Separator(LEN(title$))',
  // 'PRINT title$',
  // 'Separator(LEN(title$))',
  // 'PRINT ""',
  // 'END SUB',

  // '// Output',

  // 'Headline("Mount Cloud Storages…")'

];

const output = [];
basicInterpreter.parse(lines, (result, options) => {
  if (mathParser.validInput(result)) {
    result = mathParser.parse(result);
  } else if (/^\w+$/.test(result)) {
    // TODO: Methoden oder variablen aufruf aufruf
    console.warn(`can\\'t use variable or method "${result}"`);
  }

  if (options.message) {
    output.push(options.message);
  }

  return result;
}).then((result) => {
  console.log(output);
  return result;
}).catch((err) => {
  throw err;
});
