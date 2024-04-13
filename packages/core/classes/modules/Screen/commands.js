import { ArgumentInfo } from '../../Command';

import {
  toggleFullscreen as fullscreenToggleFullscreen,
  isFullscreen as fullscreenIsFullscreen
} from '../../../utils/fullscreen';

export default ({ core }) => {
  // const { files, windows, symbols } = core.modules;
  // const fileSystem = files.fs;
  return [
    {
      name: ['fullscreen'],
      description: 'Toggle Fullscreen',
      args: [
        new ArgumentInfo({
          name: 'set',
          description: 'Set Fullscreen'
        }),
        new ArgumentInfo({
          name: 'toggle',
          description: 'Toggle Fullscreen',
          flag: true
        }),
        new ArgumentInfo({
          name: 'is',
          description: 'check fullscreen',
          flag: true
        })
      ],
      async action({ is, fullscreen, toggle }) {
        if (is) {
          return fullscreenIsFullscreen();
        } else if (fullscreen || toggle) {
          let message = 'Enter Fullscreen?';
          if (fullscreenIsFullscreen()) {
            message = 'Leave Fullscreen?';
          }

          const value = await core.executeCommand(
            `openDialog "${message}" -confirm`
          );

          if (value) {
            fullscreenToggleFullscreen(document.body);
          }
        }
      }
    }
  ];
};
