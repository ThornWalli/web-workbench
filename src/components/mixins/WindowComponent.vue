
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
      changeFocus.bind(this)(value);
    }
  },

  mounted () {
    this.$nextTick(() => {
      this.$emit('ready', this);
      changeFocus.bind(this)(true);
    });
  },

  destroyed () {
    if (this.contextMenu && this.parentFocused) {
      this.core.modules.windows.setActiveContextMenu(null);
    }
  }
};

function changeFocus (value) {
  if (value) {
    this.currentContextMenu = this.core.modules.windows.setActiveContextMenu(this.contextMenu);
  } else if (this.core.modules.windows.getActiveContextMenu() === this.currentContextMenu) {
    this.core.modules.windows.setActiveContextMenu(null);
  }
}

</script>
