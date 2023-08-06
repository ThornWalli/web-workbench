<template>
  <div class="note-diagram" :style="style">
    <div>
      <div v-for="(v,index) in Array(Math.round(octaveCount / 2)).fill({})" :key="index" ref="lines" class="lines">
        <div />
        <div />
        <div />
        <div />
        <div />
        <div class="end" />
      </div>
      <div ref="notes" class="notes">
        <note
          v-for="(note, index) in visibleNotes"
          :key="index"
          class="note"
          v-bind="note"
          :style="{'--position': getNotePosition(note),'--position-mod': (getNotePosition(note) % 2)}"
        />
      </div>
    </div>
    <br><br>{{ visibleNotes.map((note) => note.time) }}
  </div>
</template>

<script>

import { ipoint } from '@js-basics/vector';
import Note, { DIMENSION as NOTE_DIMENSION } from './Note';

export default {
  components: { Note },
  props: {
    notes: {
      type: Array,
      default () {
        return [];
      }
    },
    startOctave: {
      type: Number,
      default: 4
    },
    octaveCount: {
      type: Number,
      default: 1
    }
  },

  data () {
    return {
      maxVisibleNotes: 0,
      gridDimension: ipoint(NOTE_DIMENSION.x, 9)
    };
  },

  computed: {
    style () {
      return {
        '--octave-count': this.octaveCount,
        ...this.gridDimension.toCSSVars('dimension-grid')
      };
    },
    visibleNotes () {
      const notes = [];
      for (let i = 0; i < this.notes.length; i++) {
        notes.push({ ...this.notes[Number(i)], last: this.notes[i - 1], next: this.notes[i + 1] });
      }

      const start = Math.max(notes.length - this.maxVisibleNotes, 0);
      return notes.slice(start, start + this.maxVisibleNotes);
    },
    startIndex () {
      if (!this.startNote) {
        return -1;
      }
      const [
        ,, index
      ] = this.startNote.match(/(.+)(\d+)/);
      return index;
    },
    endIndex () {
      if (!this.endNote) {
        return -1;
      }
      const [
        ,, index
      ] = this.endNote.match(/(.+)(\d+)/);
      return index;
    },
    startNote () {
      return this.notes[0]?.note;
    },
    endNote () {
      return this.notes[this.notes.length - 1]?.note;
    }
  },

  mounted () {
    this.$nextTick(() => {
      this.maxVisibleNotes = Math.floor((this.$refs.notes.offsetWidth - NOTE_DIMENSION.x) / NOTE_DIMENSION.x);
    });
  },

  methods: {
    getNotePosition ({ note }) {
      if (!note) {
        return 0;
      } else {
        const [
          , name, index
        ] = note.match(/(.+)(\d+)/);

        let noteName = name;

        if (name.length) {
          noteName = name[0];
        }

        const nextIndex = index - this.startOctave;

        return {
          c: 3,
          d: 2.5,
          e: 2,
          f: 1.5,
          g: 1,
          a: 0.5,
          b: 0
        }[String(noteName.toLowerCase())] * -1 + nextIndex + 2.5 * nextIndex;
      }
    }
  }

};
</script>

<style lang="postcss" scoped>

.note-diagram {
  --color-background: trasnparent;
  --color-foreground: #FA5;
  --offset-y: calc((var(--dimension-grid-y)) * 1px );
  --line-offset: 10px;

  padding-top: 50px;
  background: var(--color-background);

  & > div {
    position: relative;
  }
}

.lines + .lines {
  margin-top: calc((var(--dimension-grid-y) * 1px) * 3 - 1px);
}

.lines {
  position: relative;
  display: flex;
  flex-direction: column;
  gap: calc((var(--dimension-grid-y)) * 1px - 1px);

/* opacity: 0.6; */

  & > div:not(.end) {
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

  & .end {
    position: absolute;
    top: 0;
    right: 0;
    display: flex;
    gap: 5px;
    height: 100%;

    &::before {
      width: 1px;
      content: "";
      background: var(--color-foreground);
    }

    &::after {
      width: 5px;
      content: "";
      background: var(--color-foreground);
    }
  }

}

.notes {
  position: absolute;
  bottom: 0;
  left:0;
  display: flex;
  width: 100%;
  height: calc(var(--dimension-grid-y) * 1px * 4 );

  /* gap: 8px; */

  & .note {
    position: relative;
    bottom: 0;
    bottom: calc(-1 * var(--dimension-grid-y) * 1px * 1.5 + var(--position) * 9 * 1px);
    display: flex;
    align-items: flex-end;
    width: calc(var(--dimension-grid-x) * 1px);
    height: calc(var(--dimension-grid-y) * 1px);

  }
}

</style>
