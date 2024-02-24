<template>
  <div class="wb-disks-extras13-synthesizer-debug-notes">
    <fieldset>
      <legend>Note Cache</legend>
      <wb-button
        :label="`Clear Cache (${noteRenderer.cache.size} Bitmaps)`"
        @click="noteRenderer.cache.clear()"></wb-button>
    </fieldset>
    <fieldset>
      <legend>Notes</legend>
      <note-canvas @refresh="$emit('refresh')"></note-canvas>
    </fieldset>
  </div>
</template>

<script>
import useWindow, {
  windowProps,
  windowEmits
} from '@web-workbench/core/composables/useWindow';

import WbButton from '@web-workbench/core/components/atoms/Button';

import NoteRenderer from '../../classes/NoteRenderer';
import NoteCanvas from '../synthesizer/NoteCanvas.vue';
export default {
  components: {
    NoteCanvas,
    WbButton
  },
  props: {
    ...windowProps
  },
  emits: [...windowEmits, 'refresh'],
  setup(props, context) {
    const windowContext = useWindow(props, context);
    return { ...windowContext };
  },
  data: function () {
    return {
      noteRenderer: new NoteRenderer()
    };
  },
  mounted() {
    console.log('DEBUG', {
      noteRenderer: this.noteRenderer
    });
    this.$nextTick(() => {
      this.$emit('refresh');
    });
  }
};
</script>
<style lang="postcss" scoped>
.wb-disks-extras13-synthesizer-debug-notes {
  /* position: absolute;
  inset: 0; */

  & fieldset {
    margin: calc(var(--default-element-margin) * 2);
  }
}
</style>
