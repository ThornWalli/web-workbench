<template>
  <div class="note-group" :data-time="time">
    <note
      v-for="(note, index) in preparedNotes"
      v-bind="{...note,
               startOctave,
               beat,
               baseBeat}"
      :key="index"
    />
  </div>
</template>
<script>

import Note from './Note';
export default {
  components: { Note },

  props: {

    beat: {
      type: Number,
      default: 4
    },
    baseBeat: {
      type: Number,
      default: 4
    },
    startOctave: {
      type: Number,
      default: 4
    },
    notes: {
      type: Array,
      default () {
        return [];
      }
    },
    time: {
      type: String,
      default: '8n'
    }
  },
  computed: {
    preparedNotes () {
      const notes = [];
      for (let i = 0; i < this.notes.length; i++) {
        notes.push({ ...this.notes[Number(i)], last: this.notes[i - 1], next: this.notes[i + 1] });
      }

      return notes;
    }
  }

};
</script>

<style lang="postcss" scoped>

.note-group {
  display: flex;

&[data-time="2m"] {
  justify-content: flex-start;
  width: 100%;
}

&[data-time="1m"] {
  justify-content: flex-start;
  width: 50%;
}

  &[data-time="2n"] {
    justify-content: flex-start;
    width: calc(50% / 2);
  }

&[data-time="4n"] {
  justify-content: space-evenly;
  width: calc(100% / 4);
}

&[data-time="8n"] {
  justify-content: flex-start;
  width: calc(100% / 4);
}

&[data-time="16n"] {
  justify-content: flex-start;
  width: calc(100% / 2);
}

&[data-time="64n"] {
  justify-content: flex-start;
  width: calc(100% / 1);
}
}

</style>
