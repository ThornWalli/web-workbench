<template>
  <div class="test">
    <span>Instrument: <strong>{{ displayInstrument }}</strong></span> |
    <span>Time: <strong>{{ displayTime }} ({{ time }})</strong></span> |
    <span>Volume: <strong>{{ decibel }} db</strong></span>
  </div>
</template>

<script>
import { getInstruments, getTimes } from '../../utils';

export default {
  props: {
    instrument: {
      type: String,
      default: null
    },
    time: {
      type: String,
      default: null
    },
    decibel: {
      type: Number,
      default: 0.5
    }
  },
  computed: {
    displayInstrument () {
      return getInstruments()[this.instrument];
    },
    displayTime () {
      return getTimes()[this.time];
    }
  }
};
</script>

<style lang="postcss" scoped>

.test {
  --color-info-background: var(--color-synthesizer-info-background, #fff);
  --color-info-color: var(--color-synthesizer-info-background, #05a);

  display: flex;
  gap: 4px;
  width: 100%;
  padding: 2px;
  color: var(--color-info-color);

  /* line-height: 1; */
  background: var(--color-info-background);
}

</style>
