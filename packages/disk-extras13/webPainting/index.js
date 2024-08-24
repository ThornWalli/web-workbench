import { markRaw, reactive } from 'vue';
import { ipoint } from '@js-basics/vector';

import App from './lib/App';
import Bounds from './lib/Bounds';

export default function webPainting(core) {
  const windowsModule = core.modules.windows;
  return async () => {
    const executionResolve = core.addExecution();
    const [WbComponentsWebPainting] = await Promise.all([
      import('./components/WebPainting').then(module => module.default)
    ]);

    const contentLayout = core.modules.screen.contentLayout;
    const app = markRaw(
      new App(
        new Bounds(
          contentLayout.position,
          ipoint(() => contentLayout.position + contentLayout.size)
        )
      )
    );

    app.options.display.background = core.config.get(
      CONFIG_NAMES.WEB_PAINTING_DISPLAY_BACKGROUND
    );
    app.options.display.foreground = core.config.get(
      CONFIG_NAMES.WEB_PAINTING_DISPLAY_FOREGROUND
    );

    const model = reactive({
      fsItem: null,
      app
    });

    const window = windowsModule.addWindow(
      {
        title: 'WebPainting - Extras 1.3',
        component: WbComponentsWebPainting,
        componentData: {
          model
        },
        options: {
          scaleX: false,
          scaleY: false,
          scrollX: false,
          scrollY: false,
          embed: true
        }
      },
      {
        group: 'extras13WebPainting',
        full: true
      }
    );

    model.actions = {
      close: () => {
        window.close();
      },
      focus: () => {
        window.focus();
      }
    };

    executionResolve();
  };
}

export const CONFIG_NAMES = {
  WEB_PAINTING_DISPLAY_BACKGROUND: 'extras13_web_painting_display_background',
  WEB_PAINTING_DISPLAY_FOREGROUND: 'extras13_web_painting_display_foreground'
};

export const CONFIG_DEFAULTS = {
  [CONFIG_NAMES.WEB_PAINTING_DISPLAY_BACKGROUND]: '#CCCCCC',
  [CONFIG_NAMES.WEB_PAINTING_DISPLAY_FOREGROUND]: '#FFFFFF'
};

export const PROPERTY = {
  CONTENT: 'content',
  OUTPUT_TYPE: 'type'
};
