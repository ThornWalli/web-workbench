<template>
  <button class="wb-disks-extras13-web-painting-icon-button">
    <component :is="icons[$props.name]" />
  </button>
</template>

<script setup lang="ts">
import SvgIconApply from '../assets/svg/icons/apply.svg?component';
import SvgIconCancel from '../assets/svg/icons/cancel.svg?component';
import SvgIconPicker from '../assets/svg/icons/picker.svg?component';

const $props = defineProps<{
  name: ICON | `${ICON}`;
}>();

const icons = {
  [ICON.APPLY]: SvgIconApply,
  [ICON.CANCEL]: SvgIconCancel,
  [ICON.PICKER]: SvgIconPicker
};
</script>

<script lang="ts">
export enum ICON {
  APPLY = 'apply',
  CANCEL = 'cancel',
  PICKER = 'picker'
}
</script>

<style lang="postcss" scoped>
.wb-disks-extras13-web-painting-icon-button {
  --color-background: var(
    --color-disks-web-painting-icon-button-background,
    #fff
  );
  --color-foreground: var(
    --color-disks-web-painting-icon-button-foreground,
    #000
  );
  --color-hover-background: var(
    --color-disks-web-painting-icon-button-hover-background,
    #fa5
  );
  --color-hover-foreground: var(
    --color-disks-web-painting-icon-button-hover-foreground,
    #000
  );

  .style-filled & {
    --color-background: var(
      --color-disks-web-painting-icon-button-filled-background,
      var(--color-disks-web-painting-icon-button-background, #fff)
    );
    --color-foreground: var(
      --color-disks-web-painting-icon-button-filled-foreground,
      var(--color-disks-web-painting-icon-button-foreground, #000)
    );
    --color-hover-background: var(
      --color-disks-web-painting-icon-button-filled-hover-background,
      var(--color-disks-web-painting-icon-button-hover-background, #fa5)
    );
    --color-hover-foreground: var(
      --color-disks-web-painting-icon-button-filled-hover-foreground,
      var(--color-disks-web-painting-icon-button-hover-foreground, #000)
    );
  }

  display: flex;
  align-items: center;
  justify-content: center;

  /* width: 20px;
  height: 20px; */
  padding: 4px;
  color: var(--color-foreground);
  appearance: none;
  cursor: pointer;
  background: var(--color-background);
  border: none;

  &:hover {
    color: var(--color-hover-foreground);
    background: var(--color-hover-background);
  }
}
</style>
