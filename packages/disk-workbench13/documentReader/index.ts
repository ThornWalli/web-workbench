import { markRaw, reactive } from 'vue';
import { defineFileItems } from '@web-workbench/core/classes/FileSystem/utils';
import { ITEM_META } from '@web-workbench/core/classes/FileSystem/types';
import { SYMBOL } from '@web-workbench/core/utils/symbols';
import { ipoint } from '@js-basics/vector';
import { DEFAULT_FONT, getDefaultDocumentModel } from '../documentEditor/utils';
import type { Model } from './types';

export default defineFileItems(({ core }) => {
  return [
    {
      meta: [
        [ITEM_META.SYMBOL, SYMBOL.DOCUMENT_READER],
        [ITEM_META.WINDOW_SIZE, ipoint(360, 200)]
      ],
      id: 'DocumentReader.app',
      name: 'Document Reader',
      createdDate: new Date(2020, 4, 16).getTime(),
      editedDate: new Date(2020, 4, 17).getTime(),
      async action({ modules }, path) {
        let fsItem;
        let model = reactive<Model>({
          fsItem: undefined,
          value: getDefaultDocumentModel(),
          fontFamily: DEFAULT_FONT
        });
        if (path) {
          fsItem = await modules.files?.fs.get(path);
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
        const executionResolve = core.addExecution();

        const component = await import('./components/DocumentReader.vue').then(
          module => module.default
        );
        const window = modules.windows?.addWindow(
          {
            component,
            componentData: { model },
            options: {
              title: 'Document Reader',
              scaleX: true,
              scaleY: true,
              scrollX: false,
              scrollY: false
            }
          },
          {
            full: true,
            group: 'workbench13DocumentReader'
          }
        );

        function close() {
          window?.close();
        }
        function focus() {
          window?.focus();
        }

        model.actions = {
          close,
          focus
        };

        executionResolve();
      }
    }
  ];
});
