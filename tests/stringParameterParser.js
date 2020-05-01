const requireESM = require('esm')(module);
const StringParameterParser = requireESM('../src/web-workbench/classes/StringParameterParser').default;

StringParameterParser.DEBUG = false;
// "RAM:Test" "Test" -ignore-exist

// console.log(stringParameterParser.parse('-testA=2001 --testB=2002  \'Lammpee\''));
// console.log(StringParameterParser.parse('1+2+3+5+$$$0'));
// console.log(StringParameterParser.parse('"RAM:Test" "Test" -ignore-exist'));
// console.log(StringParameterParser.parse('remove "dir1"'));

// console.log(StringParameterParser.parse('rename --path="file1.info" --value="Test 2"" -name'));
// console.log(StringParameterParser.parse('print "\nStart testing…\n"'));
console.log(StringParameterParser.parse('print "Test" "Test2" -n'));

// console.log(StringParameterParser.parse('i%,j%'));

// console.log(stringParameterParser.parse('testCommandA  2000 -testA=2001 --testB=2002  \'Lammpee\' -testA=\'Thorn\' --testB=\'"2000"\' "Lammpee" -testA="Thorn" --testB="\\"2000\\""'));
// console.log(StringParameterParser.parse('POW(1) + (POW(2) + (POW(3) + POW(4))'));
// console.log(parser.parse('"Test"'));
// console.log(parser.parse("'Test'"));
// console.log(parser.parse('Command "Test"      \'Test\' Argument'));
// console.log(parser.parse('(5+5) / 2'));
// console.log(parser.parse('"sads"+(5+POW(5))'));
// console.log(StringParameterParser.parse('-2+4+SQRT$(2,2)'));
// console.log(parser.parse('SQRT%'));
// console.log(parser.parse('"foo" "bar"'));

// console.log(parser.parse('POW(4+5)+5+"sads"+(5+POW(5))'));
// console.log(StringParameterParser.parse('5+ddd5'));
