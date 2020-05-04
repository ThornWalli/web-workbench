<template>
  <span
    class="wb-disks-mooncity-atoms-header-field"
    :style="style"
  >
    <span>{{ label }}:</span><span class="value">{{ value }}</span>
  </span>
</template>

<script>

import { COLORS } from '@/web-workbench/disks/mooncity/utils';

export default {
  props: {
    label: { type: String, default: null },
    labelColor: { type: String, default: 'gray' },
    value: { type: String, default: null }
  },
  computed: {
    style () {
      return {
        '--label-color': COLORS[String(this.labelColor)]
      };
    }
  }
};
</script>

<style lang="postcss">
.wb-disks-mooncity-atoms-header-field {
  --label-color: #fff;

  display: block;
  padding: 2px;
  font-size: 10px;
  line-height: 10px;
  background: none;
  border: none;

  & > span {
    display: inline-block;
    line-height: 10px;

    &:first-child {
      color: var(--label-color);
    }
  }

  & > .value {
    color: var(--mooncity__color__gray);
  }
}
</style>
