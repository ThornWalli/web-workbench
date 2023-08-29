import { markRaw } from 'vue';
import * as Tone from 'tone';
import { getPreparedNotes } from '../utils';

export default class TrackPlayer {
  track;
  playing = false;
  noteIndex = -1;
  currentSequence;
  instrument;
  autoplay;

  constructor(track, options) {
    const { autoplay } = options || {};
    this.track = track;
    this.autoplay = autoplay !== undefined ? autoplay : true;
  }

  refresh() {
    const preparedNotes = getPreparedNotes(this.track.notes);
    this.createSequence(preparedNotes, () => {
      this.clearSequence();
      this.playing = false;
    });
    return preparedNotes;
  }

  play(noteIndex) {
    if (!this.instrument) {
      throw new Error('TrackPlayer requires an instrument');
    }
    const preparedNotes = this.refresh(noteIndex);
    if (preparedNotes.length - 1 === this.noteIndex) {
      this.noteIndex = -1;
    }

    if (this.autoplay) {
      const transport = this.instrument.context.transport;
      transport.stop();
      transport.seconds =
        (noteIndex > -1 && preparedNotes[noteIndex + 1]?.time) || 0;
      transport.start();
      this.currentSequence.start(0);
      this.playing = true;
    }
    return this.currentSequence;
  }

  pause() {
    this.instrument.context.transport.pause();
    this.playing = false;
  }

  stop() {
    this.clearSequence();
    this.playing = false;
    this.noteIndex = -1;
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
    this.clearSequence();
  }

  getCurrentNote() {
    return this.track.getNote(this.noteIndex);
  }

  createInstrument(instrument) {
    this.instrument?.dispose();

    // eslint-disable-next-line import/namespace
    const Instrument = Tone[String(instrument)];
    const vol = new Tone.Volume(-100).toDestination();
    const destination = new Instrument()
      .connect(vol)
      // .connect(this.tone.destination, 0, 0)
      .toDestination();

    this.instrument = markRaw(destination);
  }

  createSequence(notes, complete) {
    if (!this.currentSequence) {
      this.currentSequence?.dispose();
      let prevTime;

      const velocity = this.track.baseNote / this.track.noteCount.number;
      console.log('velocity', velocity);
      this.currentSequence = markRaw(
        new Tone.Part((time, { name, time: duration, velocity }) => {
          if (name) {
            try {
              this.instrument.triggerAttackRelease(
                name,
                this.track.noteCount.toString(),
                time,
                velocity
              );

              prevTime = { name, time };
            } catch (error) {
              console.log(prevTime);
            }
          }
          Tone.Draw.schedule(() => {
            this.noteIndex++;
          }, time);
          if (this.noteIndex === notes.length - 1 && complete) {
            complete();
          }
        }, notes)
      );
    }
  }

  clearSequence() {
    this.currentSequence?.dispose();
    this.currentSequence = null;
  }
}
