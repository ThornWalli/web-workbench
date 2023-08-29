<template>
  <div
    class="note-group"
    :style="{
      '--count': count,
      '--notes': notes.length,
      '--note-count': noteCount
    }"
    :data-duration="duration">
    <note
      v-for="(note, index) in preparedNotes"
      v-bind="note"
      :key="index"
      @click="onClick(note)" />
  </div>
</template>
<script>
import Note from './Note';
export default {
  components: { Note },

  props: {
    count: {
      type: Number,
      default: 1
    },
    duration: {
      type: [String, Number],
      default: '4n'
    },
    notes: {
      type: Array,
      default() {
        return [];
      }
    }
  },

  emits: ['note:click'],
  computed: {
    noteCount() {
      if (typeof this.duration === 'number') {
        return this.duration;
      }
      const matches = this.duration.match(/(\d+)([a-z]+).*/);
      return Number(matches[1]);
    },
    preparedNotes() {
      const notes = [];
      for (let i = 0; i < this.notes.length; i++) {
        notes.push({
          ...this.notes[Number(i)],
          last: this.notes[i - 1],
          next: this.notes[i + 1]
        });
      }

      return notes;
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
.note-group {
  display: flex;
  justify-content: flex-start;
  width: calc(100% * var(--count) * var(--notes));

  & :deep(.note) {
    justify-content: flex-start;
    width: calc(100% / var(--notes));
  }
}
</style>
