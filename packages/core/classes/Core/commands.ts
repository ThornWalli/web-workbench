import columnify from 'columnify';
import { ArgumentInfo, defineCommands } from '../Command';
import commandBucket from '../../services/commandBucket';
import { Table as ConsoleTable } from '../../utils/console';
import { unwrapString, isNumeric } from '../../utils/helper';

import { getExt } from '../../utils/fileSystem';
import errorMessage from '../../services/errorMessage';

import { CONFIG_NAMES } from './types';
import type Core from '.';
import CommandTester from '../CommandTester';
import type { ItemData } from '../FileSystem/types';

export default defineCommands<{ core: Core }>(({ core }) => [
  {
    name: ['execute'],
    description: 'Execute file.',
    args: [
      new ArgumentInfo({
        index: 0,
        name: 'path',
        description: 'Path to the file'
      })
    ],
    // eslint-disable-next-line complexity
    async action({ path }: { path: string }) {
      let path_: string | undefined = path;
      const mapping = new Map(
        core.config.get<Map<string, string>>(
          CONFIG_NAMES.FILE_EXTENSION_ASSIGNMENT
        )
      );
      if (!path_) {
        throw errorMessage.get('bad_args');
      }
      let fsItem;
      if (mapping.has(getExt(path_))) {
        fsItem = await core.modules.files?.fs.get(
          mapping.get(getExt(path_)) as string
        );
      } else {
        fsItem = await core.modules.files?.fs.get(path_);
        path_ = undefined;
      }
      if (typeof fsItem?.action === 'function') {
        return fsItem.action(core, path_);
      } else if (
        fsItem?.data &&
        typeof fsItem?.data === 'object' &&
        'type' in fsItem.data
      ) {
        const data = fsItem.data as ItemData;

        const command = [`openPreview "${fsItem.getPath()}"`];

        if (data.openMaximized) {
          command.push('-maximized');
        }

        return core.executeCommand(command.join(' '));
      }
    }
  },
  {
    name: ['openColorSettings'],
    async action() {
      const component = await import(
        '@web-workbench/core/components/modules/core/ColorSettings.vue'
      ).then(module => module.default);
      core.modules.windows?.addWindow({
        component,
        componentData: {},
        options: {
          title: 'Color Settings',
          prompt: false,
          scaleX: false,
          scaleY: false,
          scrollX: false,
          scrollY: false
        }
      });
    }
  },
  {
    name: ['openSettings'],
    async action() {
      const component = await import(
        '@web-workbench/core/components/modules/core/Settings.vue'
      ).then(module => module.default);
      core.modules.windows?.addWindow({
        component,
        componentData: {},
        options: {
          title: 'Settings',
          prompt: false,
          scaleX: false,
          scaleY: false,
          scrollX: false,
          scrollY: false,
          filled: true
        }
      });
    }
  },
  {
    name: ['echo', 'print'],
    args: [
      new ArgumentInfo({
        name: ['newline', 'n'],
        flag: true
      })
    ],
    async action({ newline }: { newline: boolean }, options) {
      const valueParse = (value: string) =>
        unwrapString(value).replace(/\\"/g, '"').replace(/\\n/g, '\n');
      if (newline) {
        options.message(options.commandArgs.map(arg => valueParse(arg)));
      } else {
        let value = await options.core.executeCommand(options.commandValue);
        if (typeof value === 'object') {
          value = JSON.stringify(value);
        }
        options.message(`${unwrapString(valueParse(value))}`);
      }
    }
  },
  {
    name: 'commands',
    action(params: string[], options) {
      const table = new ConsoleTable({
        headerPadding: 1
      });
      table.addColumns([
        {
          value: 'Command(s)',
          align: 'left',
          maxWidth: 20
        },
        {
          value: 'Description/Arguments',
          align: 'left',
          maxWidth: 60
        }
      ]);
      table.addRows(
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

          const { flagNames, kwargNames } = args.reduce(
            (result, argument) => {
              const name = argument.name.join(', ');
              if (argument.flag) {
                result.flagNames.push({
                  name: `-${name}`,
                  description: argument.description
                });
              } else {
                result.kwargNames.push({
                  name: `--${name}`,
                  description: argument.description
                });
              }
              return result;
            },
            {
              flagNames: [],
              kwargNames: []
            } as {
              flagNames: { name: string; description?: string }[];
              kwargNames: { name: string; description?: string }[];
            }
          );
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

          result.push([command.name.join(', '), lines.join('\n')]);
          return result;
        }, [] as string[][])
      );
      options.message(['Commands:', table]);
      return Promise.resolve();
    }
  },

  {
    name: ['CLS', 'CLEAR'],
    async action() {
      core.consoleInterface.clear();
    }
  },

  {
    name: ['prompt', 'input', 'PROMPT', 'INPUT'],
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

    action: ({
      text,
      variable,
      unresolved
    }: {
      text?: string;
      variable: string;
      unresolved: {
        text: string;
        variable: string;
      };
    }) => {
      if (unresolved.text && !unresolved.variable) {
        variable = unresolved.text;
        text = undefined;
      } else {
        variable = unresolved.variable;
      }

      return core.consoleInterface.prompt(text).then(value => {
        if (isNumeric(value)) {
          value = Number(value);
        }
        if (variable) {
          core.modules.parser?.memory.set(variable, value);
        }
        return value;
      });
    }
  },
  {
    name: ['confirm', 'CONFIRM'],
    args: [
      new ArgumentInfo({
        index: 0,
        name: 'text',
        description: 'Text from confirm.'
      })
    ],
    action({ text }: { text: string }) {
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
    name: ['selfCheck'],
    async action(params: string[], options) {
      const table = new ConsoleTable();
      table.addColumns([
        {
          value: 'Count',
          align: 'left',
          minWidth: 8
        },
        {
          value: 'Description',
          align: 'left',
          minWidth: 15
        }
      ]);

      table.addRows(await commandTests(core));

      options.message([
        '"Command Tests:"',
        table,
        '"For failures, look in the web console of the browser."'
      ]);
    }
  }
]);

