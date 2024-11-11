import * as Tone from 'tone';
import { reactive, onMounted } from 'vue';
import Deferred from '../Deferred';

const readyDeferred = new Deferred();

let tone;
export default function useTone() {
  tone =
    tone ||
    reactive({
      getTone: () => Tone,
      destination: null,
      transport: Tone.Transport,
      ready: false,
      awaitReady: readyDeferred.promise,
      async start() {
        await Tone.start();
        // this.destination = new Tone.Merge().toDestination();
        // this.transport.start();
        this.ready = true;
        readyDeferred.resolve(Tone);
        return Tone;
      },
      setBpm(bpm, beforeStart) {
        const transport = this.transport;
        transport.stop();
        transport.bpm.value = 120;
        transport.seconds = 0;
        transport.bpm.value = bpm;
        if (typeof beforeStart === 'function') {
          beforeStart();
        }
        transport.start();
      }
    });

  onMounted(() => {
    window.Tone = Tone;
  });

  return {
    tone
  };
}
