<template>
  <div class="wb-disks-extras13-web-basic">
    <atom-input-text
      ref="input"
      :options="inputTextOptions"
      :model-value="model.value.content"
      @update:model-value="onUpdateModelValue"
      @refresh="onRefreshInputText" />
  </div>
</template>

<script>
import { toRef } from 'vue';
import AtomInputText from '@web-workbench/core/components/atoms/InputText';

import contextMenu from '../contextMenu';

import { CONFIG_NAMES, getDefaultModel } from '../index';
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
          value: getDefaultModel(),
          fsItem: null,
          openValue: null
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
    return {
      ...windowContext
    };
  },

  computed: {
    openValue() {
      return this.model.openValue;
    },
    inputTextOptions() {
      return {
        focused: this.parentFocused
      };
    },
    showPreview() {
      return this.core.config.observable[CONFIG_NAMES.WEB_BASIC_SHOW_PREVIEW];
    }
  },

  watch: {
    'model.value'() {
      this.refresh();
    },
    openValue(value) {
      if (value) {
        this.model.value = value;
        this.$nextTick(() => {
          this.$refs.input.resetSelection();
          this.$emit('refresh', { scroll: true });
        });
      }
    },
    showPreview(value) {
      this.model.actions.togglePreview(value);
    }
  },

  mounted() {
    if (this.showPreview) {
      this.$nextTick(() => {
        this.model.actions.togglePreview();
      });
    }
  },

  methods: {
    onUpdateModelValue(value) {
      this.model.value.content = value;
    },
    onRefreshInputText() {
      this.refresh();
    },
    refresh() {
      this.$nextTick(() => {
        this.$emit('refresh', { scroll: true });
      });
    }
  }
};
</script>

<style lang="postcss" scoped>
.wb-disks-extras13-web-basic {
  /* empty */
}
</style>
