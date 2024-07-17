<template>
  <div>
    <metronom-midi
      :model="metronom"
      :midi-controller="midiController"
      @speed="onSpeed"
      @note="onNote"
      @reset="track.reset()"
      @value="onMetronomValue">
      <template #background="{ onRefresh }">
        <timeline-canvas v-if="track" :track="track" @refresh="onRefresh" />
      </template>
    </metronom-midi>
    <pre>{{ { selectedIndex: track.selectedIndex } }}</pre>
    <fieldset>
      <legend>Inputs:</legend>
      <ul>
        <li v-for="input in midiController.inputs" :key="input.id">
          <wb-button
            :label="`${input.name}`"
            @click="onClickSelectInput(input)" />
        </li>
      </ul>
    </fieldset>
    <fieldset>
      <legend>Outputs:</legend>
      <ul>
        <li v-for="output in midiController.outputs" :key="output.id">
          {{ output }}
        </li>
      </ul>
    </fieldset>
    <fieldset>
      <legend>Notes:</legend>
      <ul>
        <li v-for="(note, index) in notes" :key="index">
          {{ note.getName()?.toUpperCase() }} |
          {{ note.getTime()?.toUpperCase() }} |
          {{ note.delay }}
        </li>
      </ul>
    </fieldset>
    <!-- <wb-button v-if="!started" label="Start Audio" @click="onClick"></wb-button> -->
  </div>
</template>
<script>
import { Subscription } from 'rxjs';
import WbButton from '@web-workbench/core/components/atoms/Button';
import MidiController from '../../classes/MidiController';
import useTone from '../../composables/useTone';
import MetronomMidi from '../synthesizer/Metronom/Midi.vue';
import Metronom from '../../classes/Metronom';

import TimelineCanvas from '../synthesizer/TimelineCanvas.vue';
import Track from '../../classes/Track';
import useWindow from '@web-workbench/core/composables/useWindow';

export default {
  components: { TimelineCanvas, MetronomMidi, WbButton },

  async setup() {
    const windowContext = useWindow();

    return { ...windowContext, ...(await useTone()) };
  },

  data() {
    const metronom = new Metronom();
    return {
      startOffset: 0,
      metronom,
      started: false,
      openNotes: {},
      notes: [],
      subscriptions: new Subscription(),
      midiController: new MidiController(),

      track: new Track({
        beatCount: 1,
        speed: metronom.speed
      }),

      value: 0
    };
  },

  computed: {
    test() {
      return Object.entries(this.openNotes).map(([note, timestamp]) => {
        const duration = (window.Tone.now() - timestamp) / this.metronom.speed;
        const time = new window.Tone.Time(
          [1, 2, 4, 8, 16, 32].map(v => 2 / v).find(v => v <= duration)
        );

        return {
          value: this.value,
          duration,
          note,
          time: time.toNotation()
        };
      });
    }
  },

  unmounted() {
    this.subscriptions.unsubscribe();
    this.midiController.destroy();
  },

  methods: {
    onSpeed(speed) {
      this.track.speed = speed;
    },
    onMetronomDraw(ctx, { dimension }) {
      const openNotes = Object.values(this.openNotes);
      for (let i = 0; i < openNotes.length; i++) {
        const openNote = openNotes[Number(i)];

        const duration = window.Tone.now() - openNote;
        const w =
          (duration * dimension.x) / (window.Tone.Transport.bpm.value / 60);
        ctx.fillRect((dimension.x - w) / 2, 0, w, dimension.y);
      }
    },

    onMetronomStop() {
      // empty
    },

    onNote(note) {
      this.track.addNote(note);
    },
    onMetronomValue(value) {
      this.value = value;
    }
  }
};
</script>
