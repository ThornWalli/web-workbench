import { MENU_ITEM_TYPE } from '@web-workbench/core/classes/MenuItem';
import {
  FONT_FAMILES,
  FONT_SIZES,
  FONT_TYPES,
  PROPERTY,
  getDefaultDocumentModel
} from '../documentEditor/index';
import WbDocumentReaderInfo from './components/Info';

export default ({ core, model }) => {
  const { windows } = core.modules;

  return [
    {
      title: 'Document Reader',
      items: [
        {
          title: 'Open…',
          hotKey: 'O',
          keyCode: 79,
          action: actionOpen
        },
        {
          type: MENU_ITEM_TYPE.SEPARATOR
        },
        {
          hotKey: 'I',
          keyCode: 73,
          title: 'Info',
          action: actionInfo
        }
      ]
    },
    {
      title: 'Font Family',
      items: Object.keys(FONT_FAMILES).map(type => {
        const typeFonts = FONT_FAMILES[String(type)];
        return {
          title: FONT_TYPES[String(type)],
          items: Object.keys(typeFonts).map(title => {
            const value = typeFonts[String(title)];
            return {
              title,
              type: MENU_ITEM_TYPE.RADIO,
              name: PROPERTY.FONT_FAMILY,
              value,
              model: model.value
            };
          })
        };
      })
    },
    {
      title: 'Font Size',
      items: FONT_SIZES.map(value => {
        return {
          title: `${value}px`,
          type: MENU_ITEM_TYPE.RADIO,
          name: PROPERTY.FONT_SIZE,
          value,
          model: model.value
        };
      })
    }
  ];

  async function actionOpen() {
    const data = await core.executeCommand('openFileDialog');
    if (data) {
      if ('content' in data.value) {
        model.fsItem = data.fsItem;
        model.value = Object.assign(
          model.value,
          getDefaultDocumentModel(),
          data.value
        );
      } else {
        throw new Error("Can't read file content");
      }
    }
  }

  function actionInfo() {
    windows.addWindow(
      {
        title: 'Info',
        component: WbDocumentReaderInfo,
        componentData: {
          model
        },
        options: {
          scaleX: false,
          scaleY: false,
          prompt: false,
          scrollX: false,
          scrollY: false
        }
      },
      {
        group: 'workbench13DocumentReader'
      }
    );
  }
};
