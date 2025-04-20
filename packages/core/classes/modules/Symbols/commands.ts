import { ArgumentInfo } from '../../Command';
import { saveStorageItem } from '../../../utils/fileSystem';
import type Symbols from './index';
import type Item from '../../FileSystem/Item';
import { FileSystemSymbolWrapper } from '../../SymbolWrapper/FileSystem';
import type { ASymbolWrapper } from '../../SymbolWrapper';

export default ({ module }: { module: Symbols }) => {
  return [
    {
      name: ['rearrangeIcons'],
      description: 'Rearrange Icons',
      args: [
        new ArgumentInfo({
          name: 'id',
          description: 'Wraper id'
        }),
        new ArgumentInfo({
          name: 'root',
          description: 'Use root wrapper',
          flag: true
        })
      ],
      async action({ id, root }: { id: string; root: Item }) {
        const defaultWrapper =
          module.getDefaultWrapper() as FileSystemSymbolWrapper;
        const symbolWrapper = module.getPrimaryWrapper();
        await new Promise(resolve => window.requestAnimationFrame(resolve));
        if (root) {
          if (defaultWrapper.fsItem) {
            defaultWrapper?.rearrangeIcons({
              root: true
            });
            return saveStorageItem(defaultWrapper.fsItem);
          } else {
            throw new Error('No fsItem found');
          }
        } else {
          let wrapper: ASymbolWrapper | undefined = symbolWrapper;
          if (id) {
            wrapper = module.get(id);
            if (wrapper instanceof FileSystemSymbolWrapper && wrapper.fsItem) {
              wrapper.rearrangeIcons();
              return saveStorageItem(wrapper.fsItem);
            }
          }
        }
      }
    }
  ];
};
