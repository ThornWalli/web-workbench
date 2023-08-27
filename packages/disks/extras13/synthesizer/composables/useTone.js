import * as Tone from 'tone';
import { reactive, onMounted } from 'vue';
import Deferred from '../Deferred';

const readyDeferred = new Deferred();

const tone = reactive({
  destination: null,
  transport: Tone.Transport,
  ready: false,
  awaitReady: readyDeferred.promise,
  async start() {
    await Tone.start();
    // this.destination = new Tone.Merge().toDestination();
    // this.transport.start();
    this.ready = true;
    readyDeferred.resolve();
  },
  setBpm(bpm, callback) {
    const transport = this.tone.transport;
    transport.stop();
    transport.bpm.value = 120;
    transport.seconds = 0;
    callback();
    transport.bpm.value = bpm;
    transport.start();
  }
});

export default function useTone() {
  onMounted(() => {
    window.Tone = Tone;
  });

  return {
    tone
  };
}
