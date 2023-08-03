import { filter } from 'rxjs';
import { ITEM_META } from '@web-workbench/core/classes/FileSystem/Item';
import { SYMBOL } from '@web-workbench/core/utils/symbols';

export default async ({ core }) => {
  const [
    FormFields,
    Markdown,
    DialogContent,
    markdownContent
  ] = await Promise.all([
    import('./components/FormFields').then(module => module.default),
    import('./components/Markdown').then(module => module.default),
    import('@web-workbench/core/components/molecules/DialogContent').then(module => module.default),

    import('./markdown.md?raw').then(module => module.default)
  ]);

  return {
    meta: [
      [
        ITEM_META.SYMBOL, SYMBOL.DISK_2
      ],
      [
        ITEM_META.WINDOW_SYMBOL_REARRANGE, true
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
          }, {
            full: true
          });
          return new Promise((resolve) => {
            window.events.pipe(filter(({ name }) => name === 'close')).subscribe(() => {
              resolve();
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
            window.events.pipe(filter(({ name }) => name === 'close')).subscribe(() => {
              resolve();
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
            window.events.pipe(filter(({ name }) => name === 'close')).subscribe(() => {
              resolve();
            });
          });
        }
      }
    ]
  };
};
