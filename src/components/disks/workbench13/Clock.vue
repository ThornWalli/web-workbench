<template>
  <div class="wb-disks-workbench13-clock">
    <canvas ref="canvas" />
    <span class="clock__period">{{ timeAmPm }}</span>
  </div>
</template>

<script>
import { ipoint } from '@js-basics/vector';
import MixinWindowComponent from '@/components/mixins/WindowComponent';
import contextMenu from '@/web-workbench/disks/workbench13/clock/contextMenu';

export default {
  mixins: [
    MixinWindowComponent
  ],

  data () {
    return {
      sprites: [],
      periodPM: false,
      interval: null
    };
  },
  computed: {
    timeAmPm () {
      return this.periodPM ? 'PM' : 'AM';
    },
    contextMenu () {
      return contextMenu({ core: this.core });
    }
  },

  destroyed () {
    global.clearInterval(this.interval);
  },

  mounted () {
    const canvas = this.$refs.canvas;
    canvas.width = this.$el.offsetWidth;
    canvas.height = this.$el.offsetHeight;

    this.sprites = generatesSprites(canvas.width, canvas.height, 2);
    this.render(canvas, canvas.getContext('2d'));
  },

  methods: {
    render (canvas, context) {
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
      context.fillStyle = '#000000';
      context.fill();
      context.scale(1, 0.985);

      const sprites = this.sprites;

      const renderTick = (cb) => {
        global.requestAnimationFrame(() => {
          context.drawImage(sprites[3], -center.x, -center.y, size.x, size.y);
          context.drawImage(sprites[4], -center.x, -center.y, size.x, size.y);

          context.strokeStyle = '#000000';
          context.setTransform(1, 0, 0, 1, 0, 0);

          const date = new Date();
          this.periodPM = date.getHours() > 12;

          drawClockHands(sprites, date, context, center, size);

          const imageData = context.getImageData(0, 0, size.x, size.y);
          const data = imageData.data;
          for (let i = 0; i < data.length; i += 4) {
            const r = data[Number(i)];
            const g = data[i + 1];
            const b = data[i + 2];
            if (!(r === 255 && g === 170 && b === 82)) {
              const v = 0.2126 * r + 0.7152 * g + 0.0722 * b >= 50 ? 255 : 0;
              data[Number(i)] = data[i + 1] = data[i + 2] = v;
            }
          }
          context.putImageData(imageData, 0, 0);

          if (cb) {
            cb();
          }
        });
      };

      renderTick(() => {
        this.interval = global.setInterval(renderTick, 1000);
      });
    }
  }

};

function drawDial (context, radius, strokeWidth) {
  context.beginPath();
  context.arc(0, 0, radius - strokeWidth, 0, 2 * Math.PI, false);
  context.fillStyle = '#ffffff';
  context.fill();
}

function drawSegments (context, radius) {
  let i;
  // Segments
  for (i = 0; i < 60; i++) {
    context.rotate(-Math.PI / 2);
    context.beginPath();
    const y = 0 - radius + 12;
    const height = 6;
    context.moveTo(0, y);
    context.lineTo(0, y - height);
    context.rotate(Math.PI / 3 / 5);
    context.lineWidth = 2;
    context.strokeStyle = '#000000';
    context.stroke();
  }

  context.rotate(-(Math.PI / 3 / 5) * 60);

  for (i = 0; i < 16; i++) {
    context.rotate(-Math.PI / 2);
    context.beginPath();
    const y = 0 - radius + 15;
    const width = 6;
    const height = 10;
    context.moveTo(0, y);
    context.lineTo(0 + width / 2, y - height / 2);
    context.lineTo(0, y - height);
    context.lineTo(0 - width / 2, y - height / 2);
    context.lineTo(0, y);
    context.rotate(Math.PI / 3);
    context.fillStyle = '#000000';
    context.fill();
  }
  context.rotate((-Math.PI / 3) * 16);
}

function drawClockHands (sprites, date, context, center, size) {
  const hours = date.getHours() * ((Math.PI * 2) / 12) + (((Math.PI * 2) / 12) * date.getMinutes()) / 60;
  const minutes = date.getMinutes() * ((Math.PI * 2) / 60);
  const seconds = date.getSeconds() * ((Math.PI * 2) / 60);

  // Hours
  context.translate(center.x, center.y);
  context.rotate(hours);
  context.drawImage(sprites[0], -center.x, -center.y, size.x, size.y);
  context.rotate(-hours);

  // Minutes
  context.rotate(minutes);
  context.drawImage(sprites[1], -center.x, -center.y, size.x, size.y);
  context.rotate(-minutes);

  // Seconds
  context.rotate(seconds);
  context.drawImage(sprites[2], -center.x, -center.y, size.x, size.y);
  context.rotate(-seconds);
}

