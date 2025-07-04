import blackContrast from '@web-workbench/core/themes/blackContrast';
import type { WebBasicThemeColors } from './types/theme';

function getDefaultThemeColors(
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  colors = ['#FFF', '#000', '#FFAA55', '#0055AA']
): WebBasicThemeColors {
  return {};
}

const theme = blackContrast.extend({
  name: 'Web Basic',
  colors: {
    disks: {
      webBasic: getDefaultThemeColors(['#000', '#fff', '#fff', '#fff'])
    }
  }
});
export default theme;
