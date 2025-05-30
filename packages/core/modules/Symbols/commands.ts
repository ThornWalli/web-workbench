import { ArgumentInfo } from '../../classes/Command';
import { saveStorageItem } from '../../utils/fileSystem';
import type Symbols from './index';
import type Item from '../../classes/FileSystem/Item';
import { FileSystemSymbolWrapper } from '../../classes/SymbolWrapper/FileSystem';
import type { ISymbolWrapper } from '../../classes/SymbolWrapper';

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
        }),
        new ArgumentInfo({
          name: 'force',
          description: 'Force rearrangement',
          flag: true
        })
      ],
      async action({
        id,
        root,
        force
      }: {
        id: string;
        root: Item;
        force: boolean;
      }) {
        const defaultWrapper =
          module.getDefaultWrapper() as FileSystemSymbolWrapper;
        const symbolWrapper = module.getPrimaryWrapper();
        await new Promise(resolve => window.requestAnimationFrame(resolve));
        if (root) {
          if (defaultWrapper.fsItem) {
            defaultWrapper?.rearrangeIcons({
              root: true,
              force
            });
            return saveStorageItem(defaultWrapper.fsItem);
          } else {
            throw new Error('No fsItem found');
          }
        } else {
          let wrapper: ISymbolWrapper | undefined = symbolWrapper;
          if (id) {
            wrapper = module.get(id);
            if (wrapper instanceof FileSystemSymbolWrapper && wrapper.fsItem) {
              wrapper.rearrangeIcons({ force });
              return saveStorageItem(wrapper.fsItem);
            }
          }
        }
      }
    }
  ];
};
