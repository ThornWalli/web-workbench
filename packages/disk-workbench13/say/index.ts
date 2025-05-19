import { ITEM_META } from '@web-workbench/core/classes/FileSystem/types';
import { defineFileItems } from '@web-workbench/core/classes/FileSystem/utils';
import { reactive } from 'vue';
import type { Model, Options } from './types';
import type Window from '@web-workbench/core/classes/Window';
import { getDefaultVoice } from './utils';
import { SYMBOL } from '../types';
import { CONFIG_NAMES } from '@web-workbench/core/classes/Core/types';
// import { SYMBOL } from '../types';

export default defineFileItems(({ core }) => {
  let optionsWindow: Window | undefined;
  let infoWindow: Window | undefined;

  return [
    {
      meta: [[ITEM_META.SYMBOL, SYMBOL.SAY]],
      id: 'Say.app',
      name: 'Say',
      createdDate: new Date(2025, 5, 14).getTime(),
      editedDate: new Date(2025, 5, 16).getTime(),
      async action() {
        const executionResolve = core.addExecution();
        const mainComponent = await import('./components/Say.vue').then(
          module => module.default
        );

        const model = reactive<Model>({
          playing: false,
          value: '',
          options: {
            voice: await getDefaultVoice(),
            rate: 1,
            pitch: 1
          }
        });

        model.actions = {
          close: () => {
            mainWindow?.close();
          },
          play: () => {
            const utterance = new SpeechSynthesisUtterance(model.value);
            utterance.volume =
              core.config.observable[CONFIG_NAMES.SCREEN_CONFIG].soundVolume;
            utterance.voice = model.options.voice;
            utterance.rate = model.options.rate;
            utterance.pitch = model.options.pitch;
            utterance.onstart = () => {
              model.playing = true;
              model.paused = false;
            };
            utterance.onresume = () => {
              model.playing = true;
              model.paused = false;
            };
            utterance.onend = () => {
              model.playing = false;
              model.paused = false;
            };
            utterance.onpause = () => {
              model.paused = true;
            };
            window.speechSynthesis.speak(utterance);
          },
          stop: () => {
            return;
          },
          pause: () => {
            window.speechSynthesis.pause();
            return;
          },
          openInfo: () => openInfo(model),
          openOptions: () => openOptions(model),
          setOptions: (options: Partial<Options>) => {
            Object.assign(model.options, options);
          }
        };

        const mainWindow = core.modules.windows?.addWindow(
          {
            component: mainComponent,
            componentData: {
              model,
              modelValue: model.value,
              'onUpdate:model-value': (value: string) => {
                model.value = value;
              }
            },
            options: {
              title: 'Say',
              scale: true,
              scrollX: false,
              scrollY: false,
              filled: true
            }
          },
          {
            group: 'workbench13Say'
          }
        );

        mainWindow?.awaitClose().then(() => {
          optionsWindow?.close();
        });
        executionResolve();
      }
    }
  ];
  async function openInfo(model: Model) {
    if (infoWindow) {
      return infoWindow;
    }
    infoWindow = core.modules.windows?.addWindow(
      {
        component: await import('./components/Info.vue').then(
          async module => module.default
        ),
        componentData: {
          model
        },
        options: {
          title: 'Info',
          scaleX: false,
          scaleY: false,
          scrollX: false,
          scrollY: false,
          filled: true
        }
      },
      {
        group: 'workbench13Say'
      }
    );

    infoWindow?.awaitClose().then(() => {
      infoWindow = undefined;
    });
    return infoWindow;
  }
  async function openOptions(model: Model) {
    if (optionsWindow) {
      return optionsWindow;
    }
    const optionsComponent = await import('./components/Options.vue').then(
      async module => module.default
    );
    optionsWindow = core.modules.windows?.addWindow(
      {
        component: optionsComponent,
        componentData: {
          model,
          modelValue: model.options,
          'onUpdate:model-value': (options: Options) => {
            Object.assign(model.options, options);
          }
        },
        options: {
          title: 'Options',
          scaleX: false,
          scaleY: false,
          scrollX: false,
          scrollY: false
        }
      },
      {
        group: 'workbench13Say'
      }
    );

    optionsWindow?.awaitClose().then(() => {
      optionsWindow = undefined;
    });
    return optionsWindow;
  }
});
