<template>
  <div class="wb-disks-extras13-web-basic-preview">
    <ul class="basic">
      <li v-for="(line, index) in lines" :key="index">
        {{ line }}
      </li>
    </ul>
  </div>
</template>

<script>

import useWindow, { windowProps, windowEmits } from '@web-workbench/core/composables/useWindow';
import { PROPERTY } from '../../utils';

export default {

  props: {
    ...windowProps,

    model: {
      type: Object,
      default () {
        return {
          output: []
        };
      }
    },
    parentFocused: {
      type: Boolean,
      default: false
    },
    core: {
      type: Object,
      required: true
    }
  },
  emits: [
    ...windowEmits, 'refresh'
  ],

  setup (props, context) {
    return useWindow(props, context);
  },

  data () {
    return {
      windowsModule: this.core.modules.windows
    };
  },

  computed: {
    lines () {
      return this.model.output;
    },
    value () {
      return this.model.value[PROPERTY.CONTENT];
    }
  },
  watch: {
    lines () {
      this.refresh();
    }
  },
  methods: {
    refresh () {
      this.$emit('refresh', { scroll: true });
    }
  }
};
</script>

<style lang="postcss" scoped>
.wb-disks-extras13-web-basic-preview {
  padding: var(--default-element-margin);
}
</style>
