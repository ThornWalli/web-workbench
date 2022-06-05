
import { describe, it, expect, beforeAll } from 'vitest';

import Memory from '../src/web-workbench/classes/Memory';
import BasicInterpreter from '../src/web-workbench/classes/BasicInterpreter';
import MathParser from '../src/web-workbench/classes/MathParser';
import { cleanString } from '../src/web-workbench/utils/helper';

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
      'PRINT USING "Hello #"; "World")'
    ];
    const results = [
      'Hello World', '3', 'Hello World'
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
      'Headline("Mount Disks…")'
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
});
