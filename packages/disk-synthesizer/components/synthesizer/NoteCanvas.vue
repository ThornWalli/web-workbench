<template>
  <ul>
    <li v-for="note in visibleNotes" :key="note">
      <canvas
        :width="noteRenderer.dimension.x"
        :height="noteRenderer.dimension.y"></canvas>
    </li>
  </ul>
</template>

<script setup>
import NoteRenderer from '../../classes/NoteRenderer';
import SvgNote from '../../assets/svg/note_canvas.svg?raw';
import NoteDescription from '../../classes/NoteDescription';
import { getResizedCanvas } from '@web-workbench/core/utils/canvas';
import { computed, onMounted } from 'vue';

const $emit = defineEmits(['refresh']);

const noteRenderer = ref(null);
const svgNode = ref(null);

const $props = defineProps({
  density: {
    type: Number,
    default() {
      return window.devicePixelRatio || 1;
    }
  },
  notes: {
    type: Array,
    default: () => [
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
  }
});

const preparedNotes = computed(() =>
  $props.notes.flat().map(([note, time]) => new NoteDescription({ note, time }))
);

const visibleNotes = computed(() => {
  return noteRenderer.value ? preparedNotes.value : [];
});

onMounted(() => {
  const parser = new DOMParser();
  window.svgNode = svgNode.value = parser
    .parseFromString(SvgNote, 'image/svg+xml')
    .querySelector('svg');

  noteRenderer.value = new NoteRenderer(svgNode.value);

  nextTick(async () => {
    const canvasEls = Array.from(document.querySelectorAll('canvas'));
    await Promise.all(
      canvasEls.map((canvas, index) => {
        return render(canvas, preparedNotes.value[Number(index)]);
      })
    );

    $emit('refresh');
  });
});

const render = async (canvas, noteDescription) => {
  const ctx = canvas.getContext('2d');
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  const frame = await noteRenderer.value.render(noteDescription, {
    colors: {
      primary: '#ffffff',
      secondary: '#000000',
      tertiary: '#ff0000'
    }
  });

  canvas.width = frame.canvas.width * $props.density;
  canvas.height = frame.canvas.height * $props.density;
  canvas.style = `width: ${frame.canvas.width}px; height: ${frame.canvas.height}px;`;

  const resizedCanvas = getResizedCanvas(frame.canvas, canvas.width);

  ctx.drawImage(resizedCanvas, 0, 0);
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
  width: 100%;
}
</style>
