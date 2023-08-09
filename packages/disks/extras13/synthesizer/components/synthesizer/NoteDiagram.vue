<template>
  <div class="note-diagram" :style="style">
    <div>
      <div v-for="(v,index) in Array(Math.round(octaveCount / 2)).fill({})" :key="index" ref="grid" class="container">
        <div class="time-signatures">
          <span>{{ beat }}</span>
          <span>{{ baseBeat }}</span>
        </div>
        <div>
          <div class="grid">
            <i />
            <i />
            <i />
            <i />
            <i />
            <div class="barline" />
            <div class="bold-double-barline" />
          </div>
          <div ref="notes" class="notes">
            <note-group
              v-for="(group, index) in visibleGroupedNoted"
              :key="index"
              v-bind="group"
              :beat="beat"
              :base-beat="baseBeat"
              :start-octave="startOctave"
            />
            <!-- <note
              v-for="(note, index) in visibleNotes"
              :key="index"
              class="note"
              v-bind="note"
              :style="{'--position': getNotePosition(note),'--position-mod': (getNotePosition(note) % 2)}"
            /> -->
          </div>
        </div>
      </div>
    </div>
    <br><br>{{ groupedNotes.map((note) => note) }}
  </div>
</template>

<script>

import * as Tone from 'tone';

import { ipoint } from '@js-basics/vector';
import NoteGroup from './NoteGroup';
import { DIMENSION as NOTE_DIMENSION } from './Note';

export default {
  components: { NoteGroup },
  props: {

    beat: {
      type: Number,
      default: 4
    },
    baseBeat: {
      type: Number,
      default: 4
    },

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
      gridDimension: ipoint(NOTE_DIMENSION.x, 9)
    };
  },

  computed: {
    style () {
      return {
        '--length': this.beat,
        '--octave-count': this.octaveCount,
        ...this.gridDimension.toCSSVars('dimension-grid')
      };
    },

    // || group.length ===
    // https://www.musik-verstehen-lernen.de/index.php/der-takt
    groupedNotes () {
      const notes = [];
      let time = null;
      let group = [];
      for (let i = 0; i < this.notes.length; i++) {
        const note = this.notes[Number(i)];

        if (note.time !== time ||
        group?.notes?.length >= this.getResolvedItem(note.time)
        ) {
          group = { time: note.time, notes: [] };
          notes.push(group);
        }
        time = note.time;
        group.notes.push({ ...note, position: this.getNotePosition(note) });
      }
      return notes;
    },

    visibleGroupedNoted () {
      let test = 0;
      const groups = [];
      for (let i = this.groupedNotes.length - 1; i >= 0; i--) {
        const groupedNote = this.groupedNotes[i];
        test += groupedNote.notes.length / this.getResolvedItem(groupedNote.time);
        console.log('test', test, groupedNote, groupedNote.notes.length, this.getResolvedItem(groupedNote.time));
        if (test > 4) {
          console.log('jooo');
          break;
        }
        groups.unshift(groupedNote);
      }
      // console.log(this.groupedNotes.map(({ time, notes }) => ({ time, time_: notes.length / this.getResolvedItem(time), notes: notes.length })));
      return groups;
    },

    visibleNotes () {
      const notes = [];
      for (let i = 0; i < this.notes.length; i++) {
        notes.push({ ...this.notes[Number(i)], last: this.notes[i - 1], next: this.notes[i + 1] });
      }

      const length = this.prepareTime(this.length);

      const start = Math.max(notes.length - length, 0);
      return notes.slice(start, start + length);
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

  methods: {
    getResolvedItem (time) {
      return 1 / Tone.Time(time).toSeconds();
    },
    prepareTime (time) {
      return Number(time.replace(/(\d).+/, '$1'));
    },
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

.grid + .grid {
  margin-top: calc((var(--dimension-grid-y) * 1px) * 3 - 1px);
}

.time-signatures {
  display: flex;
  flex-direction: column;
  gap: 0;
  align-items: center;
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
  gap: 4px;

/* opacity: 0.6; */

  & .grid {
  position: relative;
  display: flex;
    flex:1;
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

    & .barline {
      position: absolute;
      top: 0;
      right: 50%;
      display: flex;
      height: 100%;

      &::before {
        width: 0;
        content: "";
        border-right: solid 1px var(--color-foreground);
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
        content: "";
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

}

.notes {
  position: absolute;
  right: 0;
  bottom: 0;
  left: 0;
  display: flex;

  /* gap: calc(var(--dimension-grid-x) * (var(--length) * 2 - (var(--length) - 1) * 2) * 1px); */
  height: calc(var(--dimension-grid-y) * 1px * 4 );

  /* gap: 8px; */

  & :deep(.note) {
    position: relative;
    bottom: 0;
    bottom: calc(-1 * var(--dimension-grid-y) * 1px * 1.5 + var(--position) * 9 * 1px);
    display: flex;
    align-items: flex-end;
    justify-content: center;

    /* width: calc(100% / var(--length)); */

    /* width: calc(var(--dimension-grid-x) * 1px); */
    height: calc(var(--dimension-grid-y) * 1px);

  }
}

</style>
