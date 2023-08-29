<template>
  <div class="wb-disks-extras13-synthesizer-debug">
    <fieldset>
      <legend>Timelines</legend>
      <timeline-canvas
        v-for="(track, index) in tracks"
        :key="index"
        :track="track"
        @refresh="$emit('refresh')"></timeline-canvas>
    </fieldset>
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

// import { EXAMPLE_NOTES } from '../examples/index';
import WbButton from '@web-workbench/core/components/atoms/Button';
// eslint-disable-next-line no-unused-vars
import { getOcatveNotes } from '../utils';

import Track from '../classes/Track';
import NoteRenderer from '..//classes/NoteRenderer';
import NoteCanvas from './synthesizer/NoteCanvas.vue';
import TimelineCanvas from './synthesizer/TimelineCanvas.vue';
export default {
  components: {
    NoteCanvas,
    TimelineCanvas,
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
      tracks,
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

const tracks = [
  // new Track({
  //   name: 'Test A',
  //   type: 'Synth',
  //   notes: getOcatveNotes(1, 5, '4n'),
  //   beatCount: 4,
  //   baseNote: 4,
  //   noteCount: 4
  // }),
  // new Track({
  //   name: 'Pause',
  //   type: 'Synth',
  //   notes: [
  //     { name: 'C4', time: '4n' },
  //     { name: 'C4', time: '4n' },
  //     // { name: 'C4', time: '4n' },
  //     { name: '', duration: 2.8 }
  //   ],
  //   beatCount: 5
  // })
  new Track({
    name: 'Pause',
    type: 'Synth',
    notes: [
      { name: '', duration: 0.25 },
      { name: '', duration: 0.25 },
      { name: '', duration: 0.25 },
      { name: '', duration: 0.25 },
      { name: '', duration: 1 },
      { name: '', duration: 1 },
      { name: '', duration: 1 },
      { name: '', duration: 1 }
    ],
    beatCount: 4
  }),
  // new Track({
  //   name: 'Pause',
  //   type: 'Synth',
  //   notes: [{ name: '', duration: 1 }],
  //   beatCount: 4
  // })
  // new Track({
  //   name: 'Pause',
  //   type: 'Synth',
  //   notes: [{ name: '', duration: 1.5 }],
  //   beatCount: 4
  // }),
  // new Track({
  //   name: 'Pause',
  //   type: 'Synth',
  //   notes: [{ name: '', duration: 2 }],
  //   beatCount: 4
  // }),
  // new Track({
  //   name: 'Pause',
  //   type: 'Synth',
  //   notes: [{ name: '', duration: 2.5 }],
  //   beatCount: 4
  // }),
  // new Track({
  //   name: 'Pause',
  //   type: 'Synth',
  //   notes: [{ name: '', duration: 3 }],
  //   beatCount: 4
  // }),
  // new Track({
  //   name: 'Pause',
  //   type: 'Synth',
  //   notes: [{ name: '', duration: 4 }],
  //   beatCount: 4
  // }),
  new Track({
    name: 'Pause',
    type: 'Synth',
    notes: [
      { name: '', time: '2n' },
      { name: '', duration: 2 }

      // { name: '', time: '2n' },
      // { name: '', time: '2n' },
      // { name: '', time: '2n' },
      // { name: '', time: '2n' }
      // { name: '', duration: 1 },
      // { name: '', duration: 1 },
      // { name: '', duration: 1 },
      // { name: '', duration: 2.5 }
      // { name: '', time: '2n' },
      // { name: '', duration: 2 }
      // { name: '', time: '2m' },
      // { name: '', time: '4n' },
      // { name: '', time: '16n' },
      // { name: '', time: '32n' },
      // { name: '', duration: 1 },
      // { name: '', time: '1m' },
      // { name: '', time: '2n' },
      // { name: '', time: '1m' }
    ],
    beatCount: 4
  })
  // new Track({
  //   name: 'Pause',
  //   type: 'Synth',
  //   notes: [
  //     { name: 'Db4', time: '16n' },
  //     { name: 'Eb4', time: '16n' },
  //     { name: 'Gb4', time: '16n' },
  //     { name: 'Ab4', time: '16n' },

  //     { name: 'C4', time: '16n' },
  //     { name: 'E4', time: '16n' },
  //     { name: 'F4', time: '16n' },
  //     { name: 'C5', time: '16n' },

  //     { name: 'C5', time: '16n' },
  //     { name: 'F4', time: '16n' },
  //     { name: 'E4', time: '16n' },
  //     { name: 'C4', time: '16n' }
  //     // { name: '', time: '2m' },
  //     // { name: '', time: '1m' },
  //     // { name: 'C1', time: '16n' },
  //     // { name: 'C2', time: '16n' },
  //     // { name: 'C3', time: '16n' },
  //     // { name: 'C4', time: '16n' },
  //     // { name: 'C5', time: '16n' },
  //     // { name: 'C1', time: '16n' }
  //     // { name: 'C1', time: '16n' },
  //     // { name: 'C2', time: '16n' },
  //     // { name: 'C3', time: '16n' },
  //     // { name: 'C4', time: '16n' },
  //     // { name: 'C5', time: '16n' },
  //     // { name: 'C6', time: '16n' },
  //     // { name: 'C6', time: '16n' },
  //     // { name: 'C5', time: '16n' },
  //     // { name: 'C4', time: '16n' },
  //     // { name: 'C3', time: '8n' },
  //     // { name: 'F4', time: '8n' }
  //     // { name: '', time: '2n' },
  //     // { name: '', duration: 1 },
  //     // { name: '', time: '2n' },
  //     // { name: '', duration: 2 }
  //     // { name: '', time: '2m' },
  //     // { name: '', time: '4n' }
  //     // { name: '', time: '16n' },
  //     // { name: '', time: '32n' },
  //     // { name: '', duration: 1 }
  //     // { name: '', time: '1m' },
  //     // { name: '', time: '2n' },
  //     // { name: '', time: '1m' }
  //     // { name: 'C4', time: '2n' },
  //     // { name: 'C4', time: '2n' }
  //     // ['C4', '1m'],
  //     // ['C4', '2n'],
  //     // ['C4', '4n']
  //   ],
  //   beatCount: 2
  // })
  // new Track({
  //   name: 'Pause',
  //   type: 'Synth',
  //   notes: [
  //     // { name: '', time: '2m' },
  //     // { name: '', time: '1m' },
  //     { name: '', time: '2n' },
  //     { name: '', duration: 4.5 }
  //     // { name: '', time: '2n' },
  //     // { name: '', duration: 1 },
  //     // { name: '', time: '2n' },
  //     // { name: '', duration: 2 }
  //     // { name: '', time: '2m' },
  //     // { name: '', time: '4n' }
  //     // { name: '', time: '16n' },
  //     // { name: '', time: '32n' },
  //     // { name: '', duration: 1 }
  //     // { name: '', time: '1m' },
  //     // { name: '', time: '2n' },
  //     // { name: '', time: '1m' }
  //     // { name: 'C4', time: '2n' },
  //     // { name: 'C4', time: '2n' }
  //     // ['C4', '1m'],
  //     // ['C4', '2n'],
  //     // ['C4', '4n']
  //   ],
  //   beatCount: 4
  // })
  // new Track({
  //   name: 'Test',
  //   type: 'Synth',
  //   notes: [
  //     { name: 'C4', time: '4n' }, // 1
  //     { name: 'C4', time: '4n' }, // 2
  //     { name: 'C4', time: '4n' }, // 3
  //     { name: 'C4', time: '4n' }, // 4
  //     { name: 'C4', time: '4n' }, // 5
  //     { name: 'C4', time: '1m' },
  //     { name: 'C4', time: '8n' },
  //     { name: 'C4', time: '8n' },
  //     { name: 'C4', time: '8n' },
  //     { name: 'C4', time: '8n' },
  //     { name: 'C4', time: '4n' },
  //     { name: 'C4', time: '4n' }
  //   ],
  //   beatCount: 3,
  //   baseNote: 5,
  //   noteCount: '4n'
  // }),
  // new Track({
  //   name: 'Alle Meine Enten',
  //   type: 'Synth',
  //   notes: EXAMPLE_NOTES.alleMeineEnten,
  //   beatCount: 4
  // }),
  // new Track({
  //   name: 'Chocobo Test',
  //   type: 'Synth',
  //   notes: EXAMPLE_NOTES.chocobo,
  //   beatCount: 4
  // }),
  // new Track({
  //   name: 'Pause',
  //   type: 'Synth',
  //   notes: [
  //     { name: '', time: '2m' },
  //     { name: '', time: '1m' },
  //     { name: '', time: '2n' },
  //     { name: '', time: '4n' },
  //     { name: '', time: '8n' },
  //     { name: '', time: '16n' },
  //     { name: '', time: '32n' }
  //     // { name: '', time: '1m' },
  //     // { name: '', time: '2n' },
  //     // { name: '', time: '1m' }
  //     // { name: 'C4', time: '2n' },
  //     // { name: 'C4', time: '2n' }
  //     // ['C4', '1m'],
  //     // ['C4', '2n'],
  //     // ['C4', '4n']
  //   ],
  //   beatCount: 4
  // }),
  // ...Array(4)
  //   .fill({})
  //   .map(
  //     (v, index) =>
  //       new Track({
  //         name: 'Test A',
  //         type: 'Synth',
  //         notes: EXAMPLE_NOTES.getOcatveNotes(1, 1 + index, '8n'),
  //         beatCount: 4
  //       })
  //   )
];
</script>
<style lang="postcss" scoped>
.wb-disks-extras13-synthesizer-debug {
  /* position: absolute;
  inset: 0; */

  & fieldset {
    margin: calc(var(--default-element-margin) * 2);
  }
}
</style>
