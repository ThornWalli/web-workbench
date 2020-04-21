import { ITEM_META } from '../classes/FileSystem/Item';
import { SYMBOL } from '../utils/symbols';

export default async ({ core }) => {
  const [
    FormFields,
    Markdown,
    DialogContent,
    markdownContent
  ] = await Promise.all([
    import('@/components/disks/examples/FormFields').then(module => module.default),
    import('@/components/disks/examples/Markdown').then(module => module.default),
    import('@/components/environments/molecules/DialogContent').then(module => module.default),
    import('!!raw-loader!./examples/markdown.md').then(module => module.default)
  ]);

  return {
    meta: [
      [
        ITEM_META.SYMBOL, SYMBOL.DISK_2
      ],
      [
        ITEM_META.SORT_SYMBOLS, true
      ]
    ],
    name: 'UI Examples',
    items: [
      {
        id: 'FormFields.info',
        action ({ modules }) {
          const window = modules.windows.addWindow({
            title: 'Form Fields',
            component: FormFields,
            componentData: { core },
            options: {
              scale: true,
              scrollX: false,
              scrollY: true
            }
          });
          return new Promise((resolve) => {
            window.events.subscribe(({ name }) => {
              if (name === 'close') {
                resolve();
              }
            });
          });
        }
      },
      {
        id: 'Markdown.info',
        action ({ modules }) {
          const window = modules.windows.addWindow({
            title: 'Markdown',
            component: Markdown,
            componentData: {
              content: markdownContent
            },
            options: {
              scale: true,
              scrollX: false,
              scrollY: true
            }
          });
          return new Promise((resolve) => {
            window.events.subscribe(({ name }) => {
              if (name === 'close') {
                resolve();
              }
            });
          });
        }
      },
      {
        id: 'DialogTest.info',
        action ({ modules }) {
          const window = modules.windows.addWindow({
            title: 'Form Fields',
            component: DialogContent,
            componentData: {
              applyLabel: 'Apply Label',
              abortLabel: 'Abort Label',
              apply () {
                alert('apply');
              },
              abort () {
                alert('abort');
              }
            },
            options: {
              scale: false,
              scrollX: false,
              scrollY: false
            }
          });
          return new Promise((resolve) => {
            window.events.subscribe(({ name }) => {
              if (name === 'close') {
                resolve();
              }
            });
          });
        }
      }
    ]
  };
};
