import themeWhiteContrast from '@web-workbench/core/themes/whiteContrast';
import { WINDOW_POSITION } from '@web-workbench/core/classes/WindowWrapper';
import { markRaw, nextTick, reactive } from 'vue';
import { ipoint } from '@js-basics/vector';
import { filter } from 'rxjs';
import { defineFileItems } from '@web-workbench/core/classes/FileSystem/utils';
import { ITEM_META } from '@web-workbench/core/classes/FileSystem/types';
import { getDefaultDocumentModel } from './utils';
import { CONFIG_NAMES, type Model } from './types';
import type Window from '@web-workbench/core/classes/Window';
import { SYMBOL } from '../types';

export default defineFileItems(({ core }) => {
  return [
    {
      meta: [
        [ITEM_META.SYMBOL, SYMBOL.DOCUMENT_EDITOR],
        [ITEM_META.WINDOW_SIZE, ipoint(360, 200)]
      ],
      id: 'DocumentEditor.app',
      name: 'Document Editor',
      createdDate: new Date(2020, 4, 16).getTime(),
      editedDate: new Date(2020, 4, 17).getTime(),
      async action({ modules }, path) {
        const executionResolve = core.addExecution();

        let model = reactive<Model>({
          value: getDefaultDocumentModel(),
          fsItem: undefined,
          [CONFIG_NAMES.DOCUMENT_EDITOR_SHOW_PREVIEW]: core.config.get(
            CONFIG_NAMES.DOCUMENT_EDITOR_SHOW_PREVIEW
          )
        });

        if (path) {
          const fsItem = await modules.files?.fs.get(path);
          if (fsItem) {
            model = {
              ...model,
              fsItem: markRaw(fsItem),
              value: {
                ...model.value,
                ...getDefaultDocumentModel(),
                ...fsItem.data
              }
            };
          } else {
            throw new Error('File not found');
          }
        }

        const componentEditor = await import(
          './components/DocumentEditor.vue'
        ).then(module => module.default);

        const editorWindow = modules.windows?.addWindow(
          {
            component: componentEditor,
            componentData: {
              model,
              'onUpdate:content': (content: string) => {
                model.value.content = content;
              }
            },
            options: {
              title: 'Document Editor',
              scaleX: false,
              scaleY: false,
              scrollX: true,
              scrollY: true,
              center: false,
              embed: true,
              borderless: true
            },
            layout: {
              size: ipoint(540, 360)
            }
          },
          {
            group: 'workbench13DocumentEditor',
            full: true
          }
        );

        function close() {
          editorWindow?.close();
        }
        function focus() {
          editorWindow?.focus();
        }
        function reset() {
          model.value = getDefaultDocumentModel();
          model.fsItem = undefined;
        }

        let previewWindow: Window | undefined;
        async function togglePreview(toggle = true) {
          if (toggle) {
            const component = await import('./components/Preview.vue').then(
              module => module.default
            );
            previewWindow = modules.windows?.addWindow(
              {
                component,
                componentData: { model },
                options: {
                  title: 'Preview - Document Editor',
                  scaleX: false,
                  scaleY: false,
                  scrollX: true,
                  scrollY: true,
                  center: false,
                  close: false,
                  embed: true,
                  borderless: true
                },
                layout: {
                  size: ipoint(540, 360)
                }
              },
              {
                group: 'workbench13DocumentEditor',
                active: false
              }
            );
            window.requestAnimationFrame(() => {
              modules.windows?.contentWrapper.setWindowPositions(
                WINDOW_POSITION.SPLIT_HORIZONTAL,
                [editorWindow, previewWindow],
                { embed: true }
              );
            });
          } else if (previewWindow) {
            previewWindow.close();
            editorWindow?.unfocus();
            nextTick(() => {
              modules.windows?.contentWrapper.setWindowPositions(
                WINDOW_POSITION.SPLIT_HORIZONTAL,
                [editorWindow],
                { embed: true }
              );
              focus();
            });
          }
        }

        model.actions = {
          close,
          focus,
          reset,
          togglePreview
        };

        core.modules.screen?.setTheme(themeWhiteContrast);

        return new Promise(resolve => {
          executionResolve();
          editorWindow?.events
            .pipe(filter(({ name }) => name === 'close'))
            .subscribe(() => {
              if (previewWindow) {
                previewWindow.close();
              }
              core.modules.screen?.setTheme();
              resolve();
            });
        });
      }
    }
  ];
});
