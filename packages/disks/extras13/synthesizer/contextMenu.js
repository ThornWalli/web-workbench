import { MENU_ITEM_TYPE } from '@web-workbench/core/classes/MenuItem';
import WbSynthesizerInfo from './components/Info';
import { getKeyboardSizes, getNotes } from './utils';
import { CONFIG_NAMES, EXAMPLE_NOTES } from './index';

export default ({ core, model }) => {
  const { windows } = core.modules;

  function actionClose() {
    return model.actions.close();
  }

  function actionReset() {
    model.actions.reset();
  }

  return [
    {
      title: 'Synthesizer',
      items: [
        {
          hotKey: 'I',
          keyCode: 73,
          title: 'Info',
          action() {
            windows.addWindow(
              {
                title: 'Info',
                component: WbSynthesizerInfo,
                componentData: { model },
                options: {
                  scale: false,
                  prompt: false,
                  scrollX: false,
                  scrollY: false
                }
              },
              {
                group: 'debugSynthesizer'
              }
            );
          }
        },
        {
          type: MENU_ITEM_TYPE.SEPARATOR
        },
        {
          title: 'Close',
          action: actionClose
        }
      ]
    },
    {
      title: 'Options',
      items: [
        {
          type: MENU_ITEM_TYPE.CHECKBOX,
          title: 'Show Note Labels',
          name: CONFIG_NAMES.SYNTHESIZER_SHOW_NOTE_LABELS,
          model
        },
        {
          type: MENU_ITEM_TYPE.DEFAULT,
          title: 'Keyboard Size',
          items: Object.entries(getKeyboardSizes()).map(([value, title]) => ({
            type: MENU_ITEM_TYPE.RADIO,
            title,
            model,
            name: CONFIG_NAMES.SYNTHESIZER_KEYBOARD_SIZE,
            value
          }))
        },
        {
          type: MENU_ITEM_TYPE.SEPARATOR
        },
        {
          type: MENU_ITEM_TYPE.DEFAULT,
          title: 'Note Count',
          items: Object.entries(getNotes()).map(([value, title]) => ({
            type: MENU_ITEM_TYPE.RADIO,
            title: `${title} (${value})`,
            model,
            name: CONFIG_NAMES.SYNTHESIZER_NOTE_COUNT,
            value
          }))
        },
        {
          type: MENU_ITEM_TYPE.DEFAULT,
          title: 'Base Note',
          items: [2, 4, 8, 16].map(value => ({
            type: MENU_ITEM_TYPE.RADIO,
            title: String(value),
            model,
            name: CONFIG_NAMES.SYNTHESIZER_BASE_NOTE,
            value
          }))
        },
        // {
        //   type: MENU_ITEM_TYPE.DEFAULT,
        //   title: 'Note',
        //   items: Object.entries(getNotes()).map(([value, title]) => ({
        //     type: MENU_ITEM_TYPE.RADIO,
        //     title: `${title} (${value})`,
        //     model,
        //     name: CONFIG_NAMES.SYNTHESIZER_NOTE,
        //     value
        //   }))
        // },
        {
          type: MENU_ITEM_TYPE.SEPARATOR
        },
        {
          type: MENU_ITEM_TYPE.DEFAULT,
          title: 'Beat Count',
          items: Array(9)
            .fill({})
            .map((v, index) => ({
              type: MENU_ITEM_TYPE.RADIO,
              title: String(index + 1),
              model,
              name: CONFIG_NAMES.SYNTHESIZER_BEAT_COUNT,
              value: index + 1
            }))
        },
        {
          type: MENU_ITEM_TYPE.SEPARATOR
        },
        {
          type: MENU_ITEM_TYPE.DEFAULT,
          title: 'Start Octave',
          items: Array(10)
            .fill({})
            .map((v, index) => ({
              type: MENU_ITEM_TYPE.RADIO,
              title: String(index + 1),
              model,
              name: CONFIG_NAMES.SYNTHESIZER_START_OCTAVE,
              value: index + 1
            }))
        },
        {
          type: MENU_ITEM_TYPE.DEFAULT,
          title: 'Octave Count',
          items: Array(10)
            .fill({})
            .map((v, index) => ({
              type: MENU_ITEM_TYPE.RADIO,
              title: String(index + 1),
              model,
              name: CONFIG_NAMES.SYNTHESIZER_OCTAVE_COUNT,
              value: index + 1
            }))
        }
      ]
    },
    // {
    //   title: 'View',
    //   items: [
    //     {
    //       type: MENU_ITEM_TYPE.RADIO,
    //       title: 'Default',
    //       model,
    //       name: CONFIG_NAMES.SYNTHESIZER_VIEW,
    //       value: 'default'
    //     },
    //     {
    //       type: MENU_ITEM_TYPE.RADIO,
    //       title: 'Record',
    //       model,
    //       name: CONFIG_NAMES.SYNTHESIZER_VIEW,
    //       value: 'record'
    //     }
    //   ]
    // },
    {
      title: 'Examples',
      items: Object.entries(EXAMPLE_NOTES).map(([title, notes]) => ({
        title,
        action() {
          model[CONFIG_NAMES.SYNTHESIZER_RECORD_VALUES] = notes;
        }
      }))
    },
    model[CONFIG_NAMES.SYNTHESIZER_VIEW] === 'record' && {
      title: 'Record',
      // options: { disabled: true },
      items: [
        {
          options: { disabled: true },
          title: 'Start'
        },
        {
          options: { disabled: true },
          title: 'Stop'
        },
        {
          type: MENU_ITEM_TYPE.SEPARATOR
        },
        {
          // options: { disabled: true },
          title: 'Reset',
          action: actionReset
        }
      ]
    }
  ].filter(Boolean);
};