function generatesSprites (width, height, strokeWidth) {
  const offset = 5;
  const radius = width / 2 - offset;
  const center = ipoint(() => radius + offset);

  const funcs = [
    (context, canvas) => {
      context.translate(center.x, center.y);

      const hourArrowWidth = 3;
      const hourArrowHeight = [
        0.5, 0.34
      ];
      const hourArrowCenterX = 0;
      const hourArrowCenterY = 0;

      context.beginPath();
      context.moveTo(hourArrowCenterX, hourArrowCenterY);
      context.lineTo(hourArrowCenterX - hourArrowWidth, hourArrowCenterY - (canvas.width / 2) * hourArrowHeight[1]);

      context.lineTo(hourArrowCenterX, hourArrowCenterY - (canvas.width / 2) * hourArrowHeight[0]);
      context.lineTo(hourArrowCenterX + hourArrowWidth, hourArrowCenterY - (canvas.width / 2) * hourArrowHeight[1]);
      context.lineTo(hourArrowCenterX, hourArrowCenterY);
      context.strokeStyle = '#000000';
      context.fillStyle = '#000000';
      context.stroke();
      context.fill();
    },
    (context, canvas) => {
      context.translate(center.x, center.y);

      const minuteArrowWidth = 4;
      const minuteArrowHeight = [
        0.7, 0.54
      ];
      const minuteArrowCenterX = 0;
      const minuteArrowCenterY = 0;

      context.beginPath();
      context.moveTo(minuteArrowCenterX, minuteArrowCenterY);
      context.lineTo(minuteArrowCenterX - minuteArrowWidth, minuteArrowCenterY - (canvas.width / 2) * minuteArrowHeight[1]);

      context.lineTo(minuteArrowCenterX, minuteArrowCenterY - (canvas.width / 2) * minuteArrowHeight[0]);
      context.lineTo(minuteArrowCenterX + minuteArrowWidth, minuteArrowCenterY - (canvas.width / 2) * minuteArrowHeight[1]);
      context.lineTo(minuteArrowCenterX, minuteArrowCenterY);
      context.strokeStyle = '#000000';
      context.fillStyle = '#000000';
      context.stroke();
      context.fill();
    },
    (context, canvas) => {
      context.translate(center.x, center.y);

      const secondArrowWidth = 0;
      const secondArrowHeight = 0.74;
      const secondArrowCenterX = 0;
      const secondArrowCenterY = 0;

      context.beginPath();
      context.moveTo(secondArrowCenterX, secondArrowCenterY);
      context.lineTo(secondArrowCenterX + secondArrowWidth, secondArrowCenterY - (canvas.width / 2) * secondArrowHeight);
      context.lineTo(secondArrowCenterX, secondArrowCenterY);
      context.strokeStyle = '#FFAA52';
      context.stroke();
    },
    (context, canvas) => {
      context.translate(center.x, center.y);
      drawDial(context, radius, strokeWidth);
    },
    (context, canvas) => {
      context.translate(center.x, center.y);
      drawSegments(context, radius);
    }
  ];

  return funcs.map((func) => {
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const context = canvas.getContext('2d');
    context.imageSmoothingEnabled = false;
    func(context, canvas);
    return canvas;
  });
}

// 'use strict';

// import ApplicationControl from '../../../base/ApplicationController';
// import menuItems from './clock/menuItems';

//     bindings: Object.assign({}, ApplicationControl.prototype.bindings, {
//         'model.periodPM': {
//             type: 'booleanClass',
//             name: 'js--period-pm'
//         }
//     }),

//     events: {},

//     initialize() {
//         ApplicationControl.prototype.initialize.apply(this, arguments);

//         this.canvasEl = this.queryByHook('canvas');
//         this.canvasEl.width = this.el.offsetWidth;
//         this.canvasEl.height = this.el.offsetHeight;

//         render
//             .bind(this)(this.canvasEl, this.canvasEl.getContext('2d'))
//             .then(() => {
//                 this.model.applicationReady = true;
//             });
//     },

//     destroy() {
//         if (this.interval) {
//             global.clearInterval(this.interval);
//         }
//     }
// });

</script>

<style lang="postcss">

.wb-disks-workbench13-clock {
  position: relative;
  width: calc(157px + 10px);
  height: calc(157px + 10px);
  background: $workbenchColor_3;

  & canvas {
    display: block;
    width: 100%;
    height: 100%;
  }

  & .clock__period {
    position: absolute;
    top: var(--default-element-margin);
    right: var(--default-element-margin);
  }
}

</style>
