<template>
  <div class="wb-disks-extras13-synthesizer-test">
    <!-- <note-canvas></note-canvas> -->
    <timeline-canvas
      v-for="(track, index) in tracks"
      :key="index"
      :track="track"></timeline-canvas>
  </div>
</template>

<script>
import useWindow, {
  windowProps,
  windowEmits
} from '@web-workbench/core/composables/useWindow';

import { EXAMPLE_NOTES } from '../index';
import Track from '../classes/Track';
import NoteCanvas from './synthesizer/NoteCanvas.vue';
import TimelineCanvas from './synthesizer/TimelineCanvas.vue';
export default {
  components: {
    // eslint-disable-next-line vue/no-unused-components
    NoteCanvas,
    TimelineCanvas
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
      tracks: [
        new Track({
          name: 'Alle Meine Enten',
          type: 'Synth',
          notes: EXAMPLE_NOTES.alleMeineEnten,
          beatCount: 4
        }),
        new Track({
          name: 'Chocobo Test',
          type: 'Synth',
          notes: EXAMPLE_NOTES.chocobo,
          beatCount: 4
        }),
        new Track({
          name: 'Test',
          type: 'Synth',
          notes: [
            { name: '', time: '2m' },
            { name: '', time: '1m' },
            { name: '', time: '2n' },
            { name: '', time: '4n' },
            { name: '', time: '8n' },
            { name: '', time: '16n' },
            { name: '', time: '32n' }
            // { name: '', time: '1m' },
            // { name: '', time: '2n' },
            // { name: '', time: '1m' }
            // { name: 'C4', time: '2n' },
            // { name: 'C4', time: '2n' }
            // ['C4', '1m'],
            // ['C4', '2n'],
            // ['C4', '4n']
          ],
          beatCount: 4
        }),

        ...Array(1)
          .fill({})
          .map(
            (v, index) =>
              new Track({
                name: 'Test A',
                type: 'Synth',
                notes: EXAMPLE_NOTES.getOcatveNotes(1, 1 + index, '8n'),
                beatCount: 4
              })
          )
      ]
    };
  },
  mounted() {
    this.$nextTick(() => {
      this.$emit('refresh');
    });
  }
};
</script>
<style lang="postcss" scoped>
.wb-disks-extras13-synthesizer-test {
  /* position: absolute;
  inset: 0; */
}
</style>
