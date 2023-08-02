<template>
  <div class="wb-disks-extras13-web-basic">
    <atom-input-text ref="input" name="content" :options="inputTextOptions" :model="model.value" @refresh="onRefreshInputText" />
  </div>
</template>

<script>

import { toRef } from 'vue';
import AtomInputText from '@web-workbench/core/components/atoms/InputText';
import useWindow, { props as windowProps, emits as windowEmits } from '@web-workbench/core/composables/useWindow';
import contextMenu from '../webBasic/contextMenu';
import { CONFIG_NAMES, getBasicDefaultModelValue } from '../utils';

export default {
  components: {
    AtomInputText
  },

  props: {
    ...windowProps,
    parentLayout: {
      type: Object,
      default () {
        return {
          value: getBasicDefaultModelValue(),
          fsItem: null,
          openValue: null
        };
      }
    },
    model: {
      type: Object,
      default: null
    }
  },
  emits: [
    ...windowEmits, 'refresh'
  ],

  setup (props, context) {
    const model = toRef(props, 'model');
    const windowContext = useWindow(props, context);
    windowContext.setContextMenu(contextMenu, { model: model.value });
    windowContext.preserveContextMenu();
    return {
      ...windowContext
    };
  },

  computed: {
    openValue () {
      return this.model.openValue;
    },
    inputTextOptions () {
      return {
        focused: this.parentFocused
      };
    },
    showPreview () {
      return this.core.config.observable[CONFIG_NAMES.WEB_BASIC_SHOW_PREVIEW];
    }
  },

  watch: {
    'model.value' () {
      this.refresh();
    },
    openValue (value) {
      if (value) {
        this.model.value = value;
        this.$nextTick(() => {
          this.$refs.input.resetSelection();
          this.$emit('refresh', { scroll: true });
        });
      }
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

  methods: {
    onRefreshInputText () {
      this.refresh();
    },
    refresh () {
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
