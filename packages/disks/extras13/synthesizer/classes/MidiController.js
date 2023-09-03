import { shareReplay, Subscription, Observable } from 'rxjs';
import { WebMidi } from 'webmidi';

export default class MidiController {
  activeInput = null;
  inputChannel = 1;
  activeOutput = null;
  activeListeners;
  inputs = [];
  outputs = [];
  ready = false;
  midiChannel = 1;

  constructor() {
    this.subscriptions = new Subscription();
    this.inputs = [];
    this.ready = false;
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
          input => new MidiOutput(input)
        );
        this.ready = true;
        return true;
      }
    } catch (e) {
      console.error(e);
      return false;
    }
  }

  listen(input, output = this.outputs[0]) {
    this.unlisten();

    const { channels } = WebMidi.getInputById(input.id);
    const synth = channels[Number(this.inputChannel)];

    this.activeInput = input.id;
    this.activeOutput = output.id;

    const observable = new Observable(subscriber => {
      this.activeListeners = [
        synth.addListener('midimessage', e => {
          console.log('???', e);
        }),
        synth.addListener('noteon', e => {
          subscriber.next({ type: 'note', value: e.note });
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
    this.activeInput = null;
    this.activeOutput = null;
    this.activeListeners?.forEach(listener => listener.remove());
    this.activeListeners = null;
  }

  destroy() {
    this.subscriptions.unsubscribe();
  }
}

export class MidiInput {
  constructor(context) {
    this.id = context.id;
    this.context = context;
    this.name = this.context.name;
    this.manufacturer = this.context.manufacturer;
    this.octaveOffset = this.context.octaveOffset;
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
  port;
  constructor(context) {
    super(context);
    this.port = context.type;
  }

  toJSON() {
    return {
      ...super.toJSON(),
      port: this.port
    };
  }
}
