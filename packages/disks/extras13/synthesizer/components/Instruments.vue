<template>
  <div class="wb-disks-extras13-synthesizer-instruments">
    <div class="instruments">
      <div
        v-for="(instrument, index) in instruments"
        :key="index"
        class="instrument">
        <note-sheet v-bind="getNoteDiagramData(instrument)"></note-sheet>
        <navigation v-bind="getControls(instrument)"></navigation>
      </div>
    </div>
  </div>
</template>

<script>
import { watch, toRef } from 'vue';
import useWindow, {
  windowProps,
  windowEmits
} from '@web-workbench/core/composables/useWindow';
import { getDefaultModel, CONFIG_NAMES } from '../index';
import contextMenu from '../contextMenu';
import NoteDiagramClass from '../classes/NoteDiagram';
import NoteSheet from './synthesizer/NoteSheet';
import Navigation from './synthesizer/Navigation';

export default {
  components: { NoteSheet, Navigation },

  props: {
    ...windowProps,
    model: { type: Object, default: getDefaultModel() }
  },

  emits: [...windowEmits],
  setup(props, context) {
    const model = toRef(props, 'model');
    const windowContext = useWindow(props, context);
    watch(
      model,
      () => {
        windowContext.setContextMenu(contextMenu, { model: model.value });
      },
      { immediate: true, deep: true }
    );
    return { ...windowContext };
  },
  computed: {
    instruments: {
      get() {
        return this.model[CONFIG_NAMES.SYNTHESIZER_CHANNELS];
      },
      set(value) {
        return (this.model[CONFIG_NAMES.SYNTHESIZER_CHANNELS] = value);
      }
    },

    baseNote() {
      return Number(this.model[CONFIG_NAMES.SYNTHESIZER_BASE_NOTE]);
    },
    beatCount() {
      return Number(this.model[CONFIG_NAMES.SYNTHESIZER_BEAT_COUNT]);
    },
    noteCount() {
      return this.model[CONFIG_NAMES.SYNTHESIZER_NOTE_COUNT];
    },

    startOctave() {
      return Number(this.model[CONFIG_NAMES.SYNTHESIZER_START_OCTAVE]);
    },

    octaveCount() {
      return Number(this.model[CONFIG_NAMES.SYNTHESIZER_OCTAVE_COUNT]);
    }
  },
  methods: {
    getControls(instrument) {
      return {
        items: [
          { text: instrument.name },
          {
            title: 'Edit',
            onClick: () => {
              // this.removeNote(this.noteIndex);
            }
          },
          {
            spacer: true
          },
          {
            title: 'Remove',
            onClick: async () => {
              const message = 'Instrument really removed?';
              const value = await this.core.executeCommand(
                `openDialog "${message}" -confirm`
              );
              if (value) {
                this.instruments = this.instruments.filter(
                  item => item !== instrument
                );
              }
            }
          }
        ]
      };
    },
    getNoteDiagramData(instrument) {
      const noteDiagram = new NoteDiagramClass(instrument, {
        startOctave: this.startOctave,
        beatCount: this.beatCount
      });

      return {
        baseNote: this.baseNote,
        noteCount: this.noteCount,
        beatCount: noteDiagram.beatCount,
        beats: noteDiagram.getVisibleBeats(),
        startOctave: this.startOctave,
        octaveCount: this.octaveCount
      };
    }
  }
};
</script>
<style lang="postcss" scoped>
.wb-disks-extras13-synthesizer-instruments {
  position: absolute;
  inset: 0;
}

.instruments {
  --color-scrollbar-primary: var(--color-dropdown-scrollbar-primary, #fff);
  --color-scrollbar-secondary: var(--color-dropdown-scrollbar-secondary, #05a);

  display: flex;
  flex-direction: column;
  gap: 0;
  height: 100%;
  overflow-x: hidden;
  overflow-y: scroll;
  scrollbar-color: var(--color-scrollbar-primary)
    var(--color-scrollbar-secondary);

  &::-webkit-scrollbar {
    width: var(--default-element-margin);
  }

  &::-webkit-scrollbar-track {
    background-color: var(--color-scrollbar-secondary);
  }

  &::-webkit-scrollbar-thumb {
    background-color: var(--color-scrollbar-primary);
  }

  & .instrument {
    padding-right: var(--default-element-margin);
  }
}
</style>
