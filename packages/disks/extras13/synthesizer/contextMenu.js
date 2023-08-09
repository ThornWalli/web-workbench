import { MENU_ITEM_TYPE } from '@web-workbench/core/classes/MenuItem';
import WbSynthesizerInfo from './components/Info';
import { getInstruments, getKeyboardSizes, getTimes } from './utils';
import { CONFIG_NAMES } from './index';

export default ({ core, model }) => {
  const { windows } = core.modules;

  function actionClose () {
    return model.actions.close();
  }

  function actionReset () {
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
          action () {
            windows.addWindow({
              title: 'Info',
              component: WbSynthesizerInfo,
              componentData: { model },
              options: {
                scale: false,
                prompt: false,
                scrollX: false,
                scrollY: false
              }
            }, {
              group: 'debugSynthesizer'
            });
          }
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
          items: Object.entries(getKeyboardSizes()).map(([
            value, title
          ]) => ({
            type: MENU_ITEM_TYPE.RADIO,
            title,
            model,
            name: CONFIG_NAMES.SYNTHESIZER_KEYBOARD_SIZE,
            value
          }))
        },
        {
          type: MENU_ITEM_TYPE.DEFAULT,
          title: 'Instrument',
          items: Object.entries(getInstruments()).map(([
            value, title
          ]) => ({
            type: MENU_ITEM_TYPE.RADIO,
            title,
            model,
            name: CONFIG_NAMES.SYNTHESIZER_INSTRUMENT,
            value
          }))
        },
        {
          type: MENU_ITEM_TYPE.DEFAULT,
          title: 'Note',
          items: Object.entries(getTimes()).map(([
            value, title
          ]) => ({
            type: MENU_ITEM_TYPE.RADIO,
            title: `${title} (${value})`,
            model,
            name: CONFIG_NAMES.SYNTHESIZER_NOTE,
            value
          }))
        },
        {
          type: MENU_ITEM_TYPE.DEFAULT,
          title: 'Beat',
          items: Array(9).fill({}).map((v, index) => ({
            type: MENU_ITEM_TYPE.RADIO,
            title: String(index + 1),
            model,
            name: CONFIG_NAMES.SYNTHESIZER_BEAT,
            value: index + 1
          }))
        },
        {
          type: MENU_ITEM_TYPE.DEFAULT,
          title: 'Base Beat',
          items: Array(9).fill({}).map((v, index) => ({
            type: MENU_ITEM_TYPE.RADIO,
            title: String(index + 1),
            model,
            name: CONFIG_NAMES.SYNTHESIZER_BASE_BEAT,
            value: index + 1
          }))
        },
        {
          type: MENU_ITEM_TYPE.DEFAULT,
          title: 'Start Octave',
          items: Array(10).fill({}).map((v, index) => ({
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
          items: Array(10).fill({}).map((v, index) => ({
            type: MENU_ITEM_TYPE.RADIO,
            title: String(index + 1),
            model,
            name: CONFIG_NAMES.SYNTHESIZER_OCTAVE_COUNT,
            value: index + 1
          }))
        }
      ]
    },
    {
      title: 'View',
      items: [
        {
          type: MENU_ITEM_TYPE.RADIO,
          title: 'Default',
          model,
          name: CONFIG_NAMES.SYNTHESIZER_VIEW,
          value: 'default'
        },
        {
          type: MENU_ITEM_TYPE.RADIO,
          title: 'Record',
          model,
          name: CONFIG_NAMES.SYNTHESIZER_VIEW,
          value: 'record'
        }
      ]
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
          separator: true
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

