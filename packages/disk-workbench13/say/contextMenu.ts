import {
  MenuItemInteraction,
  MenuItemSeparator,
  MenuItemSpacer,
  MenuItemText
} from '@web-workbench/core/classes/MenuItem';
import type { WindowMenuItems } from '@web-workbench/core/types/contextMenu';
import { defineMenuItems } from '@web-workbench/core/utils/menuItems';
import type { Model } from './types';
import { computed } from 'vue';
import { KEYBOARD_CODE } from '@web-workbench/core/services/dom';
import { INTERACTION_TYPE } from '@web-workbench/core/classes/MenuItem/Interaction';
import { PRESET_LANGUAGES } from './utils';

export default defineMenuItems<{ model: Model } & WindowMenuItems>(
  ({ model }) => {
    const languageItems = PRESET_LANGUAGES.map(({ title, value }) => {
      return new MenuItemInteraction<string, Model>({
        type: INTERACTION_TYPE.RADIO,
        title,
        value,
        model: model,
        name: 'presetLanguage'
      });
    });

    const displayLanguageItems = PRESET_LANGUAGES.map(({ title, value }) => {
      return new MenuItemInteraction<string, Model>({
        type: INTERACTION_TYPE.RADIO,
        title,
        value,
        model: model,
        name: 'displayLanguage'
      });
    });

    return [
      new MenuItemInteraction({
        title: 'Say',
        items: [
          new MenuItemInteraction({
            hotKey: {
              alt: true,
              code: KEYBOARD_CODE.KEY_I,
              title: 'I'
            },
            title: 'Info',
            async action() {
              return model.actions?.openInfo();
            }
          }),
          new MenuItemSeparator(),
          new MenuItemInteraction({
            title: 'Close',
            action() {
              return model.actions?.close();
            }
          })
        ]
      }),
      new MenuItemInteraction({
        title: 'Options…',
        action() {
          model.actions?.openOptions();
        }
      }),
      new MenuItemInteraction({
        title: 'Presets…',
        action() {
          model.actions?.openPresets();
        },
        items: [
          new MenuItemInteraction({
            title: 'Language',
            items: languageItems
          }),
          new MenuItemInteraction({
            title: 'Display Language',
            items: displayLanguageItems
          })
        ]
      }),
      new MenuItemSeparator(),
      new MenuItemInteraction({
        title: 'Play',
        options: {
          disabled: computed(
            () => !model.value || (model.playing && !model.paused)
          )
        },
        action() {
          model.actions?.play();
        }
      }),
      new MenuItemInteraction({
        title: 'Pause',
        options: {
          disabled: computed(
            () => !model.playing || (model.playing && model.paused)
          )
        },
        action() {
          model.actions?.pause();
        }
      }),
      new MenuItemSpacer(),
      new MenuItemInteraction({
        title: 'Info',
        items: [
          new MenuItemText({
            text: computed(() => `Voice: ${model.options.voice.name}`)
          }),
          new MenuItemText({
            text: computed(() => `Rate: ${model.options.rate.toFixed(1)}`)
          }),
          new MenuItemText({
            text: computed(() => `Pitch: ${model.options.pitch.toFixed(1)}`)
          })
        ]
      })
    ];
  }
);
