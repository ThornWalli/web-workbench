<template>
  <div>
    <wb-button v-if="!started" label="Start Audio" @click="onClick"></wb-button>
    <fieldset>
      <legend>Inputs:</legend>
      <ul>
        <li v-for="input in midiController.inputs" :key="input.id">
          <wb-button
            :label="`${input.name}`"
            @click="onClickSelectInput(input)"></wb-button>
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
          {{ note.name }} | {{ note.octave }} |
          {{ note.accidental === '#' ? 'flat' : '' }}
        </li>
      </ul>
    </fieldset>
  </div>
</template>
<script>
import useWindow, {
  windowProps,
  windowEmits
} from '@web-workbench/core/composables/useWindow';
import { Subscription, filter } from 'rxjs';
import WbButton from '@web-workbench/core/components/atoms/Button';
import { CONFIG_NAMES as CORE_CONFIG_NAMES } from '@web-workbench/core/classes/Core/utils';
import MidiController from '../../classes/MidiController';

export default {
  components: { WbButton },

  props: {
    ...windowProps
  },
  emits: [...windowEmits],

  setup(props, context) {
    const windowContext = useWindow(props, context);
    return { ...windowContext };
  },

  data() {
    return {
      started: false,
      notes: [],
      subscriptions: new Subscription(),
      midiController: new MidiController()
    };
  },

  unmounted() {
    this.subscriptions.unsubscribe();
  },

  async mounted() {
    await this.midiController.start();
    this.started = true;
  },
  methods: {
    onClickSelectInput(input) {
      this.notes = [];

      const observable = this.midiController.listen(input);
      this.subscriptions.add(
        observable
          .pipe(filter(({ type }) => type === 'volume'))
          .subscribe(({ value }) => {
            console.log('Volume: ', value);
            this.core.config.set(CORE_CONFIG_NAMES.SCREEN_CONFIG, {
              ...this.core.config.get(CORE_CONFIG_NAMES.SCREEN_CONFIG),
              soundVolume: value
            });
          }),
        observable
          .pipe(filter(({ type }) => type === 'note'))
          .subscribe(({ value }) => {
            this.notes.push(value);
          })
      );

      console.log('Listen input: ', input);
    },
    async onClick() {
      await this.midiController.start();
    }

    // onMIDIMessage(event) {
    //   let str = `MIDI message received at timestamp ${event.timeStamp}[${event.data.length} bytes]: `;
    //   for (const character of event.data) {
    //     str += `0x${character.toString(16)} `;
    //   }
    //   console.log(str);
    // },
    // startLoggingMIDIInput(midiAccess, indexOfPort) {
    //   midiAccess.inputs.forEach(entry => {
    //     entry.onmidimessage = this.onMIDIMessage.bind(this);
    //   });
    // }
  }
};
</script>
