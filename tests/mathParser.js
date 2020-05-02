
const requireESM = require('esm')(module);
const MathParser = requireESM('../src/web-workbench/classes/MathParser').default;

const mathParser = new MathParser();

mathParser.parse('RIGHT$("XYZ", LEN("XYZ")-1)').then((result) => {
  console.log(result);
  return result;
}).catch((err) => {
  throw err;
});
