import 'storybook-addon-vue-info/lib/register'
import '@storybook/addon-knobs/register';
import '@storybook/addon-a11y/register';
import '@storybook/addon-actions/register';

import '@storybook/addon-links/register';
import '@storybook/addon-notes/register';
import '@storybook/addon-backgrounds/register';
import '@storybook/addon-viewport/register';
import 'storybook-dark-mode/register';


import { addons } from '@storybook/addons';
import wbTheme from './theme/web-workbench';

addons.setConfig({
  isFullscreen: false,
  showNav: true,
  showPanel: true,
  panelPosition: 'bottom',
  sidebarAnimations: true,
  enableShortcuts: true,
  isToolshown: true,
  theme: wbTheme,
  selectedPanel: undefined
});

