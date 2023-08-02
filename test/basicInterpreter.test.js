
import { describe, it, expect, beforeAll } from 'vitest';

import Memory from '@web-workbench/core/classes/Memory';
import BasicInterpreter from '@web-workbench/core/classes/BasicInterpreter';
import MathParser from '@web-workbench/core/classes/MathParser';
import { cleanString } from '@web-workbench/core/utils/helper';

const memory = new Memory();

let basicInterpreter, mathParser;
beforeAll(() => {
  basicInterpreter = new BasicInterpreter(memory);
  mathParser = new MathParser(memory);
});

const executeCommands = async (commands) => {
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
    const results = [
      'Hello World', '3', 'Hello World',
      'hello world'
    ];
    const output = await executeCommands(lines);

    results.forEach((result, i) => {
      expect(output[Number(i)]).toBe(result);
    });
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

    results.forEach((result, i) => {
      expect(output[Number(i)]).toBe(result);
    });
  });

  it('Variables', async () => {
    const lines = [
      'DIM number%',
      'LET number%=2000',
      'PRINT number%',
      'END'
    ];
    const results = [
      '2000'
    ];
    const output = await executeCommands(lines);

    results.forEach((result, i) => {
      expect(output[Number(i)]).toBe(result);
    });
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
      '5', '6', '7', '8', '9', '10',
      '0', '1', '2', '3', '4',
      '5', '6', '7', '8', '9', '10'
    ];
    const output = await executeCommands(lines);
    results.forEach((result, i) => {
      expect(output[Number(i)]).toBe(result);
    });
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

    results.forEach((result, i) => {
      expect(output[Number(i)]).toBe(result);
    });
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

    const results = [
      '1', '2', '3', '5', '8', '13', '21', '34', '55', '89'
    ];

    const output = await executeCommands(lines);

    results.forEach((result, i) => {
      expect(output[Number(i)]).toBe(result);
    });
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
      'With the width 12', ' and the height 4', ' you have the area 48'
    ];

    const output = await executeCommands(lines);

    results.forEach((result, i) => {
      expect(output[Number(i)]).toBe(result);
    });
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

    const results = [
      'With the radius  5', 'we have the area 78.50'
    ];

    const output = await executeCommands(lines);

    results.forEach((result, i) => {
      expect(output[Number(i)]).toBe(result);
    });
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

    const results = [
      ...output
    ].sort((a, b) => a - b);
    console.log(output, results);

    results.forEach((result, i) => {
      expect(output[Number(i)]).toBe(result);
    });
  });
});

