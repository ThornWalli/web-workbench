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

import { PROPERTY } from '../../../../web-workbench/disks/extras13/utils';
import ContextMenuItems from '../../../../web-workbench/classes/ContextMenuItems';
import MixinWindowComponent from '@/components/mixins/WindowComponent';
import contextMenu from '@/web-workbench/disks/extras13/webBasic/contextMenu';

export default {
  mixins: [
    MixinWindowComponent
  ],
  props: {
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
    'refresh'
  ],
  data () {
    return {
      windowsModule: this.core.modules.windows
    };
  },
  computed: {
    lines () {
      return this.model.output;
    },
    contextMenu () {
      return new ContextMenuItems(contextMenu, { core: this.core, model: this.model });
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
