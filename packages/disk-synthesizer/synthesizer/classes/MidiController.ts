import { shareReplay, Subscription, Observable } from 'rxjs';
import type { Listener } from 'webmidi';
import { WebMidi } from 'webmidi';

export default class MidiController {
  subscriptions: Subscription;
  activeInput?: string;
  inputChannel = 1;
  activeOutput?: string;
  activeListeners: (Listener | Listener[])[] = [];
  inputs: MidiInput[] = [];
  outputs: MidiOutput[] = [];
  ready = false;
  midiChannel = 1;

  constructor() {
    this.subscriptions = new Subscription();
    this.inputs = [];
    this.ready = false;
  }

  get defaultInput() {
    return this.inputs[0];
  }

  get hasInputs() {
    return this.inputs.length > 0;
  }

  get input() {
    return this.inputs.find(input => input.id === this.activeInput);
  }

  get output() {
    return this.outputs.find(output => output.id === this.activeOutput);
  }

  async start() {
    try {
      if (await await navigator.requestMIDIAccess()) {
        await WebMidi.enable();
        this.inputs = Array.from(WebMidi.inputs.values()).map(
          input => new MidiInput(input)
        );
        this.outputs = Array.from(WebMidi.outputs.values()).map(
          output => new MidiOutput(output)
        );
        this.ready = true;
        return true;
      }
    } catch (e) {
      console.error(e);
      return false;
    }
  }

  listen(input = this.defaultInput, output = this.outputs[0]) {
    this.unlisten();

    const { channels } = WebMidi.getInputById(input.id);
    const synth = channels[Number(this.inputChannel)];

    this.activeInput = input.id;
    this.activeOutput = output.id;

    const observable = new Observable<{
      type: string;
      timestamp?: number;
      value: unknown;
    }>(subscriber => {
      this.activeListeners = [
        // synth.addListener('midimessage', e => {
        //   console.log('???', e);
        // }),
        synth.addListener('noteoff', e => {
          subscriber.next({
            type: 'noteOff',
            timestamp: e.timestamp,
            value: e.note
          });
        }),
        synth.addListener('noteon', e => {
          subscriber.next({
            type: 'noteOn',
            timestamp: e.timestamp,
            value: e.note
          });
        }),
        synth.addListener('controlchange', e => {
          switch (e.subtype) {
            case 'pancoarse':
              subscriber.next({ type: 'pan', value: e.value });
              break;
            case 'volumecoarse':
              subscriber.next({ type: 'volume', value: e.value });
              break;
          }
        })
      ];
    }).pipe(shareReplay(1));
    return observable;
  }

  unlisten() {
    this.activeInput = undefined;
    this.activeOutput = undefined;
    this.activeListeners?.flat().forEach(listener => listener.remove());
    this.activeListeners = [];
  }

  destroy() {
    this.subscriptions.unsubscribe();
  }
}

export interface MidiInputOptions {
  id: string;
  name: string;
  manufacturer: string;
  octaveOffset: number;
}

export class MidiInput implements MidiInputOptions {
  id: string;
  name: string;
  manufacturer: string;
  octaveOffset: number;

  constructor(options: MidiInputOptions) {
    this.id = options.id;
    this.name = options.name;
    this.manufacturer = options.manufacturer;
    this.octaveOffset = options.octaveOffset;
  }

  toJSON() {
    return {
      id: this.id,
      name: this.name,
      manufacturer: this.manufacturer,
      octaveOffset: this.octaveOffset
    };
  }
}

export class MidiOutput extends MidiInput {
  type;
  constructor({ type, ...options }: { type: string } & MidiInputOptions) {
    super(options);
    this.type = type;
  }

  /**
   * @deprecated
   */
  get port() {
    return this.type;
  }

  override toJSON() {
    return {
      ...super.toJSON(),
      type: this.type
    };
  }
}
