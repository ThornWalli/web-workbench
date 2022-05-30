import columnify from 'columnify';
import CommandTester from '../CommandTester';
import { ArgumentInfo } from '../Command';
import commandBucket from '../../services/commandBucket';
import { Table as ConsoleTable } from '../../utils/console';
import { cleanString, isNumeric } from '../../utils/helper';
import { CONFIG_NAMES as CORE_CONFIG_NAMES } from './utils';
import { getExt } from '@/web-workbench/utils/fileSystem';
import errorMessage from '@/web-workbench/services/errorMessage';
import WbModuleCoreColorSettings from '@/components/modules/core/ColorSettings';
import WbModuleCoreSettings from '@/components/modules/core/Settings';

export default ({ core }) => [

  {
    name: [
      'execute'
    ],
    description: 'Execute file.',
    args: [
      new ArgumentInfo({
        index: 0,
        name: 'path',
        description: 'Path to the file'
      })
    ],
    async action ({ path }) {
      const mapping = new Map(core.config.get(CORE_CONFIG_NAMES.FILE_EXTENSION_ASSIGNMENT));
      if (!path) {
        throw errorMessage.get('bad_args');
      }
      let fsItem;
      if (mapping.has(getExt(path))) {
        fsItem = await core.modules.files.fs.get(mapping.get(getExt(path)));
      } else {
        fsItem = await core.modules.files.fs.get(path);
        path = null;
      }
      if (typeof fsItem.action === 'function') {
        return fsItem.action(core, path);
      } else if ('type' in fsItem.data) {
        const command = [
          `openPreview "${fsItem.getPath()}"`
        ];

        if (fsItem.data.openMaximized) {
          command.push('-maximized');
        }

        return core.executeCommand(command.join(' '));
      }
    }
  },

  {
    name: [
      'openColorSettings'
    ],
    action () {
      core.modules.windows.addWindow({
        title: 'Color Settings',
        component: WbModuleCoreColorSettings,
        componentData: {},
        options: {
          scale: false,
          prompt: false,
          scrollX: false,
          scrollY: false
        }
      });
    }
  },
  {
    name: [
      'openSettings'
    ],
    action () {
      core.modules.windows.addWindow({
        title: 'Settings',
        component: WbModuleCoreSettings,
        componentData: {},
        options: {
          scale: false,
          prompt: false,
          scrollX: false,
          scrollY: false
        }
      });
    }
  },
  {
    name: [
      'echo', 'print'
    ],
    args: [
      new ArgumentInfo({
        name: [
          'newline', 'n'
        ],
        flag: true
      })
    ],
    async action ({ newline }, options) {
      const valueParse = value => cleanString(value).replace(/\\"/g, '"').replace(/\\n/g, '\n');
      if (newline) {
        options.message(options.commandArgs.map(arg => valueParse(arg)));
      } else {
        let value = await options.core.executeCommand(options.commandValue);
        if (typeof value === 'object') {
          value = JSON.stringify(value);
        }
        options.message(`${cleanString(valueParse(value))}`);
      }
    }
  },
  {
    name: 'commands',
    action (params, options) {
      const table = new ConsoleTable({
        headerPadding: 1
      });
      table.addColumn([
        {
          value: 'Command(s)',
          align: 'left',
          maxWidth: 20
        }, {
          value: 'Description/Arguments',
          align: 'left',
          maxWidth: 60
        }
      ]);
      table.addRow(
        commandBucket.items.reduce((result, command) => {
          const args = command.args || [];
          const lines = [];
          if (command.description) {
            lines.push(command.description);
            lines.push('');
          }
          if (args.length) {
            lines.push('Arguments:');
            lines.push('');
          }

          const { flagNames, kwargNames } = args.reduce((result, argument) => {
            const name = argument.name.join(', ');
            if (argument.flag) {
              result.flagNames.push({ name: `-${name}`, description: argument.description });
            } else {
              result.kwargNames.push({
                name: `--${name}`, description: argument.description
              });
            }
            return result;
          }, {
            flagNames: [],
            kwargNames: []
          });
          const columnOptions = {
            paddingChr: '\xC2',
            showHeaders: false,
            config: {
              name: {
                minWidth: 15
              },
              description: {
                minWidth: 10,
                maxWidth: 30
              }
            }
          };
          lines.push(columnify(flagNames, Object.assign({}, columnOptions)));
          if (flagNames.length > 0 && kwargNames.length > 0) {
            lines.push('');
          }
          lines.push(columnify(kwargNames, Object.assign({}, columnOptions)));

          result.push([
            command.name.join(', '), lines.join('\n')
          ]);
          return result;
        }, [])
      );
      options.message([
        'Commands:', table
      ]);
      return Promise.resolve();
    }
  },

  {
    name: [
      'CLS', 'CLEAR'
    ],
    action () {
      core.consoleInterface.clear();
    }
  },

  {
    name: [
      'prompt', 'input', 'PROMPT', 'INPUT'
    ],
    args: [
      new ArgumentInfo({
        index: 0,
        name: 'text',
        description: 'Text from prompt.'
      }),
      new ArgumentInfo({
        index: 1,
        name: 'variable',
        description: 'Variable'
      })
    ],
    action: ({ text, variable, unresolved }, options) => {
      if (unresolved.text && !unresolved.variable) {
        variable = unresolved.text;
        text = null;
      } else {
        variable = unresolved.variable;
      }

      return core.consoleInterface.prompt(text).then((value) => {
        if (isNumeric(value)) {
          value = Number(value);
        }
        if (variable) {
          core.modules.parser.memory.set(variable, value);
        }
        return value;
      });
    }
  },
  {
    name: [
      'confirm', 'CONFIRM'
    ],
    args: [
      new ArgumentInfo({
        index: 0,
        name: 'text',
        description: 'Text from confirm.'
      })
    ],
    action ({ text }) {
      return core.consoleInterface.confirm(text);
    }
  },
  // ######################################################
  // ######################################################
  // {
  //   name: [
  //     'info'
  //   ],
  //   action () {
  //     return [
  //       `${Core.NAME} - ${Core.VERSION}`, 'Created by Thorn-Welf Walli - lammpee.de'
  //     ].join('\n');
  //   }
  // },
  {
    name: [
      'selfCheck'
    ],
    async action (params, options) {
      const table = new ConsoleTable();
      table.addColumn([
        {
          value: 'Count',
          align: 'left',
          minWidth: 8
        }, {
          value: 'Description',
          align: 'left',
          minWidth: 15
        }
      ]);

      table.addRow(await commandTests(core));

      options.message([
        'Command Tests:', table
      ]);
      // return commandTests(core);
    }
  }
];

function commandTests (core) {
  const commandTester = new CommandTester(core);

  // console.log(core);

  // core.executeCommand('1+2+3+5+5*8-25');
  // core.executeCommand('testCommandA  2000 -testA=2001 --testB=2002  \'Lammpee\' -testA=\'Thorn\' --testB=\'"2000"\' "Lammpee" -testA="Thorn" --testB="\\"2000\\""');

  // core.executeCommand('testCommandA --foo-bar --foo-bar=454654');
  // core.executeCommand('testCommandA --foo-bar-3 --foo-bar-4=false --foo-bar-1="2000" --foo-bar-2="2001"');
  // core.executeCommand('testCommandA test2000');
  // core.executeCommand('testCommandB "test2000"');
  // core.executeCommand('testCommandC "\\"A\\"" "\\"B\\"" "C"');
  // core.executeCommand('testCommandD -test=123456 -test="\\"test200333\\"" ');
  // core.executeCommand('testCommandE --test=123456 --test="\\"test20022\\"" ');

  // core.executeCommand('2*2', { show: true });
  // core.executeCommand('RND() + 1', { show: true });

  // INT(RND() * 500) + 1
  // core.executeCommand('INT(RND() * 500) + 1', { show: true });
  // core.executeCommand('INT(5.135) + 1', { show: true });
  // core.executeCommand('INT(PI)', { show: true });
  // core.executeCommand('INT(RND() * 500) + 1', { show: true });
  // core.executeCommand('1+2+3+(POW(2,2)+1)+5*8-(50/2)', { show: true });
  // core.executeCommand('1+2+3+(POW(2,2)+1)+5*8', { show: true });
  // console.log(1 + 2 + 3 + ((2 ** 2) + 1) + 5 * 8);

  // core.executeCommand('1+2+3+5+5*8', { show: true });
  // console.log(1 + 2 + 3 + 5 + 5 * 8);
  // core.executeCommand('1 + 1', { show: true });

  // core.executeCommand('POW(2 , 2)', { show: true });
  commandTester.command('"foo" +"bar"', '"foobar"');
  commandTester.command('(-3+-6)+1', (-3 + -6) + 1);
  commandTester.command('(-3-+6)+1', (-3 - +6) + 1);
  commandTester.command('(-3*-6)+1', (-3 * -6) + 1);
  commandTester.command('(-3/-6)+1', (-3 / -6) + 1);
  commandTester.command('(-3+6)+1', (-3 + 6) + 1);
  commandTester.command('(-3-6)+1', (-3 - 6) + 1);
  commandTester.command('(-3*6) + 1', (-3 * 6) + 1);
  commandTester.command('(-3/6)+1', (-3 / 6) + 1);
  commandTester.command('INT(PI)', 3);
  commandTester.command('(POW(2,2)+1)', 5);
  commandTester.command('ASC("D")', 68);
  commandTester.command('CHR$(68)', '"D"');
  commandTester.command('LEN("ABC")', 3);
  commandTester.command('"a" + "b"', '"ab"');
  commandTester.command('STRING$(3,0)', '"000"');
  commandTester.command('SQRT(2,2)', Math.sqrt(2, 2));
  commandTester.command('128 >> (256 + 5)', 128 >> (256 + 5));
  commandTester.command('-2+4+SQRT(2,2)', -2 + 4 + Math.sqrt(2, 2));
  commandTester.command('-2- 2 * 2', -2 - 2 * 2);
  commandTester.command('(1+1)', (1 + 1));
  commandTester.command('2*2', 2 * 2);
  commandTester.command('1+2+3+(POW(2,2)+1)+5*8-(50/2)', 1 + 2 + 3 + (2 ** 2 + 1) + 5 * 8 - (50 / 2));

  return commandTester.start();
}
