
import { describe, it, expect } from 'vitest';

import StringParameterParser from '@web-workbench/core/classes/StringParameterParser';

describe('StringParameterParser', () => {
  it('Samples', () => {
    const executions = [
      [
        '-testA=2001 --testB=2002  \'Lammpee\'', [
          '-testA=2001', '--testB=2002', "'Lammpee'"
        ]
      ],
      [
        '1+2+3+5+$$$0', [
          '1+2+3+5+', '$$$0'
        ]
      ],
      [
        '"RAM:Test" "Test" -ignore-exist', [
          '"RAM:Test"', '"Test"', '-ignore-exist'
        ]
      ],
      [
        'remove "dir1"', [
          'remove ', '"dir1"'
        ]
      ],
      [
        'rename --path="file1.info" --value="Test 2"" -name', [
          'rename ', '--path="file1.info"', '--value="Test 2"', '" -name'
        ]
      ],
      [
        'print "\nStart testing…\n"', [
          'print ', '"\nStart testing…\n"'
        ]
      ],
      [
        'print "Test" "Test2" -n', [
          'print ', '"Test"', '"Test2"', '-n'
        ]
      ]

    ];

    executions.forEach(([
      value, result
    ]) => StringParameterParser.parse(value).forEach((v, i) => expect(result[Number(i)]).toBe(v)));
  });
});
