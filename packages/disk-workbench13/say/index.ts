import { ITEM_META } from '@web-workbench/core/classes/FileSystem/types';
import { defineFileItems } from '@web-workbench/core/classes/FileSystem/utils';
import { computed, reactive } from 'vue';
import type { Model, Options } from './types';
import type Window from '@web-workbench/core/classes/Window';
import { DEFAULT_PRESET_LANGUAGE, getDefaultVoice } from './utils';
import { SYMBOL } from '../types';
import { CONFIG_NAMES } from '@web-workbench/core/classes/Core/types';
import { ipoint } from '@js-basics/vector';

export default defineFileItems(({ core }) => {
  let optionsWindow: Window | undefined;
  let presetWindow: Window | undefined;
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
        const mainComponent =
          await import('./components/windows/Main.vue').then(
            module => module.default
          );

        const model = reactive<Model>({
          playing: false,
          value: '',
          presetLanguage: DEFAULT_PRESET_LANGUAGE,
          displayLanguage: DEFAULT_PRESET_LANGUAGE,
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
          play: (value?: string) => {
            value = value || model.value;
            if (!value) {
              console.warn('No value provided to play.');
              return;
            }
            const utterance = new SpeechSynthesisUtterance(value);
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
          },
          openPresets: () => openPresets(model)
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
            },
            layout: {
              minSize: ipoint(200, 160),
              size: ipoint(200, 160)
            }
          },
          {
            group: 'workbench13Say'
          }
        );

        mainWindow?.awaitClose().then(() => {
          presetWindow?.close();
          optionsWindow?.close();
          infoWindow?.close();
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
        component: await import('./components/windows/Info.vue').then(
          module => module.default
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
    const optionsComponent =
      await import('./components/windows/Options.vue').then(
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

  async function openPresets(model: Model) {
    const items = await import('./presets.json').then(module => module.default);

    presetWindow = core.modules.windows?.addWindow({
      component: await import('./components/windows/Presets.vue').then(
        module => module.default
      ),
      componentData: {
        items,
        model,
        onSelect: (value: string) => {
          console.log('Selected preset:', value);
          model.actions?.play(value);
        },
        language: computed(() => model.presetLanguage),
        displayLanguage: computed(() => model.displayLanguage)
      },
      options: {
        title: 'Presets',
        scale: true,
        scrollY: true,
        filled: true
      },
      layout: {
        minSize: ipoint(200, 160),
        size: ipoint(200, 240)
      }
    });

    presetWindow?.awaitClose().then(() => {
      presetWindow = undefined;
    });
    return presetWindow;
  }
});
