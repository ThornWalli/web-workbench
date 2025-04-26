import { describe, it, expect } from 'vitest';
import MathParser from '../classes/MathParser';
import Memory from '../classes/Memory';
import CommandParser from '../classes/CommandParser/default';
import CommandParserLegacy from '../classes/CommandParser/legacy';

describe('commandParser', () => {
  it('Compare Old & New', async () => {
    const commandParser = new CommandParser(new MathParser(new Memory()));
    const commandParserLegacy = new CommandParserLegacy(
      new MathParser(new Memory())
    );

    const commands = [
      'STRING$(stars, "*")',
      'POW(2,2)'
      // 'test -testA="2001" --testB="2002"  "Lammpee" "Lammpee"'
      // 'cloudMount "CDLAMMPEE" --api-key="xxx-xxx-xxx-xxx" --url="https://<app-name>.firebasedatabase.app"'
      // 'test "Test Test" true'
      // '5+5'
      // 'PI+5'
    ];

    // '"foo" +"bar"', '"foobar"';
    // '(-3+-6)+1', -3 + -6 + 1;
    // '(-3-+6)+1', -3 - +6 + 1;
    // '(-3*-6)+1', -3 * -6 + 1;
    // '(-3/-6)+1', -3 / -6 + 1;
    // '(-3+6)+1', -3 + 6 + 1;
    // '(-3-6)+1', -3 - 6 + 1;
    // '(-3*6) + 1', -3 * 6 + 1;
    // '(-3/6)+1', -3 / 6 + 1;
    // 'INT(PI)', 3;
    // '(POW(2,2)+1)', 5;
    // 'ASC("D")', 68;
    // 'CHR$(68)', '"D"';
    // 'LEN("ABC")', 3;
    // '"a" + "b"', '"ab"';
    // 'STRING$(3,0)', '"000"';
    // 'SQRT(2,2)', Math.sqrt(2);
    // '128 >> (256 + 5)', 128 >> (256 + 5);
    // '-2+4+SQRT(2,2)', -2 + 4 + Math.sqrt(2);
    // '-2- 2 * 2', -2 - 2 * 2;
    // '(1+1)', 1 + 1;
    // '2*2', 2 * 2;
    // '1+2+3+(POW(2,2)+1)+5*8-(50/2)', 1 + 2 + 3 + (2 ** 2 + 1) + 5 * 8 - 50 / 2;

    commands.forEach(async command => {
      console.log(
        'Legacy: ',
        JSON.stringify(await commandParserLegacy.parse(command), null, 2)
      );
      console.log(
        'Current: ',
        JSON.stringify(await commandParser.parse(command), null, 2)
      );
      expect(
        JSON.stringify(await commandParserLegacy.parse(command), null, 2)
      ).toBe(JSON.stringify(await commandParser.parse(command), null, 2));
    });

    // const executions = [
    //   {
    //     command: "-testA=2001 --testB=2002  'Lammpee'",
    //     result: {
    //       program: undefined,
    //       arguments: [
    //         { name: 'testA', value: { type: 'integer', raw: '2001' } },
    //         {
    //           name: 'testB',
    //           value: { type: 'integer', raw: '2002' },
    //           long: true
    //         },
    //         { value: { type: 'string', raw: 'Lammpee' } }
    //       ]
    //     }
    //   },
    //   {
    //     command: '1+2+3+5+$$$0',
    //     result: {
    //       program: undefined,
    //       arguments: [{ value: { type: 'any', raw: '1+2+3+5+$$$0' } }]
    //     }
    //   },
    //   {
    //     command: '"RAM:Test" "Test" -ignore-exist',
    //     result: {
    //       program: undefined,
    //       arguments: [
    //         { value: { type: 'string', raw: 'RAM:Test' } },
    //         { value: { type: 'string', raw: 'Test' } },
    //         { name: 'ignore-exist' }
    //       ]
    //     }
    //   },
    //   {
    //     command: 'remove "dir1"',
    //     result: {
    //       program: 'remove',
    //       arguments: [{ value: { type: 'string', raw: 'dir1' } }]
    //     }
    //   },
    //   {
    //     command: 'rename --path="file1.info" --value="Test 2" -name',
    //     result: {
    //       program: 'rename',
    //       arguments: [
    //         {
    //           name: 'path',
    //           value: { type: 'string', raw: 'file1.info' },
    //           long: true
    //         },
    //         {
    //           name: 'value',
    //           value: { type: 'string', raw: 'Test 2' },
    //           long: true
    //         },
    //         { name: 'name' }
    //       ]
    //     }
    //   },
    //   {
    //     command: 'print "Test" "Test2" -n',
    //     result: {
    //       program: 'print',
    //       arguments: [
    //         { value: { type: 'string', raw: 'Test' } },
    //         { value: { type: 'string', raw: 'Test2' } },
    //         { name: 'n' }
    //       ]
    //     }
    //   },
    //   {
    //     command: 'print "test \\"test\\" test"',
    //     result: {
    //       program: 'print',
    //       arguments: [{ value: { type: 'string', raw: 'test "test" test' } }]
    //     }
    //   },
    //   {
    //     command:
    //       'cloudMount "CDLAMMPEE" --api-key="xxx-xxx-xxx-xxx" --url="https://<app-name>.firebasedatabase.app"',
    //     result: {
    //       program: 'cloudMount',
    //       arguments: [
    //         {
    //           value: { type: 'string', raw: 'CDLAMMPEE' }
    //         },
    //         {
    //           name: 'api-key',
    //           value: { type: 'string', raw: 'xxx-xxx-xxx-xxx' },
    //           long: true
    //         },
    //         {
    //           name: 'url',
    //           value: {
    //             type: 'string',
    //             raw: 'https://<app-name>.firebasedatabase.app'
    //           },
    //           long: true
    //         }
    //       ]
    //     }
    //   }
    // ];
    // executions.forEach(execution => {
    //   expect(JSON.stringify(parse(execution.command), null, 2)).toEqual(
    //     JSON.stringify(execution.result, null, 2)
    //   );
    // });
  });
});
