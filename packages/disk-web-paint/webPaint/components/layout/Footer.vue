<template>
  <wb-env-fragment-footer
    class="wb-disks-extras13-web-paint-footer"
    :items="items"
    :parent-layout="core.modules.windows!.contentWrapper.layout" />
</template>

<script lang="ts" setup>
import {
  MenuItemInteraction,
  MenuItemSeparator,
  MenuItemSpacer,
  MenuItemText
} from '@web-workbench/core/classes/MenuItem';
import WbEnvFragmentFooter from '@web-workbench/core/components/fragments/Footer.vue';
import { ipoint } from '@js-basics/vector';
import { INTERACTION_TYPE } from '@web-workbench/core/classes/MenuItem/Interaction';
import { computed } from 'vue';
import useI18n from '../../composables/useI18n';
import type Core from '@web-workbench/core/classes/Core';
import type { Model } from '../../types';
import { BLEND_MODE, BRUSH_MODE } from '../../types/select';
import { precisionNumber } from '../../utils/number';

const { t } = useI18n();

const $props = defineProps<{
  core: Core;
  model: Model;
  layerOverviewVisible: boolean;
}>();

const $emit = defineEmits<{
  (e: 'toggle-layers-overview'): void;
}>();

const items = computed(() => {
  const layer = $props.model.app.state.layers.find(
    layer => layer.id === $props.model.app.state.currentLayerId
  );

  return [
    new MenuItemInteraction({
      key: 'menuitem-layers',
      title: t('context_menu.layers.title', {
        overrides: {
          name: layer ? `#${layer.order}` : 'N/A'
        }
      }),
      action: () => {
        $emit('toggle-layers-overview');
      },
      items: [
        ...$props.model.app.state.layers.map(layer => {
          return new MenuItemInteraction({
            key: `menuitem-layer-${layer.id}`,
            title: `#${layer.order} ${layer.name}`,
            type: INTERACTION_TYPE.CUSTOM,
            value: layer.id,
            options: {
              checked: layer.id === $props.model.app.state.currentLayerId
            },
            action: () => {
              $props.model.app.actions.selectLayer(layer.id);
            },
            items: [
              new MenuItemInteraction({
                key: `menuitem-layer-visible-${layer.id}`,
                type: INTERACTION_TYPE.CUSTOM,
                title: t('context_menu.layers.items.visible.title'),
                action: () => {
                  $props.model.app.actions.updateLayer(layer.id, {
                    visible: !layer.visible
                  });
                },
                options: {
                  checked: layer.visible
                }
              }),
              new MenuItemSeparator(),

              new MenuItemInteraction({
                key: 'menuitem-layer-blend-mode',
                title: t('context_menu.layers.items.blend_mode.title', {
                  overrides: {
                    mode: t(`blend_mode.${layer.blendMode}`)
                  }
                }),
                items: Object.values(BLEND_MODE)
                  .map(value => ({
                    title: t(`blend_mode.${value}`),
                    value
                  }))
                  .map(
                    ({ title, value }) =>
                      new MenuItemInteraction({
                        key: `menuitem-layer-blend-mode-${value}`,
                        title,
                        type: INTERACTION_TYPE.CUSTOM,
                        value,
                        options: {
                          checked: layer.blendMode === value
                        },
                        action: () => {
                          $props.model.app.actions.updateLayer(layer.id, {
                            blendMode: value
                          });
                        }
                      })
                  )
              }),
              new MenuItemSeparator(),
              new MenuItemInteraction({
                key: 'menuitem-layer-move-up',
                title: t('context_menu.layers.items.move_up.title'),
                action: () => {
                  const layers = $props.model.app.state.layers;
                  const prevLayer = layers.find(
                    l => l.order === layer.order - 1 && l.id !== layer.id
                  );
                  const lastOrder = layer.order;
                  if (prevLayer) {
                    layer.order = prevLayer.order;
                    prevLayer.order = lastOrder;
                  }
                  layers.sort((a, b) => a.order - b.order);
                  $props.model.app.actions.moveLayers(layers);
                },
                options: {
                  disabled:
                    $props.model.app.state.layers.length <= 1 ||
                    $props.model.app.state.layers.indexOf(layer) === 0
                }
              }),
              new MenuItemInteraction({
                key: 'menuitem-layer-move-down',
                title: t('context_menu.layers.items.move_down.title'),
                action: () => {
                  const layers = $props.model.app.state.layers;
                  const nextLayer = layers.find(
                    l => l.order === layer.order + 1 && l.id !== layer.id
                  );
                  const lastOrder = layer.order;
                  if (nextLayer) {
                    layer.order = nextLayer.order;
                    nextLayer.order = lastOrder;
                  }
                  layers.sort((a, b) => a.order - b.order);
                  $props.model.app.actions.moveLayers(layers);
                },
                options: {
                  disabled:
                    $props.model.app.state.layers.length <= 1 ||
                    $props.model.app.state.layers.indexOf(layer) ===
                      $props.model.app.state.layers.length - 1
                }
              }),
              new MenuItemSeparator(),
              new MenuItemInteraction({
                key: 'menuitem-layer-rename',
                title: t('context_menu.layers.items.rename.title'),
                action: async () => {
                  const { value: name } = await $props.model.actions.prompt({
                    text: t('context_menu.layers.items.rename.text'),
                    type: 'text',
                    value: layer.name
                  });
                  if (name) {
                    $props.model.app.actions.updateLayer(layer.id, { name });
                  }
                }
              }),
              new MenuItemInteraction({
                key: 'menuitem-layer-remove',
                title: t('context_menu.layers.items.remove.title'),
                action: () => {
                  $props.model.app.actions.removeLayer(layer.id);
                },
                options: {
                  disabled: $props.model.app.state.layers.length <= 1
                }
              }),
              new MenuItemInteraction({
                key: 'menuitem-layer-duplicate',
                title: t('context_menu.layers.items.duplicate.title'),
                action: () => {
                  $props.model.app.actions.duplicateLayer(layer.id);
                }
              }),
              new MenuItemInteraction({
                key: 'menuitem-layer-merge',
                title: t('context_menu.layers.items.merge.title'),
                action: () => {
                  $props.model.app.actions.mergeLayers([layer.id]);
                },
                options: {
                  disabled: layer.id === $props.model.app.state.currentLayerId
                }
              }),
              new MenuItemInteraction({
                key: 'menuitem-layer-opacity',
                title: t('context_menu.layers.items.opacity.title', {
                  overrides: {
                    opacity: Math.round(layer.opacity * 100)
                  }
                }),
                action: async () => {
                  const { value: opacity } = await $props.model.actions.prompt({
                    text: t('context_menu.layers.items.opacity.text'),
                    value: layer.opacity * 100,
                    type: 'number',
                    min: 0,
                    max: 100,
                    step: 1
                  });
                  if (opacity) {
                    $props.model.app.actions.updateLayer(layer.id, {
                      opacity: precisionNumber(opacity / 100, 2)
                    });
                  }
                }
              })
            ]
          });
        }),
        new MenuItemSeparator(),

        new MenuItemInteraction({
          key: 'menuitem-add-layer',
          title: t('context_menu.layers.items.add.title'),
          action: () => {
            $props.model.app.actions.addLayer({
              name: t('context_menu.layers.items.add.default_name'),
              dimension: $props.model.app.currentDocument?.meta.dimension
            });
          }
        }),
        new MenuItemInteraction({
          key: 'menuitem-duplicate-layer',
          title: t('context_menu.layers.items.remove.title'),
          action: () => {
            $props.model.app.actions.removeLayer(
              $props.model.app.state.currentLayerId ?? ''
            );
          },
          options: {
            disabled:
              $props.model.app.state.layers.length <= 1 ||
              !$props.model.app.state.currentLayerId
          }
        }),
        new MenuItemSeparator(),

        new MenuItemInteraction({
          key: `menuitem-visible-layer-overview`,
          type: INTERACTION_TYPE.CUSTOM,
          title: t('context_menu.layers.items.visible_layer_overview.title'),
          action: () => {
            $emit('toggle-layers-overview');
          },
          options: {
            checked: $props.layerOverviewVisible
          }
        })
      ]
    }),
    new MenuItemText({
      key: 'menuitem-document-name',
      text: t('context_menu.dimension.text', {
        overrides: {
          x: $props.model.app.currentDocument?.meta.dimension.x,
          y: $props.model.app.currentDocument?.meta.dimension.y
        }
      })
    }),

    new MenuItemSpacer(),
    new MenuItemInteraction({
      key: 'menuitem-brush-mode',
      title: t('context_menu.brush_mode.title', {
        overrides: {
          mode: t(`brush_mode.${$props.model.app.options.select.brush?.mode}`)
        }
      }),
      items: Object.values(BRUSH_MODE)
        .map(value => ({
          title: t(`brush_mode.${value}`),
          value
        }))
        .map(
          ({ title, value }) =>
            new MenuItemInteraction({
              key: `menuitem-brush-mode-${value}`,
              title,
              type: INTERACTION_TYPE.CUSTOM,
              value,
              options: {
                checked: $props.model.app.options.select.brush?.mode === value
              },
              action: () => {
                $props.model.app.setSelectOptions('brush', {
                  ...$props.model.app.options.select.brush,
                  mode: value
                });
              }
            })
        )
    }),
    new MenuItemSeparator(),
    new MenuItemInteraction({
      key: 'menuitem-zoom-mode',
      title: t('context_menu.zoom.title', {
        overrides: {
          zoom:
            $props.model.app.currentDisplay?.options.zoomLevel.toFixed(2) || 0
        }
      }),
      items: [
        new MenuItemInteraction({
          title: t('context_menu.zoom.items.set_zoom.title'),
          async action() {
            const { value: zoomLevel } = await $props.model.actions.prompt({
              text: t('context_menu.zoom.items.set_zoom.text'),
              value:
                $props.model.app.currentDisplay?.options.zoomLevel.toFixed(2),
              type: 'number',
              min: 0.1,
              step: 0.01
            });
            if (zoomLevel) {
              $props.model.app.currentDisplay?.actions.setZoom(
                ipoint(0, 0),
                parseFloat(zoomLevel),
                true
              );
            }
          }
        }),
        new MenuItemInteraction({
          title: t('context_menu.zoom.items.fit.title'),
          action: () => {
            $props.model.app.currentDisplay?.actions.fitZoom();
          }
        }),
        new MenuItemSeparator(),
        new MenuItemInteraction({
          title: t('context_menu.zoom.items.reset.title'),
          action: () => {
            $props.model.app.currentDisplay?.actions.setZoom(ipoint(0, 0), 0);
          }
        })
      ]
    })
  ];
});

// const preparedPosition = computed(() => {
//   const position = $props.model.app.currentTool?.currentEvent?.realPosition;
//   if (
//     position &&
//     $props.model.app.currentDocument &&
//     position.x > 0 &&
//     position.y > 0 &&
//     position.x <= $props.model.app.currentDocument.meta.dimension.x &&
//     position.y <= $props.model.app.currentDocument.meta.dimension.y
//   ) {
//     return ipoint(() => Math.floor(position));
//   }
//   return undefined;
// });
</script>

<style lang="postcss" scoped>
.wb-disks-extras13-web-paint-footer {
  & :deep(> .menu) {
    margin-left: 26px;
  }
}
</style>
