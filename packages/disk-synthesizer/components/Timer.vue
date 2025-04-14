<template>
  <div class="timer">
    <span :style="style" />
  </div>
</template>
<script>
import * as Tone from 'tone';
export default {
  data: function () {
    return {
      value: 0
    };
  },
  computed: {
    style() {
      return {
        '--value': this.value
      };
    }
  },
  mounted() {
    this.start();
  },
  methods: {
    start() {
      let tick = 0;
      const seconds = new Tone.Time('4n').toSeconds();
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const loop = new Tone.Loop(() => {
        // triggered every eighth note.
        this.value = (tick % 4) / 4;
        // console.log((time % 4) / 4);
        tick += seconds;
      }, '4n').start(0);
      Tone.Transport.start();

      // Tone.Transport.schedule(time => {
      // use the time argument to schedule a callback with Draw
      //   Tone.Draw.schedule(() => {
      //     // do drawing or DOM manipulation here
      //     console.log(time);
      //   }, time);
      // });
      // Tone.Transport.start();
    }
  }
};
</script>

<style lang="postcss" scoped>
.timer {
  position: absolute;
  inset: 0;
  overflow: hidden;

  /* background: red; */

  & span {
    position: absolute;
    inset: 0;
    right: calc(var(--default-element-margin) * 2);
    left: calc(var(--default-element-margin) * 2 + 16px);
    transform: translateX(calc(var(--value) * 100%));

    /* transform: translateX(calc((2 / 8) * 100%)); */

    &::before {
      position: absolute;
      top: 0;
      left: 0;
      width: 1px;
      height: 100%;
      content: '';
      background: yellow;
    }
  }
}
</style>
