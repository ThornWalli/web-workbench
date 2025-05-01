import * as Tone from 'tone';
import { reactive, onMounted } from 'vue';
import Deferred from '../Deferred';

const readyDeferred = new Deferred<typeof Tone>();

export interface ToneInterface {
  getTone: () => typeof Tone;
  destination: null;
  transport: ReturnType<typeof Tone.getTransport>;
  ready: boolean;
  awaitReady: Promise<typeof Tone>;
  start: () => Promise<typeof Tone>;
  setBpm: (bpm: number, beforeStart?: () => void) => void;
}

let tone: ToneInterface;
export default function useTone() {
  tone =
    tone ||
    reactive<ToneInterface>({
      getTone: () => Tone,
      destination: null,
      transport: Tone.getTransport(),
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

declare global {
  interface Window {
    Tone: typeof Tone;
  }
}
