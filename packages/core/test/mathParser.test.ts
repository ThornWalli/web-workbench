import { describe, it, expect, beforeAll } from 'vitest';

import Memory from '../classes/Memory';
import MathParser from '../classes/MathParser';

const memory = new Memory();

let mathParser: MathParser;
beforeAll(() => {
  mathParser = new MathParser(memory);
});

describe('MathParser', () => {
  it('Functions', async () => {
    // RND
    expect(typeof (await mathParser.parse('RND'))).toBe('number');
    // PI
    expect(await mathParser.parse('PI')).toBe(Math.PI);
    // POW
    expect(await mathParser.parse('POW(2,2)')).toBe(4);
    // SQRT
    expect(await mathParser.parse('SQRT(4, 2)')).toBe(2);
    // INT
    expect(await mathParser.parse('INT("2")')).toBe(2);
    // SPC
    expect(await mathParser.parse('SPC(5)')).toBe('"     "');
    // LEN
    expect(await mathParser.parse('LEN("xyz")')).toBe(3);
    // ASC
    expect(await mathParser.parse('ASC("a")')).toBe(97);
    // CHR
    expect(await mathParser.parse('CHR$(97)')).toBe('"a"');
    // LEFT
    expect(await mathParser.parse('LEFT$("abcdef",3)')).toBe('"abc"');
    // RIGHT
    expect(await mathParser.parse('RIGHT$("abcdef",3)')).toBe('"def"');
    // STRING
    expect(await mathParser.parse('STRING$(5, "*")')).toBe('"*****"');
    // TIME
    expect(typeof (await mathParser.parse('TIME%'))).toBe('number');
    // HEX
    expect(await mathParser.parse('HEX_ENC$(255)')).toBe('"ff"');
    expect(await mathParser.parse('HEX_DEC$("ff")')).toBe(255);
  });

  it('Values & Operations', async () => {
    expect(await mathParser.parse('Test\n2000')).toBe('Test\n2000');
    expect(await mathParser.parse('true')).toBe(true);
    expect(await mathParser.parse('(-3+-6)+1')).toBe(-8);
    expect(await mathParser.parse('"Test" + " " + "2000"')).toBe('"Test 2000"');
    expect(await mathParser.parse('-2 -2 * 2')).toBe(-6);
    expect(await mathParser.parse('INT(PI)')).toBe(3);
    expect(await mathParser.parse('true')).toBe(true);
    expect(await mathParser.parse('TestString')).toBe('TestString');
    expect(await mathParser.parse('0')).toBe(0);
    expect(await mathParser.parse('1')).toBe(1);
    expect(await mathParser.parse('2+2')).toBe(4);
    expect(await mathParser.parse('2+(1+1)')).toBe(4);
    expect(await mathParser.parse('2+(1+1)*2')).toBe(6);
    expect(await mathParser.parse('(2+(1+1))*2')).toBe(8);
    expect(await mathParser.parse('2+POW(2,2)')).toBe(6);
    expect(await mathParser.parse('POW(2,2)+2')).toBe(6);
    expect(await mathParser.parse('LEN("abcdef")/2')).toBe(3);
  });
});
