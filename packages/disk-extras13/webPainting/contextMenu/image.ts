import type { Model } from '../types';
import { defineMenuItems } from '@web-workbench/core/utils/menuItems';
import {
  MenuItemInteraction,
  MenuItemSeparator
} from '@web-workbench/core/classes/MenuItem';

import { IMAGE_OPERATION } from '../types/main';
import { TOOLS } from '../types/select';
import type { ImageOperationOptions } from '../lib/classes/tool/interaction/ImageOperation';

export default defineMenuItems<{ model: Model }>(options => {
  const { model } = options;

  return [
    new MenuItemInteraction({
      title: 'Image',
      items: [
        new MenuItemInteraction({
          title: 'Operation',
          items: [
            new MenuItemInteraction({
              title: 'Grayscale',
              action() {
                executeImageOperation(IMAGE_OPERATION.GRAYSCALE);
              }
            }),
            new MenuItemInteraction({
              title: 'Invert',
              action() {
                executeImageOperation(IMAGE_OPERATION.INVERT);
              }
            }),
            new MenuItemInteraction({
              title: 'Sepia',
              action() {
                executeImageOperation(IMAGE_OPERATION.SEPIA);
              }
            }),
            new MenuItemInteraction({
              title: 'Brightness',
              async action() {
                const value = await model.actions?.prompt({
                  type: 'number',
                  text: 'Adjust Brightness',
                  value: 0,
                  min: -100,
                  max: 100,
                  size: 4,
                  step: 1,
                  required: true
                });
                if (value !== undefined) {
                  executeImageOperation(IMAGE_OPERATION.BRIGHTNESS, {
                    value
                  });
                }
              }
            }),
            new MenuItemInteraction({
              title: 'Contrast',
              async action() {
                const value = await model.actions?.prompt({
                  type: 'number',
                  text: 'Adjust Contrast',
                  value: 0,
                  min: -100,
                  max: 100,
                  size: 4,
                  step: 1,
                  required: true
                });
                if (value !== undefined) {
                  executeImageOperation(IMAGE_OPERATION.CONTRAST, {
                    value
                  });
                }
              }
            }),
            new MenuItemInteraction({
              title: 'Saturation',
              async action() {
                const value = await model.actions?.prompt({
                  type: 'number',
                  text: 'Adjust Saturation',
                  value: 0,
                  min: -100,
                  max: 100,
                  size: 4,
                  step: 1,
                  required: true
                });
                if (value !== undefined) {
                  executeImageOperation(IMAGE_OPERATION.SATURATION, {
                    value
                  });
                }
              }
            }),
            new MenuItemInteraction({
              title: 'Sharpen',
              async action() {
                const value = await model.actions?.prompt({
                  type: 'number',
                  text: 'Sharpen',
                  value: 1,
                  min: -15,
                  max: 15,
                  size: 4,
                  step: 0.01,
                  required: true
                });
                if (value !== undefined) {
                  executeImageOperation(IMAGE_OPERATION.SHARPEN, {
                    value
                  });
                }
              }
            }),
            new MenuItemInteraction({
              title: 'Blur',
              async action() {
                const value = await model.actions?.prompt({
                  type: 'number',
                  text: 'Blur',
                  value: 1,
                  min: 0,
                  max: 15,
                  size: 4,
                  step: 0.01,
                  required: true
                });
                if (value !== undefined) {
                  executeImageOperation(IMAGE_OPERATION.BLUR, {
                    value
                  });
                }
              }
            }),
            new MenuItemInteraction({
              title: 'Emboss',
              async action() {
                const value = await model.actions?.prompt({
                  type: 'number',
                  text: 'Emboss',
                  value: 1,
                  min: -15,
                  max: 15,
                  size: 4,
                  step: 0.01,
                  required: true
                });
                if (value !== undefined) {
                  executeImageOperation(IMAGE_OPERATION.EMBOSS, {
                    value
                  });
                }
              }
            })
          ]
        }),
        new MenuItemSeparator(),
        new MenuItemInteraction({
          title: 'Resize…',
          action() {
            model.actions?.openResize();
          }
        }),
        new MenuItemInteraction({
          title: 'Resize Canvas…',
          action() {
            model.actions?.openResizeCanvas();
          }
        })
      ]
    })
  ].filter(Boolean);

  async function executeImageOperation<TOptions>(
    operation: IMAGE_OPERATION,
    options?: Omit<TOptions, 'type'>
  ) {
    await model.actions.useAbstractTool<ImageOperationOptions>(
      TOOLS.IMAGE_OPERATION,
      {
        type: operation,
        ...options
      }
    );
  }
});
