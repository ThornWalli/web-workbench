<template>
  <div class="wb-disks-extras13-web-basic">
    <atom-input-text ref="input" name="content" :options="inputTextOptions" :model="model.value" @refresh="onRefreshInputText" />
  </div>
</template>

<script>

import { CONFIG_NAMES, getBasicDefaultModelValue } from '@/web-workbench/disks/extras13/utils';
import AtomInputText from '@/components/environments/atoms/InputText';

import MixinWindowComponent from '@/components/mixins/WindowComponent';
import contextMenu from '@/web-workbench/disks/extras13/webBasic/contextMenu';
import ContextMenuItems from '@/web-workbench/classes/ContextMenuItems';

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
          value: getBasicDefaultModelValue(),
          fsItem: null,
          openValue: null
        };
      }
    },
    core: {
      type: Object,
      required: true
    }
  },

  computed: {
    openValue () {
      return this.model.openValue;
    },
    contextMenu () {
      return new ContextMenuItems(contextMenu, { core: this.core, model: this.model });
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

<style lang="postcss">
.wb-disks-extras13-web-basic {
  /* empty */
}
</style>
