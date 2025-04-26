import { describe, it, expect } from 'vitest';

import { parse } from '../../services/commandParser';

describe('commandParser', () => {
  it('Samples', () => {
    const executions = [
      {
        test: {
          command:
            'openDirectory "Press:" --window-size="100,120" --window-scale=false --window-scroll-x=false --window-scroll-y=false --window-sidebar=false',
          result: {
            program: 'openDirectory',
            args: [
              {
                value: {
                  type: 'string',
                  value: 'Press:',
                  raw: '"Press:"'
                },
                plain: true
              },
              {
                name: 'window-size',
                value: {
                  type: 'string',
                  value: '100,120',
                  raw: '"100,120"'
                },
                long: true
              },
              {
                name: 'window-scale',
                value: {
                  type: 'boolean',
                  value: false,
                  raw: 'false'
                },
                long: true
              },
              {
                name: 'window-scroll-x',
                value: {
                  type: 'boolean',
                  value: false,
                  raw: 'false'
                },
                long: true
              },
              {
                name: 'window-scroll-y',
                value: {
                  type: 'boolean',
                  value: false,
                  raw: 'false'
                },
                long: true
              },
              {
                name: 'window-sidebar',
                value: {
                  type: 'boolean',
                  value: false,
                  raw: 'false'
                },
                long: true
              }
            ],
            rawArgs: [
              'openDirectory',
              '"Press:"',
              '--window-size="100,120"',
              '--window-scale=false',
              '--window-scroll-x=false',
              '--window-scroll-y=false',
              '--window-sidebar=false'
            ]
          }
        }
      },

      {
        test: {
          command: '-3+-6',
          result: {
            args: [
              {
                value: {
                  type: 'integer',
                  value: -3,
                  raw: '-3'
                },
                plain: true
              },
              {
                value: {
                  type: 'term',
                  value: '+',
                  raw: '+'
                },
                plain: true
              },
              {
                value: {
                  type: 'integer',
                  value: -6,
                  raw: '-6'
                },
                plain: true
              }
            ],
            rawArgs: ['-3', '+', '-6']
          }
        }
      },
      {
        test: {
          command:
            'PRINT "Scroll (Up/Down): <strong>Shift+Up</strong> / <strong>Shift+Down</strong>"',
          result: {
            program: 'PRINT',
            args: [
              {
                value: {
                  type: 'string',
                  value:
                    'Scroll (Up/Down): <strong>Shift+Up</strong> / <strong>Shift+Down</strong>',
                  raw: '"Scroll (Up/Down): <strong>Shift+Up</strong> / <strong>Shift+Down</strong>"'
                },
                plain: true
              }
            ],
            rawArgs: [
              'PRINT',
              '"Scroll (Up/Down): <strong>Shift+Up</strong> / <strong>Shift+Down</strong>"'
            ]
          }
        }
      },
      {
        test: {
          command: '""',
          result: {
            args: [
              {
                value: {
                  type: 'string',
                  raw: '""'
                },
                plain: true
              }
            ],
            rawArgs: ['""']
          }
        }
      },
      {
        separator: ' ',
        test: {
          command: '1+1',
          result: {
            args: [
              {
                value: {
                  type: 'integer',
                  value: 1,
                  raw: '1'
                },
                plain: true
              },
              {
                value: {
                  type: 'term',
                  value: '+',
                  raw: '+'
                },
                plain: true
              },
              {
                value: {
                  type: 'integer',
                  value: 1,
                  raw: '1'
                },
                plain: true
              }
            ],
            rawArgs: ['1', '+', '1']
          }
        }
      },
      {
        separator: ' ',
        test: {
          command: '1  +  1',
          result: {
            args: [
              {
                value: {
                  type: 'integer',
                  value: 1,
                  raw: '1'
                },
                plain: true
              },
              {
                value: {
                  type: 'term',
                  value: '+',
                  raw: '+'
                },
                plain: true
              },
              {
                value: {
                  type: 'integer',
                  value: 1,
                  raw: '1'
                },
                plain: true
              }
            ],
            rawArgs: ['1', '+', '1']
          }
        }
      },
      {
        separator: ' ',
        test: {
          command: 'a  +  b',
          result: {
            args: [
              {
                value: {
                  type: 'any',
                  value: 'a',
                  raw: 'a'
                },
                plain: true
              },
              {
                value: {
                  type: 'term',
                  value: '+',
                  raw: '+'
                },
                plain: true
              },
              {
                value: {
                  type: 'any',
                  value: 'b',
                  raw: 'b'
                },
                plain: true
              }
            ],
            rawArgs: ['a', '+', 'b']
          }
        }
      },
      {
        separator: ' ',
        mergeArgs: true,
        test: {
          command: 'a  +  b',
          result: {
            args: [
              {
                value: {
                  type: 'any',
                  value: 'a+b',
                  raw: 'a+b'
                },
                plain: true
              }
            ],
            rawArgs: ['a+b']
          }
        }
      },
      {
        separator: ' ',
        test: {
          command: '"a"+"b"',
          result: {
            args: [
              {
                value: {
                  type: 'string',
                  value: 'a',
                  raw: '"a"'
                },
                plain: true
              },
              {
                value: {
                  type: 'term',
                  value: '+',
                  raw: '+'
                },
                plain: true
              },
              {
                value: {
                  type: 'string',
                  value: 'b',
                  raw: '"b"'
                },
                plain: true
              }
            ],
            rawArgs: ['"a"', '+', '"b"']
          }
        }
      },
      {
        separator: ' ',
        test: {
          command: '"A" "B" "C" + "D"',
          result: {
            args: [
              {
                value: {
                  type: 'string',
                  value: 'A',
                  raw: '"A"'
                },
                plain: true
              },
              {
                value: {
                  type: 'string',
                  value: 'B',
                  raw: '"B"'
                },
                plain: true
              },
              {
                value: {
                  type: 'string',
                  value: 'C',
                  raw: '"C"'
                },
                plain: true
              },
              {
                value: {
                  type: 'term',
                  value: '+',
                  raw: '+'
                },
                plain: true
              },
              {
                value: {
                  type: 'string',
                  value: 'D',
                  raw: '"D"'
                },
                plain: true
              }
            ],
            rawArgs: ['"A"', '"B"', '"C"', '+', '"D"']
          }
        }
      },
      {
        test: {
          command: 'test 1 2 3',
          result: {
            program: 'test',
            args: [
              {
                value: { type: 'integer', value: 1, raw: '1' },
                plain: true
              },
              {
                value: { type: 'integer', value: 2, raw: '2' },
                plain: true
              },
              {
                value: { type: 'integer', value: 3, raw: '3' },
                plain: true
              }
            ],
            rawArgs: ['test', '1', '2', '3']
          }
        }
      },
      {
        test: {
          command: '1+1+(1+(1*2))+3',
          result: {
            program: undefined,
            args: [
              {
                value: { type: 'integer', value: 1, raw: '1' },
                plain: true
              },
              {
                value: { type: 'term', value: '+', raw: '+' },
                plain: true
              },
              {
                value: { type: 'integer', value: 1, raw: '1' },
                plain: true
              },
              {
                value: { type: 'term', value: '+', raw: '+' },
                plain: true
              },
              {
                value: {
                  type: 'any',
                  value: '(1+(1*2))',
                  raw: '(1+(1*2))'
                },
                plain: true
              },
              {
                value: { type: 'term', value: '+', raw: '+' },
                plain: true
              },
              {
                value: { type: 'integer', value: 3, raw: '3' },
                plain: true
              }
            ],
            rawArgs: ['1', '+', '1', '+', '(1+(1*2))', '+', '3']
          }
        }
      },
      {
        test: {
          command: '0',
          result: {
            program: undefined,
            args: [
              {
                value: { type: 'integer', value: 0, raw: '0' },
                plain: true
              }
            ],
            rawArgs: ['0']
          }
        }
      },
      {
        forceProgram: true,
        test: {
          command: 'POW(2,2)',
          result: {
            program: 'POW(2,2)',
            args: [],
            rawArgs: ['POW(2,2)']
          }
        }
      },
      {
        forceProgram: true,
        test: {
          command: 'STRING$(stars, "*")',
          result: {
            program: 'STRING$(stars, "*")',
            args: [],
            rawArgs: ['STRING$(stars, "*")']
          }
        }
      },
      {
        test: {
          command: '$$$1+title+$$$0',
          result: {
            program: undefined,
            args: [
              {
                value: { type: 'term', value: '$$$1', raw: '$$$1' },
                plain: true
              },
              {
                value: { type: 'term', value: '+', raw: '+' },
                plain: true
              },
              {
                value: { type: 'any', value: 'title', raw: 'title' },
                plain: true
              },
              {
                value: { type: 'term', value: '+', raw: '+' },
                plain: true
              },
              {
                value: { type: 'term', value: '$$$0', raw: '$$$0' },
                plain: true
              }
            ],
            rawArgs: ['$$$1', '+', 'title', '+', '$$$0']
          }
        }
      },
      {
        test: {
          command: '$$$1 + title + $$$0',
          result: {
            program: undefined,
            args: [
              {
                value: { type: 'term', value: '$$$1', raw: '$$$1' },
                plain: true
              },
              {
                value: { type: 'term', value: '+', raw: '+' },
                plain: true
              },
              {
                value: { type: 'any', value: 'title', raw: 'title' },
                plain: true
              },
              {
                value: { type: 'term', value: '+', raw: '+' },
                plain: true
              },
              {
                value: { type: 'term', value: '$$$0', raw: '$$$0' },
                plain: true
              }
            ],
            rawArgs: ['$$$1', '+', 'title', '+', '$$$0']
          }
        }
      },
      {
        test: {
          command: '$$$$$$0$ $$$$$$1$ $$$$$$2$+ $$$0',
          result: {
            program: undefined,
            args: [
              {
                value: { type: 'term', value: '$$$$$$0$', raw: '$$$$$$0$' },
                plain: true
              },
              {
                value: { type: 'term', value: '$$$$$$1$', raw: '$$$$$$1$' },
                plain: true
              },
              {
                value: { type: 'term', value: '$$$$$$2$', raw: '$$$$$$2$' },
                plain: true
              },
              {
                value: { type: 'term', value: '+', raw: '+' },
                plain: true
              },
              {
                value: { type: 'term', value: '$$$0', raw: '$$$0' },
                plain: true
              }
            ],
            rawArgs: ['$$$$$$0$', '$$$$$$1$', '$$$$$$2$', '+', '$$$0']
          }
        }
      },
      {
        test: {
          command: 'test "Test Test" true',
          result: {
            program: 'test',
            args: [
              {
                value: {
                  type: 'string',
                  value: 'Test Test',
                  raw: '"Test Test"'
                },
                plain: true
              },
              {
                value: { type: 'boolean', value: true, raw: 'true' },
                plain: true
              }
            ],
            rawArgs: ['test', '"Test Test"', 'true']
          }
        }
      },
      {
        test: {
          command: 'test "test("test")" -boolean=true',
          result: {
            program: 'test',
            args: [
              {
                value: {
                  type: 'string',
                  value: 'test("test")',
                  raw: '"test("test")"'
                },
                plain: true
              },
              {
                name: 'boolean',
                value: { type: 'boolean', value: true, raw: 'true' }
              }
            ],
            rawArgs: ['test', '"test("test")"', '-boolean=true']
          }
        }
      },
      {
        test: {
          command: '5+PI',
          result: {
            program: undefined,
            args: [
              {
                value: {
                  type: 'integer',
                  value: 5,
                  raw: '5'
                },
                plain: true
              },
              {
                value: {
                  type: 'term',
                  value: '+',
                  raw: '+'
                },
                plain: true
              },
              {
                value: {
                  type: 'any',
                  value: 'PI',
                  raw: 'PI'
                },
                plain: true
              }
            ],
            rawArgs: ['5', '+', 'PI']
          }
        }
      },
      {
        test: {
          command: 'true',
          result: {
            program: undefined,
            args: [
              {
                value: {
                  type: 'boolean',
                  value: true,
                  raw: 'true'
                },
                plain: true
              }
            ],
            rawArgs: ['true']
          }
        }
      },
      {
        test: {
          command: "-testA=2001 --testB=2002  'Lammpee'",
          result: {
            program: undefined,
            args: [
              {
                name: 'testA',
                value: { type: 'integer', value: 2001, raw: '2001' }
              },
              {
                name: 'testB',
                value: { type: 'integer', value: 2002, raw: '2002' },
                long: true
              },
              {
                value: { type: 'string', value: 'Lammpee', raw: "'Lammpee'" },
                plain: true
              }
            ],
            rawArgs: ['-testA=2001', '--testB=2002', "'Lammpee'"]
          }
        }
      },
      {
        test: {
          command: '1+2+3+5+$$$0',
          result: {
            program: undefined,
            args: [
              {
                value: {
                  type: 'integer',
                  value: 1,
                  raw: '1'
                },
                plain: true
              },
              {
                value: {
                  type: 'term',
                  value: '+',
                  raw: '+'
                },
                plain: true
              },
              {
                value: {
                  type: 'integer',
                  value: 2,
                  raw: '2'
                },
                plain: true
              },
              {
                value: {
                  type: 'term',
                  value: '+',
                  raw: '+'
                },
                plain: true
              },
              {
                value: {
                  type: 'integer',
                  value: 3,
                  raw: '3'
                },
                plain: true
              },
              {
                value: {
                  type: 'term',
                  value: '+',
                  raw: '+'
                },
                plain: true
              },
              {
                value: {
                  type: 'integer',
                  value: 5,
                  raw: '5'
                },
                plain: true
              },
              {
                value: {
                  type: 'term',
                  value: '+',
                  raw: '+'
                },
                plain: true
              },
              {
                value: {
                  type: 'term',
                  value: '$$$0',
                  raw: '$$$0'
                },
                plain: true
              }
            ],
            rawArgs: ['1', '+', '2', '+', '3', '+', '5', '+', '$$$0']
          }
        }
      },
      {
        test: {
          command: '"RAM:Test" "Test" -ignore-exist',
          result: {
            program: undefined,
            args: [
              {
                value: { type: 'string', value: 'RAM:Test', raw: '"RAM:Test"' },
                plain: true
              },
              {
                value: { type: 'string', value: 'Test', raw: '"Test"' },
                plain: true
              },
              { name: 'ignore-exist' }
            ],
            rawArgs: ['"RAM:Test"', '"Test"', '-ignore-exist']
          }
        }
      },
      {
        test: {
          command: 'remove "dir1"',
          result: {
            program: 'remove',
            args: [
              {
                value: { type: 'string', value: 'dir1', raw: '"dir1"' },
                plain: true
              }
            ],
            rawArgs: ['remove', '"dir1"']
          }
        }
      },
      {
        test: {
          command: 'rename --path="file1.info" --value="Test 2" -name',
          result: {
            program: 'rename',
            args: [
              {
                name: 'path',
                value: {
                  type: 'string',
                  value: 'file1.info',
                  raw: '"file1.info"'
                },
                long: true
              },
              {
                name: 'value',
                value: { type: 'string', value: 'Test 2', raw: '"Test 2"' },
                long: true
              },
              { name: 'name' }
            ],
            rawArgs: [
              'rename',
              '--path="file1.info"',
              '--value="Test 2"',
              '-name'
            ]
          }
        }
      },
      {
        test: {
          command: 'print "Test" "Test2" -n',
          result: {
            program: 'print',
            args: [
              {
                value: { type: 'string', value: 'Test', raw: '"Test"' },
                plain: true
              },
              {
                value: { type: 'string', value: 'Test2', raw: '"Test2"' },
                plain: true
              },
              { name: 'n' }
            ],
            rawArgs: ['print', '"Test"', '"Test2"', '-n']
          }
        }
      },
      {
        test: {
          command: 'print "test \\"test\\" test"',
          result: {
            program: 'print',
            args: [
              {
                value: {
                  type: 'string',
                  value: 'test "test" test',
                  raw: '"test "test" test"'
                },
                plain: true
              }
            ],
            rawArgs: ['print', '"test "test" test"']
          }
        }
      },
      {
        test: {
          command:
            'cloudMount "CDLAMMPEE" --api-key="xxx-xxx-xxx-xxx" --url="https://<app-name>.firebasedatabase.app"',
          result: {
            program: 'cloudMount',
            args: [
              {
                value: {
                  type: 'string',
                  value: 'CDLAMMPEE',
                  raw: '"CDLAMMPEE"'
                },
                plain: true
              },
              {
                name: 'api-key',
                value: {
                  type: 'string',
                  value: 'xxx-xxx-xxx-xxx',
                  raw: '"xxx-xxx-xxx-xxx"'
                },
                long: true
              },
              {
                name: 'url',
                value: {
                  type: 'string',
                  value: 'https://<app-name>.firebasedatabase.app',
                  raw: '"https://<app-name>.firebasedatabase.app"'
                },
                long: true
              }
            ],
            rawArgs: [
              'cloudMount',
              '"CDLAMMPEE"',
              '--api-key="xxx-xxx-xxx-xxx"',
              '--url="https://<app-name>.firebasedatabase.app"'
            ]
          }
        }
      }
    ];
    executions.forEach(({ test, separator, mergeArgs, forceProgram }) => {
      expect(
        JSON.stringify(
          parse(test.command, {
            separator,
            mergeArgs: mergeArgs || false,
            forceProgram: forceProgram || false
          }),
          null,
          2
        )
      ).toEqual(JSON.stringify(test.result, null, 2));
    });
  });
});