function commandTests(core: Core) {
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
  commandTester.command('(-3+-6)+1', -3 + -6 + 1);
  commandTester.command('(-3-+6)+1', -3 - +6 + 1);
  commandTester.command('(-3*-6)+1', -3 * -6 + 1);
  commandTester.command('(-3/-6)+1', -3 / -6 + 1);
  commandTester.command('(-3+6)+1', -3 + 6 + 1);
  commandTester.command('(-3-6)+1', -3 - 6 + 1);
  commandTester.command('(-3*6) + 1', -3 * 6 + 1);
  commandTester.command('(-3/6)+1', -3 / 6 + 1);
  commandTester.command('INT(PI)', 3);
  commandTester.command('(POW(2,2)+1)', 5);
  commandTester.command('ASC("D")', 68);
  commandTester.command('CHR$(68)', '"D"');
  commandTester.command('LEN("ABC")', 3);
  commandTester.command('"a" + "b"', '"ab"');
  commandTester.command('STRING$(3,0)', '"000"');
  commandTester.command('SQRT(2,2)', Math.sqrt(2));
  commandTester.command('128 >> (256 + 5)', 128 >> (256 + 5));
  commandTester.command('-2+4+SQRT(2,2)', -2 + 4 + Math.sqrt(2));
  commandTester.command('-2- 2 * 2', -2 - 2 * 2);
  commandTester.command('(1+1)', 1 + 1);
  commandTester.command('2*2', 2 * 2);
  commandTester.command(
    '1+2+3+(POW(2,2)+1)+5*8-(50/2)',
    1 + 2 + 3 + (2 ** 2 + 1) + 5 * 8 - 50 / 2
  );

  return commandTester.start();
}
