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

export default defineMenuItems<{ model: Model } & WindowMenuItems>(
  ({ model }) => {
    return [
      new MenuItemInteraction({
        title: 'Say',
        items: [
          new MenuItemInteraction({
            hotKey: {
              alt: true,
              code: 'KeyI',
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
