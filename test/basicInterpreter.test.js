
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

  it('Built-in Functions', async () => {
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
});
