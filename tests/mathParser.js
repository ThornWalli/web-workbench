
const requireESM = require('esm')(module);
const MathParser = requireESM('../src/web-workbench/classes/MathParser').default;

console.log(MathParser.parse('STRING$(stars, "*")'));
