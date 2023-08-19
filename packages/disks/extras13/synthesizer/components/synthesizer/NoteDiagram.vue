<template>
  <div class="note-diagram" :style="style">
    <div>
      <div
        v-for="(v, index) in Array(Math.round(octaveCount / 2)).fill({})"
        :key="index"
        ref="grid"
        class="container">
        <div class="time-signatures">
          <span>{{ baseNote }}</span>
          <span>{{ noteCount.replace(/(\d+).*/, '$1') }}</span>
        </div>
        <div>
          <div class="grid">
            <i />
            <i />
            <i />
            <i />
            <i />
            <div :key="baseNote" class="beat-lines">
              <div
                v-for="(v, beatIndex) in Array(beatCount * baseNote)"
                :key="beatIndex" />
            </div>
            <div :key="baseNote" class="beat-count-lines">
              <div
                v-for="(v, beatIndex) in Array(beatCount)"
                :key="beatIndex" />
            </div>
            <div class="bold-double-barline" />
          </div>
        </div>
      </div>
      <div class="beats">
        <div
          v-for="({ selected, groupedNotes }, index) in beats"
          :key="index"
          class="beat"
          :class="{ selected }">
          <div ref="notes" class="notes">
            <note-group
              v-for="(group, groupedNoteIndex) in groupedNotes"
              :key="groupedNoteIndex"
              v-bind="group"
              @note:click="onClick($event)" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ipoint } from '@js-basics/vector';
import NoteGroup from './NoteGroup';
import { DIMENSION as NOTE_DIMENSION } from './Note';

export default {
  components: { NoteGroup },

  props: {
    beats: {
      type: Array,
      default() {
        return [];
      }
    },

    noteCount: {
      type: String,
      default: '4n'
    },

    baseNote: {
      type: Number,
      default: 4
    },

    beatCount: {
      type: Number,
      default: 1
    },

    octaveCount: {
      type: Number,
      default: 1
    }
  },

  emits: ['note:click'],

  data() {
    return {
      currentBeat: 0,
      gridDimension: ipoint(NOTE_DIMENSION.x, 9)
    };
  },

  computed: {
    style() {
      return {
        '--note-count': this.noteCount.replace(/(\d+).*/, '$1'),
        '--beat-count': this.beatCount,
        ...this.gridDimension.toCSSVars('dimension-grid')
      };
    }
  },
  methods: {
    onClick(note) {
      this.$emit('note:click', note);
    }
  }
};
</script>

<style lang="postcss" scoped>
.note-diagram {
  --color-background: trasnparent;
  --color-foreground: #fa5;
  --offset-y: calc((var(--dimension-grid-y)) * 1px);
  --line-offset: 10px;
  --time-signatures-width: 16px;

  padding-top: 50px;
  padding-bottom: 25px;
  background: var(--color-background);

  & > div:first-child {
    position: relative;
  }
}

.container + .container {
  margin-top: calc((var(--dimension-grid-y) * 1px) * 3 - 1px);
}

.time-signatures {
  display: flex;
  flex-direction: column;
  gap: 0;
  align-items: flex-start;
  justify-content: center;
  width: var(--time-signatures-width);
  color: var(--color-foreground);
  text-align: center;

  & > span {
    display: block;
    line-height: 1;
  }
}

.time-signatures + div {
  position: relative;
  flex: 1;
}

.container {
  position: relative;
  display: flex;
  gap: 0;

  & .grid {
    position: relative;
    display: flex;
    flex: 1;
    flex-direction: column;
    gap: calc((var(--dimension-grid-y)) * 1px - 1px);

    & > i {
      display: flex;
      width: 100%;

      &::before {
        display: block;
        width: 100%;
        height: 1px;
        content: '';
        background: var(--color-foreground);
      }
    }

    & .beat-lines {
      position: absolute;
      top: 0;
      left: 0;
      display: flex;
      width: 100%;
      height: 100%;

      & > div {
        display: flex;
        width: calc(100% / var(--note-count));
        height: 100%;

        &::before {
          width: 0;
          content: '';
          border-right: solid 1px var(--color-foreground);
          opacity: 0.4;
        }
      }
    }

    & .beat-count-lines {
      position: absolute;
      top: 0;
      left: 0;
      display: flex;
      width: 100%;
      height: 100%;

      & > div {
        display: flex;
        width: calc(100% / var(--beat-count));
        height: 100%;

        &::before {
          width: 0;
          content: '';
          border-right: solid 1px var(--color-foreground);
        }
      }
    }

    & .dotted-barline {
      position: absolute;
      top: 0;
      right: 50%;
      display: flex;
      height: 100%;

      &::before {
        width: 0;
        content: '';
        border-right: dotted 1px var(--color-foreground);
      }
    }

    & .double-barline {
      /* :empty */
    }

    & .bold-double-barline {
      position: absolute;
      top: 0;
      right: 0;
      display: flex;
      gap: 5px;
      height: 100%;

      &::before {
        width: 1px;
        content: '';
        background: var(--color-foreground);
      }

      &::after {
        width: 5px;
        content: '';
        background: var(--color-foreground);
      }
    }
  }
}

.notes {
  position: absolute;
  right: 0;
  bottom: 0;
  left: 0;
  display: flex;

  /* gap: calc(var(--dimension-grid-x) * (var(--beat) * 2 - (var(--beat) - 1) * 2) * 1px); */
  height: calc(var(--dimension-grid-y) * 1px * 4);

  & :deep(.note) {
    position: relative;
    bottom: 0;
    bottom: calc(
      -1 * var(--dimension-grid-y) * 1px * 1.5 + var(--position) * 9 * 1px
    );
    display: flex;
    align-items: flex-end;

    /* justify-content: center; */
    width: 100%;

    /* width: calc(100% / var(--beat)); */

    /* width: calc(var(--dimension-grid-x) * 1px); */
    height: calc(var(--dimension-grid-y) * 1px);
  }
}

.beats {
  position: absolute;
  inset: 0;
  left: var(--time-signatures-width);
  display: flex;

  & > .beat {
    position: relative;
    width: calc(100% / var(--beat-count));

    &.selected {
      backdrop-filter: invert(1);
    }
  }
}
</style>
