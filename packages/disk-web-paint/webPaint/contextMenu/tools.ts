import type { Model } from '../types';
import { defineMenuItems } from '@web-workbench/core/utils/menuItems';
import {
  MenuItemInteraction,
  MenuItemSeparator
} from '@web-workbench/core/classes/MenuItem';

import { computed } from 'vue';
import { BRUSH_TYPE, SHAPE_STYLE } from '../types/select';
import {
  getBrushSelectOptions,
  getToolSelectOptions
} from '../lib/utils/select';
import { INTERACTION_TYPE } from '@web-workbench/core/classes/MenuItem/Interaction';
import { KEYBOARD_CODE } from '@web-workbench/core/types/dom';
import type Event from '@web-workbench/core/classes/Event';

export default defineMenuItems<{ model: Model }>(({ model }) => {
  const brushTypeTitle = {
    [BRUSH_TYPE.CIRCLE]: 'Circle',
    [BRUSH_TYPE.SQUARE]: 'Square',
    [BRUSH_TYPE.DOTS]: 'Dots'
  };
  const shapeTypeDescription = {
    [SHAPE_STYLE.STROKED]: {
      hotKey: {
        code: KEYBOARD_CODE.KEY_S,
        title: 'S'
      },
      title: 'Stroke'
    },
    [SHAPE_STYLE.FILLED]: {
      hotKey: {
        code: KEYBOARD_CODE.KEY_F,
        title: 'F'
      },
      title: 'Filled'
    },
    [SHAPE_STYLE.STROKED_FILLED]: {
      hotKey: {
        shift: true,
        code: KEYBOARD_CODE.KEY_F,
        title: 'F'
      },
      title: 'Stroke & Filled'
    }
  };

  const brushOptionsSizes = getBrushSelectOptions().reduce(
    (result, item) => {
      result[item.value.type] = result[item.value.type] || [];
      result[item.value.type].push(item.value.size);
      return result;
    },
    {} as Record<BRUSH_TYPE, number[]>
  );

  const sizes = Array(8).fill(undefined).concat(12, 16, 20, 24, 32, 48, 64);

  return [
    new MenuItemInteraction({
      title: 'Tools',
      items: [
        new MenuItemInteraction({
          title: 'Select Tool',
          items: getToolSelectOptions({})
            .filter(item => !item.passive && !item.disabled)
            .map(item => {
              return new MenuItemInteraction({
                title: item.title,
                type: INTERACTION_TYPE.CUSTOM,
                hotKey: item.hotKey,
                options: {
                  checked: computed(() => {
                    return model.app.options.select.tool?.value === item.value;
                  })
                },
                action() {
                  model.app.setSelectOptions(
                    'tool',
                    {
                      ...item,
                      segmentLength: 1,
                      gapLength: 0
                    },
                    true
                  );
                }
              });
            })
        }),
        new MenuItemInteraction({
          title: computed(() => {
            return `Brush Type (${brushTypeTitle[model.app.options.select.brush?.type || BRUSH_TYPE.CIRCLE]})`;
          }),
          items: Object.values(BRUSH_TYPE).map(type => {
            return new MenuItemInteraction({
              type: INTERACTION_TYPE.CUSTOM,
              title: brushTypeTitle[type],
              options: {
                checked: computed(
                  () => model.app.options.select.brush?.type === type
                )
              },
              value: type,
              action() {
                model.app.setSelectOptions('brush', {
                  ...model.app.options.select.brush!,
                  type
                });
              }
            });
          })
        }),
        new MenuItemInteraction({
          title: computed(
            () => `Brush Size (${model.app.options.select.brush?.size}px)`
          ),
          items: [
            new MenuItemInteraction({
              title: 'Set custom…',
              async action() {
                const size =
                  (
                    await (
                      await model.actions.openValueInput({
                        text: 'Set custom brush size',
                        value: model.app.options.select.brush?.size || 1,
                        type: 'number',
                        min: 1
                      })
                    ).awaitClose<Event<number>>()
                  )?.value || 1;
                model.app.setSelectOptions('brush', {
                  ...model.app.options.select.brush!,
                  size
                });
              }
            }),
            new MenuItemSeparator(),
            ...sizes.map((_, index) => {
              const size = _ || index + 1;
              return new MenuItemInteraction({
                type: INTERACTION_TYPE.CUSTOM,
                title: computed(
                  () =>
                    `${size}px ${brushOptionsSizes[model.app.options.select.brush!.type].includes(size) ? '*' : ''}`
                ),
                options: {
                  checked: computed(
                    () => model.app.options.select.brush?.size === size
                  )
                },
                value: size,
                action() {
                  model.app.setSelectOptions('brush', {
                    ...model.app.options.select.brush!,
                    size
                  });
                }
              });
            })
          ]
        }),
        new MenuItemSeparator(),
        new MenuItemInteraction({
          title: computed(
            () =>
              `Segment Length (${model.app.options.select.tool?.segmentLength}px)`
          ),
          items: [
            new MenuItemInteraction({
              title: 'Set custom…',
              async action({ closeContextMenu }) {
                closeContextMenu();
                const length =
                  (
                    await await model.actions.prompt<number>({
                      text: 'Set custom segment length',
                      value: model.app.options.select.tool?.segmentLength || 1,
                      type: 'number',
                      min: 1
                    })
                  )?.value || 1;
                model.app.setSelectOptions('tool', {
                  ...model.app.options.select.tool!,
                  segmentLength: length
                });
              }
            }),
            new MenuItemSeparator(),
            ...[1, 2, 4, 8, 12, 16, 20].map((_, index) => {
              const length = _ || index;
              return new MenuItemInteraction({
                type: INTERACTION_TYPE.CUSTOM,
                title: computed(() => `${length}px`),
                options: {
                  checked: computed(
                    () =>
                      model.app.options.select.tool?.segmentLength === length
                  )
                },
                value: length,
                action() {
                  model.app.setSelectOptions('tool', {
                    ...model.app.options.select.tool!,
                    segmentLength: length
                  });
                }
              });
            })
          ]
        }),
        new MenuItemInteraction({
          title: computed(
            () => `Gap Length (${model.app.options.select.tool?.gapLength}px)`
          ),
          items: [
            new MenuItemInteraction({
              title: 'Set custom…',
              async action() {
                const length =
                  (
                    await await model.actions.prompt<number>({
                      text: 'Set custom gap length',
                      value: model.app.options.select.tool?.gapLength || 0,
                      type: 'number',
                      min: 0
                    })
                  ).value || 1;
                model.app.setSelectOptions('tool', {
                  ...model.app.options.select.tool!,
                  gapLength: length
                });
              }
            }),
            new MenuItemSeparator(),
            ...[0, 1, 2, 4, 8, 12, 16, 20].map((_, index) => {
              const length = _ || index;
              return new MenuItemInteraction({
                type: INTERACTION_TYPE.CUSTOM,
                title: computed(() => `${length}px`),
                options: {
                  checked: computed(
                    () => model.app.options.select.tool?.gapLength === length
                  )
                },
                value: length,
                action() {
                  model.app.setSelectOptions('tool', {
                    ...model.app.options.select.tool!,
                    gapLength: length
                  });
                }
              });
            })
          ]
        }),
        new MenuItemInteraction({
          title: 'AirBrush strength…',
          async action() {
            const strength =
              (
                await await model.actions.prompt<number>({
                  text: 'Set custom AirBrush strength (1 - 1000)',
                  value: model.app.options.select.tool?.airBrushStrength || 0,
                  type: 'number',
                  min: 1,
                  step: 1,
                  max: 1000
                })
              )?.value || 1;
            model.app.setSelectOptions('tool', {
              ...model.app.options.select.tool!,
              airBrushStrength: strength
            });
          }
        }),
        new MenuItemInteraction({
          title: 'AirBrush weight…',
          async action() {
            const weight =
              (
                await await model.actions.prompt<number>({
                  text: 'Set custom AirBrush weight (0.01 - 1)',
                  value: model.app.options.select.tool?.airBrushWeight || 0,
                  type: 'number',
                  min: 0.01,
                  step: 0.01,
                  max: 1
                })
              )?.value || 1;
            model.app.setSelectOptions('tool', {
              ...model.app.options.select.tool!,
              airBrushWeight: weight
            });
          }
        }),
        new MenuItemInteraction({
          title: computed(() => `Interpolate Segments`),
          type: INTERACTION_TYPE.CUSTOM,
          options: {
            checked: computed(
              () => model.app.options.select.tool?.interpolateSegments
            )
          },
          action() {
            model.app.setSelectOptions('tool', {
              ...model.app.options.select.tool!,
              interpolateSegments:
                !model.app.options.select.tool?.interpolateSegments
            });
          }
        }),
        new MenuItemSeparator(),
        ...Object.values(SHAPE_STYLE).map(style => {
          return new MenuItemInteraction<`${SHAPE_STYLE}`>({
            title: shapeTypeDescription[style].title,
            model: model.app.options.select.tool!,
            name: style,
            hotKey: shapeTypeDescription[style].hotKey,
            type: INTERACTION_TYPE.CUSTOM,
            options: {
              checked: computed(() => {
                return model.app.options.select.tool?.shapeStyle === style;
              })
            },
            action() {
              model.app.setSelectOptions('tool', {
                ...model.app.options.select.tool!,
                shapeStyle: style
              });
            }
          });
        }),
        new MenuItemSeparator()
      ]
    })
  ].filter(Boolean);
});
