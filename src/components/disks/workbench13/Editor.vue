<template>
  <div class="wb-disks-workbench13-editor">
    <atom-input-text name="content" :options="inputTextOptions" :model="model.value" @refresh="onRefreshInputText" />
  </div>
</template>

<script>

import { CONFIG_NAMES } from '@/web-workbench/disks/workbench13';
import AtomInputText from '@/components/environments/atoms/InputText';

import MixinWindowComponent from '@/components/mixins/WindowComponent';
import contextMenu from '@/web-workbench/disks/workbench13/editor/contextMenu';

export default {
  components: {
    AtomInputText
  },
  mixins: [
    MixinWindowComponent
  ],
  props: {
    model: {
      type: Object,
      default () {
        return {
          fsItem: null,
          value: {
            type: 'markdown',
            content: ''
          }
        };
      }
    },
    core: {
      type: Object,
      required: true
    }
  },
  data () {
    return {
      // windowsModule: this.core.modules.windows
    };
  },

  computed: {
    contextMenu () {
      return contextMenu({ core: this.core, model: this.model });
    },
    inputTextOptions () {
      return {
        focused: this.parentFocused
      };
    },
    showPreview () {
      return this.core.config.observable[CONFIG_NAMES.EDITOR_SHOW_PREVIEW];
    }
  },
  watch: {
    // parentFocused (value) {
    //   if (value) {
    //     this.windowsModule.setActiveContextMenu(contextMenu({ core: this.core, model: this.model }));
    //   } else {
    //     this.windowsModule.setActiveContextMenu(null);
    //   }
    // },
    showPreview (value) {
      this.model.togglePreview(value);
    }
  },

  mounted () {
    if (this.showPreview) {
      this.model.togglePreview();
    }
  },

  // destroyed () {
  //   if (this.parentFocused) {
  //     this.windowsModule.setActiveContextMenu(null);
  //   }
  // },
  methods: {
    onRefreshInputText () {
      this.$emit('refresh', { scroll: true });
    }
  }
};
</script>

<style lang="postcss">
.wb-disks-workbench13-editor {
  padding: var(--default-element-margin);
}
</style>
