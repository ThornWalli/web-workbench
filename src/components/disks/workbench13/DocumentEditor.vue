<template>
  <div class="wb-disks-workbench13-document-editor">
    <atom-input-text name="content" :options="inputTextOptions" :model="model.value" @refresh="onRefreshInputText" />
  </div>
</template>

<script>

import ContextMenuItems from '../../../web-workbench/classes/ContextMenuItems';
import { CONFIG_NAMES } from '@/web-workbench/disks/workbench13/utils';
import AtomInputText from '@/components/environments/atoms/InputText';

import MixinWindowComponent from '@/components/mixins/WindowComponent';
import contextMenu from '@/web-workbench/disks/workbench13/documentEditor/contextMenu';

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
      return new ContextMenuItems(contextMenu, { core: this.core, model: this.model });
    },
    inputTextOptions () {
      return {
        focused: this.parentFocused
      };
    },
    showPreview () {
      return this.core.config.observable[CONFIG_NAMES.DOCUMENT_EDITOR_SHOW_PREVIEW];
    }
  },
  watch: {
    'model.value' () {
      this.$nextTick(() => {
        this.$emit('refresh', { scroll: true });
      });
    },
    showPreview (value) {
      this.model.actions.togglePreview(value);
    }
  },

  mounted () {
    if (this.showPreview) {
      this.model.actions.togglePreview();
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
.wb-disks-workbench13-document-editor {
  padding: var(--default-element-margin);
}
</style>
