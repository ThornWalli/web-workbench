import { markRaw } from 'vue';
import * as Tone from 'tone';
import Deferred from '..//Deferred';
import Track from './Track';
import NoteDescription from './NoteDescription';

export default class TrackPlayer {
  track;
  playing = false;
  currentSequence;
  autoplay;
  instrument;
  instruments = [];
  sequenceNoteIndex = {};
  instrumentIndex = -1;

  constructor(track, options) {
    const { autoplay } = options || {};

    if (!(track instanceof Track)) {
      throw new Error('TrackPlayer requires a Track');
    }

    this.track = track;
    this.autoplay = autoplay !== undefined ? autoplay : true;
  }

  createInstrument() {
    this.instrument?.dispose();
    this.instrument = createInstrument(this.track.type);
  }

  refresh() {
    const preparedNotes = this.track.notes;
    this.createSequence(preparedNotes, () => {
      console.log('complete');
      this.clearSequence();
      this.playing = false;
    });
    return preparedNotes;
  }

  play() {
    if (!this.track.type) {
      throw new Error('TrackPlayer requires an instrument');
    }

    this.refresh();

    if (this.autoplay) {
      this.currentSequence.start(0);
      this.playing = true;
    }
    return this.currentSequence;
  }

  pause() {
    this.instruments.forEach(instrument =>
      instrument.context.transport.pause()
    );
    this.playing = false;
  }

  stop() {
    this.clearSequence();
    this.playing = false;
  }

  restart() {
    this.stop();
    this.play();
  }

  reset() {
    this.clearSequence();
    this.stop();
    this.track.notes = [];
  }

  destroy() {
    this.instrument?.dispose();
    this.instruments.forEach(instrument => instrument.dispose());
    this.clearSequence();
  }

  triggerAttack(noteName) {
    this.instrumentIndex++;
    this.getInstrument().triggerAttack(noteName);
  }

  triggerRelease() {
    this.getInstrument().triggerRelease();
    this.instrumentIndex--;
  }

  triggerAttackRelease(note) {
    this.instrumentIndex++;
    console.log(
      'triggerAttackRelease',
      this.instrumentIndex,
      note.getName(),
      note.getTime(),
      note.delay,
      (note.delay + note.toSeconds()) * 1000
    );
    window.setTimeout(
      () => {
        console.log('fertig');
        this.instrumentIndex--;
      },
      (note.delay + note.toSeconds()) * 1000
    );
    this.getInstrument().triggerAttackRelease(
      note.getName(),
      note.getTime(),
      note.delay
    );
  }

  getInstrument() {
    if (this.instrumentIndex > this.instruments.length - 1) {
      this.instruments.push(createInstrument(this.track.type));
    }
    return this.instruments[this.instrumentIndex];
  }

  createSequence(notes, complete) {
    if (!this.currentSequence) {
      this.currentSequence?.dispose();

      // const instrumentCount = Object.values(getGroupedNotes(notes)).reduce(
      //   (result, v) => {
      //     return Math.max(result, v.length);
      //   },
      //   0
      // );
      // this.instruments = Array(instrumentCount)
      //   .fill({})
      //   .map(() => createInstrument(this.track.type));
      this.currentSequence = markRaw(
        new Sequence(
          notes,
          (note, instrumentIndex, noteIndex, notes) => {
            console.log(note);
            this.triggerAttackRelease(note);

            this.sequenceNoteIndex = {
              ...this.sequenceNoteIndex,
              [Number(instrumentIndex)]: notes[Number(noteIndex)].index
            };

            if (noteIndex === notes.length - 1) {
              delete this.sequenceNoteIndex[Number(instrumentIndex)];
            }
          },
          complete !== undefined ? complete : undefined
        )
      );
    }
  }

  clearSequence() {
    this.currentSequence?.dispose();
    this.currentSequence = null;
  }
}
class Sequence {
  startTime = 0;
  sequenceMap = new Map();

  constructor(notes, onTick, onComplete) {
    this.onTick = onTick;
    this.onComplete = onComplete;
    this.notes = notes;
  }

  async start(start = 0) {
    const transport = Tone.Transport;
    transport.stop();
    transport.seconds = 0;
    transport.start();

    this.startTime = Tone.now();

    const sequenceMap = this.sequenceMap;
    const isComplete = Promise.all(
      Object.entries(getGroupedNotes(this.notes)).map(([, notes]) => {
        const parts = notes.map((note, i) => {
          // const instrument = this.instruments[Number(i)];
          const sequenceName = `${i}_${note.getTime()}`;
          let { notes, part, complete } =
            sequenceMap.get(sequenceName) ||
            (() => {
              const notes = [];
              let index = 0;
              const deferred = new Deferred();
              const part = new Tone.Part(
                (...args) => {
                  this.onTick(
                    new NoteDescription({
                      delay: args[0],
                      note: args[1],
                      time: note.getTime()
                    }),
                    i,
                    index,
                    notes
                  );
                  index++;
                  if (index > part.length - 1) {
                    deferred.resolve();
                  }
                },
                [],
                note.getTime()
              );

              return { notes, part, complete: deferred.promise };
            })();

          sequenceMap.set(sequenceName, { notes, part, complete });

          part.add(note.delay, note.getName());
          notes.push(note);

          return { notes, part, complete };
        });

        return Promise.all(parts.map(({ complete }) => complete));
      })
    );

    Array.from(sequenceMap.values()).forEach(({ part }) => {
      part.start(start);
    });

    await isComplete;
    this.onComplete();

    return isComplete;
  }

  pause() {
    Array.from(this.sequenceMap.values()).forEach(({ part }) => {
      part.pause();
    });
  }

  cancel() {
    Array.from(this.sequenceMap.values()).forEach(({ part }) => {
      part.cancel();
    });
  }

  stop() {
    Array.from(this.sequenceMap.values()).forEach(({ part }) => {
      part.stop();
    });
  }

  dispose() {
    Array.from(this.sequenceMap.values()).forEach(({ part }) => {
      part.dispose();
    });
  }
}
function createInstrument(instrumentName) {
  const Instrument = Tone[String(instrumentName)];
  const vol = new Tone.Volume(-100).toDestination();
  const destination = new Instrument()
    .connect(vol)
    // .connect(this.tone.destination, 0, 0)
    .toDestination();

  return markRaw(destination);
}

function getGroupedNotes(notes) {
  return notes.reduce((result, v) => {
    result[v.delay] = result[v.delay] || [];
    result[v.delay].push(v);
    return result;
  }, {});
}
