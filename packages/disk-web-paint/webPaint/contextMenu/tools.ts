import type { Model } from '../types';
import { defineMenuItems } from '@web-workbench/core/utils/menuItems';
import {
  MenuItemInteraction,
  MenuItemSeparator
} from '@web-workbench/core/classes/MenuItem';

import { computed } from 'vue';
import { BRUSH_MODE, BRUSH_TYPE, SHAPE_STYLE } from '../types/select';
import {
  getBrushSelectOptions,
  getToolSelectOptions
} from '../lib/utils/select';
import { INTERACTION_TYPE } from '@web-workbench/core/classes/MenuItem/Interaction';
import { KEYBOARD_CODE } from '@web-workbench/core/types/dom';
import type Event from '@web-workbench/core/classes/Event';
import useI18n from '../composables/useI18n';

export default defineMenuItems<{ model: Model }>(({ model }) => {
  const { t } = useI18n();

  const shapeTypeDescription = {
    [SHAPE_STYLE.STROKED]: {
      hotKey: {
        alt: true,
        code: KEYBOARD_CODE.KEY_S,
        title: 'S'
      },
      title: t(`shape_style.${SHAPE_STYLE.STROKED}`)
    },
    [SHAPE_STYLE.FILLED]: {
      hotKey: {
        alt: true,
        code: KEYBOARD_CODE.KEY_F,
        title: 'F'
      },
      title: t(`shape_style.${SHAPE_STYLE.FILLED}`)
    },
    [SHAPE_STYLE.STROKED_FILLED]: {
      hotKey: {
        shift: true,
        alt: true,
        code: KEYBOARD_CODE.KEY_F,
        title: 'F'
      },
      title: t(`shape_style.${SHAPE_STYLE.STROKED_FILLED}`)
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
      title: t('context_menu.tools.title'),
      items: [
        new MenuItemInteraction({
          title: t('context_menu.tools.items.select_tool.title', {
            overrides: {
              type: t(`tool.${model.app.options.select.tool.value || 'select'}`)
            }
          }),
          items: getToolSelectOptions({ app: model.app })
            .filter(item => !item.passive && !item.disabled)
            .map(item => {
              return new MenuItemInteraction({
                title: item.title,
                type: INTERACTION_TYPE.CUSTOM,
                hotKey: item.hotKey,
                options: {
                  checked: computed(() => {
                    return model.app.options.select.tool.value === item.value;
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
          title: computed(() =>
            t('context_menu.tools.items.brush_mode.title', {
              overrides: {
                mode: t(
                  `brush_mode.${model.app.options.select.brush?.mode || BRUSH_MODE.NORMAL}`
                )
              }
            })
          ),
          items: Object.values(BRUSH_MODE)
            .map(value => ({
              title: t(`brush_mode.${value}`),
              value
            }))
            .map(
              ({ title, value }) =>
                new MenuItemInteraction({
                  title,
                  type: INTERACTION_TYPE.CUSTOM,
                  value,
                  options: {
                    checked: computed(
                      () => model.app.options.select.brush?.mode === value
                    )
                  },
                  action: () => {
                    model.app.setSelectOptions('brush', {
                      ...model.app.options.select.brush,
                      mode: value
                    });
                  }
                })
            )
        }),

        new MenuItemInteraction({
          title: computed(() => {
            return t(`context_menu.tools.items.brush_type.title`, {
              overrides: {
                type: t(
                  `brush_type.${model.app.options.select.brush?.type || BRUSH_TYPE.CIRCLE}`
                )
              }
            });
          }),
          items: Object.values(BRUSH_TYPE).map(type => {
            return new MenuItemInteraction({
              type: INTERACTION_TYPE.CUSTOM,
              title: t(`brush_type.${type}`),
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
          title: computed(() =>
            t('context_menu.tools.items.brush_size.title', {
              overrides: {
                size: model.app.options.select.brush?.size
              }
            })
          ),
          items: [
            new MenuItemInteraction({
              title: t(
                'context_menu.tools.items.brush_size.items.set_custom.title'
              ),
              async action() {
                const size =
                  (
                    await (
                      await model.actions.openValueInput({
                        text: t(
                          'context_menu.tools.items.brush_size.items.set_custom.text'
                        ),
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

        new MenuItemInteraction({
          title: computed(() =>
            t('context_menu.tools.items.dotted_gap.title', {
              overrides: {
                gap: model.app.options.select.tool.dottedGap
              }
            })
          ),
          async action() {
            const gap =
              (
                await await model.actions.prompt<number>({
                  text: t(
                    'context_menu.tools.items.dotted_gap.items.set_custom.text'
                  ),
                  value: model.app.options.select.tool.dottedGap || 0,
                  type: 'number',
                  min: 0,
                  step: 1
                })
              )?.value || 1;
            model.app.setSelectOptions('tool', {
              ...model.app.options.select.tool!,
              dottedGap: gap
            });
          }
        }),
        new MenuItemSeparator(),
        new MenuItemInteraction({
          title: computed(() =>
            t('context_menu.tools.items.segment_length.title', {
              overrides: {
                length: model.app.options.select.tool.segmentLength
              }
            })
          ),
          items: [
            new MenuItemInteraction({
              title: t(
                'context_menu.tools.items.segment_length.items.set_custom.title'
              ),
              async action({ closeContextMenu }) {
                closeContextMenu();
                const length =
                  (
                    await await model.actions.prompt<number>({
                      text: t(
                        'context_menu.tools.items.segment_length.items.set_custom.text'
                      ),
                      value: model.app.options.select.tool.segmentLength || 1,
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
                    () => model.app.options.select.tool.segmentLength === length
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
          title: computed(() =>
            t('context_menu.tools.items.gap_length.title', {
              overrides: {
                length: model.app.options.select.tool.gapLength
              }
            })
          ),
          items: [
            new MenuItemInteraction({
              title: t(
                'context_menu.tools.items.gap_length.items.set_custom.title'
              ),
              async action() {
                const length =
                  (
                    await await model.actions.prompt<number>({
                      text: t(
                        'context_menu.tools.items.gap_length.items.set_custom.text'
                      ),
                      value: model.app.options.select.tool.gapLength || 0,
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
                    () => model.app.options.select.tool.gapLength === length
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
          title: computed(() =>
            t('context_menu.tools.items.air_brush_strength.title', {
              overrides: {
                strength: model.app.options.select.tool.airBrushStrength
              }
            })
          ),
          async action() {
            const strength =
              (
                await await model.actions.prompt<number>({
                  text: t('context_menu.tools.items.air_brush_strength.text'),
                  value: model.app.options.select.tool.airBrushStrength || 0,
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
          title: computed(() =>
            t('context_menu.tools.items.air_brush_weight.title', {
              overrides: {
                weight: model.app.options.select.tool.airBrushWeight
              }
            })
          ),
          async action() {
            const weight =
              (
                await await model.actions.prompt<number>({
                  text: t('context_menu.tools.items.air_brush_weight.text'),
                  value: model.app.options.select.tool.airBrushWeight || 0,
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
          title: t('context_menu.tools.items.interpolate_segments.title'),
          model: model.app.options.select.tool!,
          type: INTERACTION_TYPE.CUSTOM,
          options: {
            checked: computed(
              () => model.app.options.select.tool.interpolateSegments
            )
          },
          action() {
            model.app.setSelectOptions('tool', {
              ...model.app.options.select.tool!,
              interpolateSegments:
                !model.app.options.select.tool.interpolateSegments
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
                return model.app.options.select.tool.shapeStyle === style;
              })
            },
            action() {
              model.app.setSelectOptions('tool', {
                ...model.app.options.select.tool!,
                shapeStyle: style
              });
            }
          });
        })
      ]
    })
  ].filter(Boolean);
});
