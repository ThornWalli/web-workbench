import { registerStories } from 'vue-storybook'
import { configure, storiesOf, addParameters, addDecorator } from '@storybook/vue'
import { withKnobs, text, color, select, boolean, number } from "@storybook/addon-knobs/vue";
import { INITIAL_VIEWPORTS } from '@storybook/addon-viewport';
import { withA11y } from '@storybook/addon-a11y';
import { withInfo, setDefaults } from 'storybook-addon-vue-info';
// import centered from '@storybook/addon-centered/vue';
import { action, configureActions } from '@storybook/addon-actions';

import './prepare';

import '@/assets/css/symbols.pcss';
import webWorkbench from '@/web-workbench';
import Screen from '@/web-workbench/classes/modules/Screen';


let ready = Promise.resolve();
if (!(/environments--core/.test(location.href))){

  webWorkbench.addModule(Screen, {
    contentEl : document.getElementById('root')
  });
  ready = webWorkbench.setup()
}


ready.then(() => {

  // global.$wb = webWorkbench;

  const req = require.context("../src/components", true, /\.vue$/);

  addParameters({
    backgrounds: [
      { name: 'white', value: '#fff' },
      { name: 'black', value: '#000' }
    ],
    viewport: {
      viewports: Object.values(INITIAL_VIEWPORTS)
    }
  });

  // addDecorator(centered);
  addDecorator(withInfo({}));

  setDefaults({
    header: true,
    source: true,
    docsInPanel: true
  })


  function loadStories () {
    req.keys().forEach(filename => {
      const config = {
        knobs: {
          text,
          boolean,
          color,
          select,
          number
        },
        decorators: [
          withKnobs({
            escapeHTML: false,
          }),
          withA11y,
          // withInfo
        ],
        methods: {
          action
        }
      }
      registerStories(req, filename, storiesOf, config)
    })
  }

  configure(loadStories, module)

}).catch((err) => {
    throw err;
  });
