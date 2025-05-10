<template>
  <ul ref="rootEl">
    <li v-for="note in visibleNotes" :key="note.name" :data-key="note.name">
      <canvas
        v-if="noteRenderer"
        :width="noteRenderer.dimension.x"
        :height="noteRenderer.dimension.y" />
    </li>
  </ul>
</template>

<script lang="ts" setup>
import NoteRenderer from '../../classes/NoteRenderer';
import SvgNote from '../../assets/svg/note_canvas.svg?raw';
import NoteDescription from '../../classes/NoteDescription';
import { getResizedCanvas } from '@web-workbench/core/utils/canvas';
import { computed, nextTick, onMounted, ref } from 'vue';

const rootEl = ref<HTMLElement | null>();
const $emit = defineEmits<{
  (e: 'refresh'): void;
}>();

const noteRenderer = ref<NoteRenderer>();
const svgNode = ref<SVGSVGElement | null>();

const $props = defineProps({
  density: {
    type: Number,
    default() {
      return window.devicePixelRatio || 1;
    }
  },
  notes: {
    type: Array<[string, string][]>,
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

declare global {
  interface Window {
    svgNode?: SVGSVGElement;
  }
}

onMounted(() => {
  const parser = new DOMParser();
  const node = parser
    .parseFromString(SvgNote, 'image/svg+xml')
    .querySelector('svg');
  if (!node) {
    throw new Error('SVG node not found');
  }
  window.svgNode = svgNode.value = node;

  noteRenderer.value = new NoteRenderer({
    svgNode: svgNode.value
  });

  nextTick(async () => {
    const canvasEls = Array.from(
      rootEl.value?.querySelectorAll('canvas') || []
    );
    await Promise.all(
      canvasEls.map((canvas, index) => {
        return render(canvas, preparedNotes.value[Number(index)]);
      })
    );

    $emit('refresh');
  });
});

const render = async (
  canvas: HTMLCanvasElement,
  noteDescription: NoteDescription
) => {
  const ctx = canvas.getContext('2d');
  if (!ctx) {
    throw new Error('Canvas context not found');
  }
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  const frame = await noteRenderer.value?.render(noteDescription, {
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
