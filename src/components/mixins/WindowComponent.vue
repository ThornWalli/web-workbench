
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
    },
    window: {
      type: Object,
      required: true
    }
  },

  emits: [
    'ready'
  ],

  data () {
    return {
      currentContextMenu: null
    };
  },

  computed: {
    embeddedWindow () {
      return this.window.options.embed;
    }
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

  unmounted () {
    if (this.contextMenu && this.core.modules.windows.isContextMenu(this.currentContextMenu)) {
      this.core.modules.windows.setActiveContextMenu(null);
    }
  }
};

function changeFocus (value) {
  if (this.contextMenu) {
    if (value) {
      this.currentContextMenu = this.core.modules.windows.setActiveContextMenu(this.contextMenu);
    } else if (this.core.modules.windows.getActiveContextMenu() === this.currentContextMenu && !this.embeddedWindow) {
      this.core.modules.windows.setActiveContextMenu(null);
    }
  }
}

</script>
