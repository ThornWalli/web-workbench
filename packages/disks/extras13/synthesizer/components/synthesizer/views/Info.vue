<template>
  <fieldset>
    <legend>Info</legend>
    <p>
      <span>Instrument: <strong>{{ displayInstrument }}</strong></span><br>
      <span>Time: <strong>{{ displayTime }}</strong></span><br>
      <span>Volume: <strong>{{ decibel }} db</strong></span>
    </p>
  </fieldset>
</template>

<script>
import { getInstruments, getTimes } from '../../../utils';

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
