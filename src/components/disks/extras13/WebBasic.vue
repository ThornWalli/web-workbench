<template>
  <div class="wb-disks-extras13-web-basic">
    <atom-input-text ref="input" name="content" :options="inputTextOptions" :model="model.value" @refresh="onRefreshInputText" />
  </div>
</template>

<script>

import { CONFIG_NAMES, getBasicDefaultModelValue } from '@/web-workbench/disks/extras13';
import AtomInputText from '@/components/environments/atoms/InputText';

import MixinWindowComponent from '@/components/mixins/WindowComponent';
import contextMenu from '@/web-workbench/disks/extras13/webBasic/contextMenu';

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
  data () {
    return {
      // windowsModule: this.core.modules.windows
    };
  },

  computed: {
    openValue () {
      return this.model.openValue;
    },
    contextMenu () {
      return contextMenu({ core: this.core, model: this.model });
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
    openValue (value) {
      if (value) {
        this.model.value = value;
        this.$nextTick(() => {
          this.$refs.input.resetSelection();
          this.$emit('refresh', { scroll: true });
        });
      }
    },
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
.wb-disks-extras13-web-basic {
  /* empty */
}
</style>
