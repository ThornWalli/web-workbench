import type CommandContainer from '../classes/Command';
import { ArgumentInfo, parseParsedCommand } from '../classes/Command';

import { describe, it, expect } from 'vitest';
import CommandParser from '../classes/CommandParser';

const comandParser = new CommandParser();

describe('commandParser', () => {
  it('Samples', async () => {
    const command =
      'openDirectory "Press:" --window-size="100,120" --window-scale=false --window-scroll-x=false --window-scroll-y=false --window-sidebar=false';

    const test: CommandContainer = {
      name: ['openDirectory', 'openDir'],
      description: 'Opens the specified directory.',
      args: [
        new ArgumentInfo({
          index: 0,
          name: 'path',
          description: 'Path to the directory.'
        }),
        new ArgumentInfo({
          name: 'sortSymbols',
          description: 'Sort Symbols',
          flag: true
        }),
        new ArgumentInfo({
          name: 'windowSize',
          description: 'Window Size'
        }),
        new ArgumentInfo({
          name: 'windowPosition',
          description: 'Window Position'
        }),
        new ArgumentInfo({
          name: 'windowScale',
          description: 'Window Scale'
        }),
        new ArgumentInfo({
          name: 'windowScrollX',
          description: 'Window Scroll-X'
        }),
        new ArgumentInfo({
          name: 'windowScrollY',
          description: 'Window Scroll-Y'
        }),
        new ArgumentInfo({
          name: 'windowSidebar',
          description: 'Window Sidebar'
        }),
        new ArgumentInfo({
          name: 'windowFullSize',
          description: 'Window Full-Size'
        })
      ],
      action: async (data: object) => {
        console.log('Action:', data);
      }
    };

    // const parsedCommand = parse(command);

    const parsedCommand = await comandParser.parse(command);

    expect(toJSON(parsedCommand)).toEqual(
      toJSON({
        origin:
          'openDirectory "Press:" --window-size="100,120" --window-scale=false --window-scroll-x=false --window-scroll-y=false --window-sidebar=false',
        unresolved: {
          args: ['"Press:"'],
          kwargs: {
            windowSize: '"100,120"',
            windowScale: 'false',
            windowScrollX: 'false',
            windowScrollY: 'false',
            windowSidebar: 'false'
          }
        },
        args: ['Press:'],
        kwargs: {
          windowSize: '100,120',
          windowScale: false,
          windowScrollX: false,
          windowScrollY: false,
          windowSidebar: false
        },
        command: 'openDirectory',
        commandValue:
          'openDirectory "Press:" --window-size="100,120" --window-scale=false --window-scroll-x=false --window-scroll-y=false --window-sidebar=false'
      })
    );

    expect(toJSON(parseParsedCommand(test, parsedCommand))).toEqual(
      toJSON({
        '0': 'Press:',
        unresolved: {
          '0': '"Press:"',
          path: '"Press:"',
          windowSize: '100,120',
          windowScale: false,
          windowScrollX: false,
          windowScrollY: false,
          windowSidebar: false
        },
        path: 'Press:',
        windowSize: '100,120',
        windowScale: false,
        windowScrollX: false,
        windowScrollY: false,
        windowSidebar: false
      })
    );
  });
});

function toJSON(obj: unknown) {
  return JSON.stringify(obj, null, 2);
}
