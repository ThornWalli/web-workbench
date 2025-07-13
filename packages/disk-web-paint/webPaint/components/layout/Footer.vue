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
import { computed, ref } from 'vue';
import useI18n from '../../composables/useI18n';
import type Core from '@web-workbench/core/classes/Core';
import type { Model } from '../../types';
import { BRUSH_MODE } from '../../types/select';

const { t } = useI18n();

const $props = defineProps<{
  core: Core;
  model: Model;
}>();

const items = ref([
  new MenuItemText({
    text: computed(() =>
      t('context_menu.dimension.text', {
        overrides: {
          x: $props.model.app.currentDocument?.meta.dimension.x,
          y: $props.model.app.currentDocument?.meta.dimension.y
        }
      })
    )
  }),

  new MenuItemSeparator(),
  new MenuItemText({
    options: {
      disabled: computed(() => !!preparedPosition.value)
    },
    text: computed(() =>
      t('context_menu.position.text', {
        overrides: {
          x: preparedPosition.value?.x ?? 'N',
          y: preparedPosition.value?.y ?? 'A'
        }
      })
    )
  }),
  new MenuItemSpacer(),
  new MenuItemInteraction({
    title: computed(() =>
      t('context_menu.brush_mode.title', {
        overrides: {
          mode: t(`brush_mode.${$props.model.app.options.select.brush?.mode}`)
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
    title: computed(() =>
      t('context_menu.zoom.title', {
        overrides: {
          zoom:
            $props.model.app.currentDisplay?.options.zoomLevel.toFixed(2) || 0
        }
      })
    ),
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
]);

const preparedPosition = computed(() => {
  const position = $props.model.app.currentTool?.currentEvent?.realPosition;
  if (
    position &&
    $props.model.app.currentDocument &&
    position.x > 0 &&
    position.y > 0 &&
    position.x <= $props.model.app.currentDocument.meta.dimension.x &&
    position.y <= $props.model.app.currentDocument.meta.dimension.y
  ) {
    return ipoint(() => Math.floor(position));
  }
  return undefined;
});
</script>

<style lang="postcss" scoped>
.wb-disks-extras13-web-paint-footer {
  & :deep(> .menu) {
    margin-left: 26px;
  }
}
</style>
