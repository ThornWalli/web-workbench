<template>
  <ul>
    <li v-for="note in visibleNotes" :key="note">
      <canvas
        :width="noteRenderer.dimension.x"
        :height="noteRenderer.dimension.y"></canvas>
    </li>
  </ul>
</template>
<script>
import NoteRenderer from '../../classes/NoteRenderer';
import SvgNote from '../../assets/svg/note_canvas.svg?raw';
import NoteDescription from '../../classes/NoteDescription';

export default {
  emits: ['refresh'],
  data: function () {
    return {
      noteRenderer: null,
      svgNode: null,
      notes: [
        [
          ['C#', '2m'],
          ['C#2', '2m'],
          ['C#2', '2m.'],
          ['C#', '1m'],
          ['C#2', '1m'],
          ['C#2', '1m.'],
          ['C#', '2n.'],
          ['C#2', '2n'],
          ['C#2', '2n.'],
          ['C#2', '4n.']
        ],
        [
          ['', '2m'],
          ['', '1m'],
          ['', '2n'],
          ['', '4n'],
          ['', '8n'],
          ['', '16n'],
          ['', '32n']
        ],
        [
          ['C4', '2m'],
          ['C4', '1m'],
          ['C4', '2n'],
          ['C4', '4n'],
          ['C4', '8n'],
          ['C4', '16n'],
          ['C4', '32n']
        ],
        [
          ['C4', '2m.'],
          ['C4', '1m.'],
          ['C4', '2n.'],
          ['C4', '4n.'],
          ['C4', '8n.'],
          ['C4', '16n.'],
          ['C4', '32n.']
        ]
      ]

        .flat()
        .map(([note, time]) => new NoteDescription({ note, time })),
      durations: [
        ['1m', '2m', '2n', '4n', '8n', '16n', '32n'],
        ['1m', '2m', '2n', '4n.', '8n.', '16n.', '32n.']
      ].flat()
    };
  },

  computed: {
    visibleNotes() {
      return this.noteRenderer ? this.notes : [];
    }
  },

  mounted() {
    const parser = new DOMParser();
    window.svgNode = this.svgNode = parser
      .parseFromString(SvgNote, 'image/svg+xml')
      .querySelector('svg');

    this.noteRenderer = new NoteRenderer(this.svgNode);

    this.$nextTick(async () => {
      const canvasEls = Array.from(this.$el.querySelectorAll('canvas'));
      await Promise.all(
        canvasEls.map((canvas, index) => {
          return this.render(canvas, this.notes[Number(index)]);
        })
      );

      this.$emit('refresh');
    });
  },

  methods: {
    async render(canvas, noteDescription) {
      const ctx = canvas.getContext('2d');
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const frame = await this.noteRenderer.render(noteDescription, {
        colors: {
          primary: '#ffffff',
          secondary: '#000000',
          tertiary: '#ff0000'
        }
      });

      canvas.width = frame.canvas.width;
      canvas.height = frame.canvas.height;

      ctx.drawImage(frame.canvas, 0, 0);
    }
  }
};
</script>

<style lang="postcss" scoped>
ul {
  display: flex;
  flex-wrap: wrap;
  gap: 5px 0;
  width: calc(100% - 10px);
  margin: 5px;

  & > li {
    display: flex;
    align-items: center;
    justify-content: center;
    width: calc(100% / 8);
  }
}

canvas {
  /* background: red; */
}
</style>
