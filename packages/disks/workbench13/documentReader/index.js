import { markRaw, reactive } from 'vue';
import { DEFAULT_FONT, getDefaultDocumentModel } from '../documentEditor/index';

export default function documentReader(core) {
  return async ({ modules }, path) => {
    let fsItem;
    let model = reactive({
      actions: {},
      fsItem: null,
      value: getDefaultDocumentModel(),
      fontFamily: DEFAULT_FONT
    });
    if (path) {
      fsItem = markRaw(await modules.files.fs.get(path));
      const value = Object.assign(
        model.value,
        getDefaultDocumentModel(),
        fsItem.data
      );
      model = {
        ...model,
        fsItem,
        value
      };
    }
    const executionResolve = core.addExecution();
    const [component] = await Promise.all([
      import('./components/DocumentReader').then(module => module.default)
    ]);

    const window = modules.windows.addWindow(
      {
        title: 'Document Reader',
        component,
        componentData: { model },
        options: {
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

    Object.assign(model.actions, {
      close: () => {
        window.close();
      },
      focus: () => {
        window.focus();
      }
    });
    executionResolve();
  };
}
