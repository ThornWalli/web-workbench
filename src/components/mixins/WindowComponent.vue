
<script>

export default {
  props: {
    id: {
      type: String,
      default: ''
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

  data () {
    return {
      currentContextMenu: null
    };
  },

  watch: {
    parentFocused (value) {
      if (value) {
        this.currentContextMenu = this.core.modules.windows.setActiveContextMenu(this.contextMenu);
      } else if (this.core.modules.windows.getActiveContextMenu() === this.currentContextMenu) {
        this.core.modules.windows.setActiveContextMenu(null);
      }
    }
  },

  mounted () {
    this.$nextTick(() => {
      this.$emit('ready', this);
    });
  },

  destroyed () {
    if (this.contextMenu && this.parentFocused) {
      this.core.modules.windows.setActiveContextMenu(null);
    }
  }
};
</script>
