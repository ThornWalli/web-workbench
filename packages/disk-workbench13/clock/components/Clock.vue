<template>
  <div ref="rootEl" class="wb-disks-workbench13-clock">
    <canvas ref="canvasEl" />
    <span class="period">{{ timeAmPm }}</span>
  </div>
</template>

<script setup>
import { ipoint } from '@js-basics/vector';

import contextMenu from '../contextMenu';
import { generatesSprites, drawClockHands } from '../utils';
import useWindow from '@web-workbench/core/composables/useWindow';
import { computed, onMounted, onUnmounted, ref } from 'vue';

const { setContextMenu } = useWindow();
setContextMenu(contextMenu);

const rootEl = ref(null);
const canvasEl = ref(null);
const colors = ref(['#888888', '#000000', '#FFAA55']);
const generatedSprites = ref([]);
const periodPM = ref(false);
let interval = ref(null);

const timeAmPm = computed(() => (periodPM.value ? 'PM' : 'AM'));

onMounted(() => {
  const canvas = canvasEl.value;
  canvas.width = rootEl.value.offsetWidth;
  canvas.height = rootEl.value.offsetHeight;

  generatedSprites.value = generatesSprites(
    canvas.width,
    canvas.height,
    2,
    colors.value
  );
  render(canvas, canvas.getContext('2d'));
});

onUnmounted(() => {
  window.clearInterval(interval.value);
});

function render(canvas, context) {
  const offset = 5;
  const radius = canvas.width / 2 - offset;
  const center = ipoint(() => radius + offset);

  const size = ipoint(canvas.width, canvas.height);

  context.imageSmoothingEnabled = false;

  context.setTransform(1, 0, 0, 1, 0, 0);
  context.translate(center.x, center.y);

  context.scale(1, 1.015);
  context.beginPath();
  context.arc(0, 0, radius, 0, 2 * Math.PI, false);
  context.fillStyle = colors.value[1];
  context.fill();
  context.scale(1, 0.985);

  const sprites = generatedSprites.value;

  const renderTick = cb => {
    window.requestAnimationFrame(() => {
      context.drawImage(sprites[3], -center.x, -center.y, size.x, size.y);
      context.drawImage(sprites[4], -center.x, -center.y, size.x, size.y);

      context.strokeStyle = colors.value[1];
      context.setTransform(1, 0, 0, 1, 0, 0);

      const date = new Date();
      periodPM.value = date.getHours() > 12;

      context.translate(center.x, center.y);
      drawClockHands(sprites, date, context, center, size);

      const imageData = context.getImageData(0, 0, size.x, size.y);
      const data = imageData.data;
      for (let i = 0; i < data.length; i += 4) {
        const r = data[Number(i)];
        const g = data[i + 1];
        const b = data[i + 2];
        if (!(r === 255 && g === 170 && b === 85)) {
          const v = 0.2126 * r + 0.7152 * g + 0.0722 * b >= 50 ? 255 : 0;
          if (0.2126 * r + 0.7152 * g + 0.0722 * b >= 50) {
            data[Number(i)] = data[i + 1] = data[i + 2] = v;
          }
        }
      }
      context.putImageData(imageData, 0, 0);

      if (cb) {
        cb();
      }
    });
  };

  renderTick(() => {
    interval.value = window.setInterval(renderTick, 1000);
  });
}
// export default {
//   unmounted() {
//     window.clearInterval(this.interval);
//   },

//   mounted() {
//     const canvas = this.$refs.canvas;
//     canvas.width = this.$el.offsetWidth;
//     canvas.height = this.$el.offsetHeight;

//     this.sprites = generatesSprites(
//       canvas.width,
//       canvas.height,
//       2,
//       colors.value
//     );
//     this.render(canvas, canvas.getContext('2d'));
//   },

//   methods: {
//     render(canvas, context) {
//       const offset = 5;
//       const radius = canvas.width / 2 - offset;
//       const center = ipoint(() => radius + offset);

//       const size = ipoint(canvas.width, canvas.height);

//       context.imageSmoothingEnabled = false;

//       context.setTransform(1, 0, 0, 1, 0, 0);
//       context.translate(center.x, center.y);

//       context.scale(1, 1.015);
//       context.beginPath();
//       context.arc(0, 0, radius, 0, 2 * Math.PI, false);
//       context.fillStyle = colors.value[1];
//       context.fill();
//       context.scale(1, 0.985);

//       const sprites = this.sprites;

//       const renderTick = cb => {
//         window.requestAnimationFrame(() => {
//           context.drawImage(sprites[3], -center.x, -center.y, size.x, size.y);
//           context.drawImage(sprites[4], -center.x, -center.y, size.x, size.y);

//           context.strokeStyle = colors.value[1];
//           context.setTransform(1, 0, 0, 1, 0, 0);

//           const date = new Date();
//           this.periodPM = date.getHours() > 12;

//           context.translate(center.x, center.y);
//           drawClockHands(sprites, date, context, center, size);

//           const imageData = context.getImageData(0, 0, size.x, size.y);
//           const data = imageData.data;
//           for (let i = 0; i < data.length; i += 4) {
//             const r = data[Number(i)];
//             const g = data[i + 1];
//             const b = data[i + 2];
//             if (!(r === 255 && g === 170 && b === 85)) {
//               const v = 0.2126 * r + 0.7152 * g + 0.0722 * b >= 50 ? 255 : 0;
//               if (0.2126 * r + 0.7152 * g + 0.0722 * b >= 50) {
//                 data[Number(i)] = data[i + 1] = data[i + 2] = v;
//               }
//             }
//           }
//           context.putImageData(imageData, 0, 0);

//           if (cb) {
//             cb();
//           }
//         });
//       };

//       renderTick(() => {
//         this.interval = window.setInterval(renderTick, 1000);
//       });
//     }
//   }
// };
</script>

<style lang="postcss" scoped>
.wb-disks-workbench13-clock {
  position: relative;
  width: calc(157px + 10px);
  height: calc(157px + 10px);

  & canvas {
    display: block;
    width: 100%;
    height: 100%;
  }

  & .period {
    position: absolute;
    top: var(--default-element-margin);
    right: var(--default-element-margin);
  }
}
</style>
