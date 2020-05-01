import { ArgumentInfo } from '../../Command';
import { saveStorageItem } from '../../../utils/fileSystem';

export default ({ module, core }) => {
  return [
    {
      name: [
        'rearrangeIcons'
      ],
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
      action ({ id, root }) {
        const defaultWrapper = module.getDefaultWrapper();
        const symbolWrapper = module.getPrimaryWrapper();
        if (root) {
          defaultWrapper.rearrangeIcons({
            root: true
          });
          return saveStorageItem((defaultWrapper).fsItem);
        } else {
          let wrapper = symbolWrapper;
          if (id) {
            wrapper = module.get(id);
          }
          wrapper.rearrangeIcons();
          return saveStorageItem((wrapper).fsItem);
        }
      }
    }

  ];
};
