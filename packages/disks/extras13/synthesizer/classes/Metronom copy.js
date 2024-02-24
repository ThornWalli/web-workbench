import { now, Time } from 'tone';
import Clock from './Clock';

const STATES = Object.freeze({
  PLAYING: 'playing',
  PAUSED: 'paused',
  STOPPED: 'stopped',
  DESTROYED: 'destroyed'
});

export default class Metronom {
  progress = 0;
  value = 0;
  startOffset = 0;
  pauseOffset = 0;

  progressClock;
  valueClock;
  state = STATES.STOPPED;

  constructor({ speed = 1, time = '4n' } = {}) {
    this.time = time;
    this.speed = speed;
  }

  now() {
    return now();
  }

  play() {
    if (this.state === STATES.STOPPED) {
      this.startOffset = this.now();
    }
    if (this.state === STATES.PAUSED) {
      this.startOffset += this.now() - this.pauseOffset;
      this.pauseOffset = 0;
    }
    if (this.state !== STATES.PLAYING) {
      this.valueClock?.start();
      this.progressClock?.start();
      this.state = STATES.PLAYING;
    }
  }

  pause() {
    this.valueClock?.stop();
    this.progressClock?.stop();
    this.state = STATES.PAUSED;
    this.pauseOffset = this.now();
  }

  stop() {
    this.valueClock?.stop();
    this.progressClock?.stop();
    this.value = 0;
    this.progress = 0;
    this.pauseOffset = 0;
    this.state = STATES.STOPPED;
  }

  remove() {
    this.stop();
  }

  destroy() {
    this.valueClock?.destroy();
    this.progressClock?.destroy();
    this.state = STATES.DESTROYED;
  }

  reset() {
    this.progressClock?.reset();
    this.valueClock?.reset();
    this.pauseOffset = 0;
    this.startOffset = this.now();
  }

  getDuration() {
    return this.now() - this.startOffset;
  }

  create() {
    this.remove();
    this.value = 0;
    this.progress = 0;

    this.progressClock = new Clock(400, this.speed, value => {
      this.progress = value;
    });
    console.log('this.time', this.time);
    this.valueClock = new Clock(
      2 / new Time(this.time).toSeconds(),
      this.speed,
      value => {
        this.value = value;
      }
    );
  }
}
