import { describe, it, expect, beforeAll } from 'vitest';

import Memory from './classes/Memory';
import BasicInterpreter from './classes/BasicInterpreter';
import MathParser from './classes/MathParser';
import { cleanString } from './utils/helper';

const memory = new Memory();

let basicInterpreter, mathParser;
beforeAll(() => {
  basicInterpreter = new BasicInterpreter(memory);
  mathParser = new MathParser(memory);
});

const executeCommands = async commands => {
  const output = [];
  await basicInterpreter.parse(commands, (result, options) => {
    if (mathParser.validInput(result)) {
      result = mathParser.parse(result);
    } else if (/^\w+$/.test(result)) {
      // TODO: Methoden oder variablen aufruf
      console.warn(`can\\'t use variable or method "${result}"`);
    }

    if (options.message) {
      output.push(cleanString(options.message));
    }

    return result;
  });
  return output;
};

describe('BasicInterpreter', () => {
  it('Print', async () => {
    const lines = [
      'PRINT "Hello World"',
      'PRINT LEN("ABC")',
      'PRINT USING "Hello #"; "World"',
      'PRINT USING "# #"; "hello", "world"'
    ];
    const results = ['Hello World', '3', 'Hello World', 'hello world'];
    const output = await executeCommands(lines);
    compareOutput(output, results);
  });

  it('Function', async () => {
    const lines = [
      '// Functions',

      'SUB Separator(stars) STATIC',
      'PRINT STRING$(stars, "*")',
      'END SUB',

      'SUB Headline(title$) STATIC',
      'LET title$ = "*** " + title + " ***"',
      'PRINT ""',
      'Separator(LEN(title$))',
      'PRINT title$',
      'Separator(LEN(title$))',
      'PRINT ""',
      'END SUB',

      '// Output',
      'Headline("Mount Disks…")',
      'END'
    ];
    const results = [
      '',
      '********************',
      '*** Mount Disks… ***',
      '********************',
      ''
    ];
    const output = await executeCommands(lines);
    compareOutput(output, results);
  });

  it('Variables', async () => {
    const lines = ['DIM number%', 'LET number%=2000', 'PRINT number%', 'END'];
    const results = ['2000'];
    const output = await executeCommands(lines);
    compareOutput(output, results);
  });

  it('For & While', async () => {
    const lines = [
      'DIM number%',
      'FOR i=5 TO 10',
      'PRINT i',
      'NEXT i',
      '',
      'LET number% = 0',
      'WHILE number%<=10',
      'PRINT number%',
      'LET number% = number% + 1',
      'WEND',
      'END'
    ];
    const results = [
      '5',
      '6',
      '7',
      '8',
      '9',
      '10',
      '0',
      '1',
      '2',
      '3',
      '4',
      '5',
      '6',
      '7',
      '8',
      '9',
      '10'
    ];
    const output = await executeCommands(lines);
    compareOutput(output, results);
  });

  it('Built-in FunctionTest', async () => {
    const lines = [
      'PRINT USING "LEN(\\"ABC\\") #"; LEN("ABC")',
      'PRINT USING "ASC(\\"D\\") ##"; ASC("D")',
      'PRINT USING "CHR$(68) ##"; CHR$(68)',
      'PRINT USING "LEFT$(\\"XYZ\\", LEN(\\"XYZ\\")-1) #"; LEFT$("XYZ", LEN("XYZ")-1)',
      'PRINT USING "RIGHT$(\\"XYZ\\", LEN(\\"XYZ\\")-1) #"; RIGHT$("XYZ", LEN("XYZ")-1)'
    ];

    const results = [
      'LEN("ABC") 3',
      'ASC("D") 68',
      'CHR$(68) D',
      'LEFT$("XYZ", LEN("XYZ")-1) XY',
      'RIGHT$("XYZ", LEN("XYZ")-1) YZ'
    ];

    const output = await executeCommands(lines);
    compareOutput(output, results);
  });

  it('Built-in Fibonacci', async () => {
    const lines = [
      'CLS',
      'READ max',
      'DIM fib%(max)',
      'LET fib(1) = 1',
      'LET fib(2) = 2',
      'FOR i=3 TO max',
      'LET fib(i) = fib(i - 2) + fib(i -1)',
      'NEXT i',
      'FOR i=1 TO max',
      'PRINT fib(i)',
      'NEXT i',
      'DATA 10',
      'END'
    ];

    const results = ['1', '2', '3', '5', '8', '13', '21', '34', '55', '89'];

    const output = await executeCommands(lines);
    compareOutput(output, results);
  });

  it('Built-in Area', async () => {
    const lines = [
      'CLS',
      'DIM w%,h%,a%',
      'LET w%=12',
      'LET h%=4',
      'LET a%=w%*h%',
      'PRINT "With the width " + w%',
      'PRINT " and the height " + h%',
      'PRINT " you have the area " + a%'
    ];

    const results = [
      'With the width 12',
      ' and the height 4',
      ' you have the area 48'
    ];

    const output = await executeCommands(lines);
    compareOutput(output, results);
  });

  it('Built-in Circle', async () => {
    const lines = [
      'CLS',
      'DIM r,a',
      'LET r=5',
      'READ pi',
      'LET a=r*r*pi',
      'PRINT USING "With the radius ##.##"; r',
      'PRINT USING "we have the area ##.##"; a',
      'DATA 3.14',
      'END'
    ];

    const results = ['With the radius  5', 'we have the area 78.50'];

    const output = await executeCommands(lines);
    compareOutput(output, results);
  });

  it('Built-in Bubble_Sort', async () => {
    const lines = [
      'CLS',
      'READ max',
      'DIM SHARED numbers(max)',
      'SUB CreateList(max) STATIC',
      'FOR i=1 TO max',
      'LET numbers(i) = INT(RND * 100)',
      'NEXT i',
      'END SUB',
      'SUB PrintList(max) STATIC',
      'FOR i=1 TO max',
      'PRINT numbers(i)',
      'NEXT i',
      'END SUB',
      'SUB SwapValues(i%, j%) STATIC',
      'LET numbers(i%) = numbers(i%) XOR numbers(j%)',
      'LET numbers(j%) = numbers(i%) XOR numbers(j%)',
      'LET numbers(i%) = numbers(i%) XOR numbers(j%)',
      'END SUB',
      'SUB Sort(max) STATIC',
      'FOR i%=1 TO (max - 1)',
      'FOR j%=i% TO max',
      'IF numbers(i%)>numbers(j%) THEN',
      'CALL SwapValues(i, j)',
      'END IF',
      'NEXT j%',
      'NEXT i%',
      'END SUB',
      'CreateList(max)',
      'Sort(max)',
      'PrintList(max)',
      'DATA 10',
      'END'
    ];

    const output = await executeCommands(lines);

    const results = [...output].sort((a, b) => a - b);

    compareOutput(output, results);
  });

  it('Built-in Goto', async () => {
    const lines = [
      'PRINT "Step 1"',
      'PRINT "Step 2"',
      'PRINT "Step 3"',
      'GOTO ignore',
      'PRINT "Step 4"',
      'ignore:',
      'PRINT "Step 5"'
    ];

    const results = ['Step 1', 'Step 2', 'Step 3', 'Step 5'];

    const output = await executeCommands(lines);
    compareOutput(output, results);
  });

  it('Built-in Goto', async () => {
    const lines = [
      'DIM A, B',
      'LET A = 2000',
      'LET B = "Hello World"',
      'PRINT USING "A: #"; A',
      'PRINT USING "B: #"; B'
    ];

    const results = ['A: 2000', 'B: Hello World'];

    const output = await executeCommands(lines);
    compareOutput(output, results);
  });

  it('Built-in If', async () => {
    const lines = [
      'DIM A, B',
      'LET A = 1',
      'LET B = 2',
      'IF A == B THEN',
      'PRINT "true"',
      'ELSE',
      'PRINT "false"',
      'END',
      'IF (A < B) THEN',
      'PRINT "true"',
      'END'
    ];

    const results = ['false', 'true'];

    const output = await executeCommands(lines);
    compareOutput(output, results);
  });

  it('Built-in For', async () => {
    const lines = [
      'DIM i%',
      'FOR i% = 1 TO 5',
      'PRINT USING "For Number #"; i%',
      'NEXT i%'
    ];

    const results = [
      'For Number 1',
      'For Number 2',
      'For Number 3',
      'For Number 4',
      'For Number 5'
    ];

    const output = await executeCommands(lines);
    compareOutput(output, results);
  });

  it('Built-in For_Step', async () => {
    const lines = [
      'CLS',
      'FOR i% = 0 TO 6 STEP 2',
      'PRINT "For Step Number #"; i%',
      'NEXT i%'
    ];

    const results = [
      'For Step Number #0',
      'For Step Number #2',
      'For Step Number #4',
      'For Step Number #6'
    ];

    const output = await executeCommands(lines);
    compareOutput(output, results);
  });

  it('Built-in While', async () => {
    const lines = [
      'DIM i%',
      'LET i%=0',
      'WHILE i% < 5',
      'PRINT USING "While Number #"; i%',
      'LET i% = i% + 1',
      'WEND'
    ];

    const results = [
      'While Number 0',
      'While Number 1',
      'While Number 2',
      'While Number 3',
      'While Number 4'
    ];

    const output = await executeCommands(lines);
    compareOutput(output, results);
  });
});

function compareOutput(output, results) {
  expect(output.length).toBe(results.length);
  results.forEach((result, i) => {
    expect(output[Number(i)]).toBe(result);
  });
}
