<template>
  <div class="wb-disks-extras13-web-basic">
    <atom-input-text ref="input" name="content" :options="inputTextOptions" :model="model.value" @refresh="onRefreshInputText" />
  </div>
</template>

<script>

import { toRef } from 'vue';
import { CONFIG_NAMES, getBasicDefaultModelValue } from '@/web-workbench/disks/extras13/utils';
import AtomInputText from '@/components/environments/atoms/InputText';

import contextMenu from '@/web-workbench/disks/extras13/webBasic/contextMenu';
import useWindow, { props as windowProps, emits as windowEmits } from '@/composables/useWindow';

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
    const window = useWindow(props, context);
    window.setContextMenu(contextMenu, { model: model.value });
    window.preserveContextMenu();
    return {
      ...window
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
