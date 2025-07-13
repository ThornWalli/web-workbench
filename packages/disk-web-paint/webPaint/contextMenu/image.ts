import type { Model } from '../types';
import { defineMenuItems } from '@web-workbench/core/utils/menuItems';
import {
  MenuItemInteraction,
  MenuItemSeparator
} from '@web-workbench/core/classes/MenuItem';
import { IMAGE_OPERATION } from '../types/worker/main';
import { TOOL } from '../types/select';
import type { ImageOperationOptions } from '../lib/classes/tool/interaction/abstract/ImageOperation';
import { KEYBOARD_CODE } from '@web-workbench/core/types/dom';
import type Event from '@web-workbench/core/classes/Event';
import { RotateType, FlipType } from '@web-workbench/wasm/pkg/wasm';
import useI18n from '../composables/useI18n';

export default defineMenuItems<{ model: Model }>(options => {
  const { model } = options;

  const { t } = useI18n();

  return [
    new MenuItemInteraction({
      title: t('context_menu.image.title'),
      items: [
        new MenuItemInteraction({
          title: t('context_menu.image.items.rotate.title'),
          items: [
            new MenuItemInteraction({
              title: t('context_menu.image.items.rotate.items.rotate_90.title'),
              hotKey: {
                alt: true,
                code: KEYBOARD_CODE.KEY_R,
                title: 'R'
              },
              action() {
                executeImageOperation(IMAGE_OPERATION.ROTATE, {
                  value: RotateType.Rotate90Degrees
                });
              }
            }),
            new MenuItemInteraction({
              title: t(
                'context_menu.image.items.rotate.items.rotate_180.title'
              ),
              action() {
                executeImageOperation(IMAGE_OPERATION.ROTATE, {
                  value: RotateType.Rotate180Degrees
                });
              }
            }),
            new MenuItemInteraction({
              title: t(
                'context_menu.image.items.rotate.items.rotate_270.title'
              ),
              action() {
                executeImageOperation(IMAGE_OPERATION.ROTATE, {
                  value: RotateType.Rotate270Degrees
                });
              }
            })
          ]
        }),
        new MenuItemInteraction({
          title: t('context_menu.image.items.flip.title'),
          items: [
            new MenuItemInteraction({
              title: t('context_menu.image.items.flip.items.horizontal.title'),
              action() {
                executeImageOperation(IMAGE_OPERATION.FLIP, {
                  value: FlipType.Horizontal
                });
              }
            }),
            new MenuItemInteraction({
              title: t('context_menu.image.items.flip.items.vertical.title'),
              action() {
                executeImageOperation(IMAGE_OPERATION.FLIP, {
                  value: FlipType.Vertical
                });
              }
            })
          ]
        }),
        new MenuItemSeparator(),
        new MenuItemInteraction({
          title: t('context_menu.image.items.operation.title'),
          items: [
            new MenuItemInteraction({
              title: t('context_menu.image.items.operation.items.invert.title'),
              action() {
                executeImageOperation(IMAGE_OPERATION.INVERT);
              }
            }),
            new MenuItemInteraction({
              title: t(
                'context_menu.image.items.operation.items.grayscale.title'
              ),
              action() {
                executeImageOperation(IMAGE_OPERATION.GRAYSCALE);
              }
            }),
            new MenuItemInteraction({
              title: t('context_menu.image.items.operation.items.sepia.title'),
              action() {
                executeImageOperation(IMAGE_OPERATION.SEPIA);
              }
            }),
            new MenuItemInteraction({
              title: t(
                'context_menu.image.items.operation.items.brightness.title'
              ),
              async action() {
                const value = (
                  await model.actions?.prompt({
                    type: 'number',
                    text: t(
                      'context_menu.image.items.operation.items.brightness.text'
                    ),
                    value: 0,
                    min: -100,
                    max: 100,
                    size: 4,
                    step: 1,
                    required: true
                  })
                )?.value;
                if (value !== undefined) {
                  executeImageOperation(IMAGE_OPERATION.BRIGHTNESS, {
                    value
                  });
                }
              }
            }),
            new MenuItemInteraction({
              title: t(
                'context_menu.image.items.operation.items.contrast.title'
              ),
              async action() {
                const value = (
                  await model.actions?.prompt({
                    type: 'number',
                    text: t(
                      'context_menu.image.items.operation.items.contrast.text'
                    ),
                    value: 0,
                    size: 4,
                    step: 1,
                    required: true
                  })
                )?.value;
                if (value !== undefined) {
                  executeImageOperation(IMAGE_OPERATION.CONTRAST, {
                    value
                  });
                }
              }
            }),
            new MenuItemInteraction({
              title: t(
                'context_menu.image.items.operation.items.saturation.title'
              ),
              async action() {
                const value = (
                  await model.actions?.prompt({
                    type: 'number',
                    text: t(
                      'context_menu.image.items.operation.items.saturation.text'
                    ),
                    value: 0,
                    min: -100,
                    max: 100,
                    size: 4,
                    step: 1,
                    required: true
                  })
                )?.value;
                if (value !== undefined) {
                  executeImageOperation(IMAGE_OPERATION.SATURATION, {
                    value
                  });
                }
              }
            }),
            new MenuItemInteraction({
              title: t(
                'context_menu.image.items.operation.items.sharpen.title'
              ),
              async action() {
                const value = (
                  await (
                    await model.actions.openImageSharpness()
                  ).awaitClose<Event<{ radius: number; threshold: number }>>()
                ).value;
                if (value) {
                  const { radius, threshold } = value;
                  executeImageOperation(IMAGE_OPERATION.SHARPEN, {
                    radius,
                    threshold
                  });
                }
                //   await model.actions?.prompt({
                //     type: 'number',
                //     text: 'Adjust Saturation <br>-100% to 100%',
                //     value: 0,
                //     min: -100,
                //     max: 100,
                //     size: 4,
                //     step: 1,
                //     required: true
                //   })
                // )?.value;
                // if (value !== undefined) {
                //   executeImageOperation(IMAGE_OPERATION.SHARPEN, {
                //     value
                //   });
                // }
              }
            }),
            new MenuItemInteraction({
              title: t('context_menu.image.items.operation.items.blur.title'),
              async action() {
                const value = (
                  await model.actions?.prompt({
                    type: 'number',
                    text: t(
                      'context_menu.image.items.operation.items.blur.text'
                    ),
                    value: 0,
                    min: 0,
                    size: 4,
                    step: 1,
                    required: true
                  })
                )?.value;
                if (value !== undefined) {
                  executeImageOperation(IMAGE_OPERATION.BLUR, {
                    value
                  });
                }
              }
            }),
            new MenuItemInteraction({
              title: t('context_menu.image.items.operation.items.emboss.title'),
              async action() {
                const value = (
                  await model.actions?.prompt({
                    type: 'number',
                    text: t(
                      'context_menu.image.items.operation.items.emboss.text'
                    ),
                    value: 0,
                    min: -100,
                    max: 100,
                    size: 4,
                    step: 1,
                    required: true
                  })
                )?.value;
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
          title: t('context_menu.image.items.operation.items.resize.title'),
          hotKey: {
            ctrl: true,
            code: KEYBOARD_CODE.KEY_R,
            title: 'R'
          },
          action() {
            model.actions?.openDocumentResize();
          }
        }),
        new MenuItemInteraction({
          title: t(
            'context_menu.image.items.operation.items.resize_canvas.title'
          ),
          hotKey: {
            ctrl: true,
            alt: true,
            code: KEYBOARD_CODE.KEY_R,
            title: 'R'
          },
          action() {
            model.actions?.openDocumentResizeCanvas();
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
      TOOL.IMAGE_OPERATION,
      {
        type: operation,
        ...options
      }
    );
  }
});
