<template>
  <div class="wb-disks-workbench13-document-editor">
    <atom-input-text
      name="content"
      :options="inputTextOptions"
      :model="model.value"
      @refresh="onRefreshInputText" />
  </div>
</template>

<script>
import { toRef } from 'vue';
import AtomInputText from '@web-workbench/core/components/atoms/InputText';

import contextMenu from '../contextMenu';
import { CONFIG_NAMES, getDefaultDocumentModel } from '../index';
import useWindow from '@web-workbench/core/composables/useWindow';

export default {
  components: {
    AtomInputText
  },

  props: {
    model: {
      type: Object,
      default() {
        return {
          fsItem: null,
          value: getDefaultDocumentModel()
        };
      }
    }
  },
  emits: ['refresh'],

  setup(props) {
    const model = toRef(props, 'model');
    const windowContext = useWindow();
    windowContext.setContextMenu(contextMenu, { model: model.value });
    windowContext.preserveContextMenu();
    return windowContext;
  },

  computed: {
    inputTextOptions() {
      return {
        focused: this.parentFocused
      };
    },
    showPreview() {
      return this.core.config.observable[
        CONFIG_NAMES.DOCUMENT_EDITOR_SHOW_PREVIEW
      ];
    }
  },

  watch: {
    'model.value'() {
      this.$nextTick(() => {
        this.$emit('refresh', { scroll: true });
      });
    },
    showPreview(value) {
      this.model.actions.togglePreview(value);
    }
  },

  mounted() {
    if (this.showPreview) {
      this.model.actions.togglePreview();
    }
  },
  methods: {
    onRefreshInputText() {
      this.$emit('refresh', { scroll: true });
    }
  }
};
</script>

<style lang="postcss" scoped>
.wb-disks-workbench13-document-editor {
  padding: var(--default-element-margin);
}
</style>
