import { Time as ToneTime } from 'tone';
const BEAT_DURATION = 2;
export default class Metronom {
  value = 0;

  constructor({ speed = 1, time = '4n', beatCount = 1 } = {}) {
    this.time = time;
    this.speed = speed;
    this.beatCount = beatCount;
  }

  prev() {
    this.value = Math.max(this.value - this.timeDuration, 0);
  }

  reset() {
    this.value = 0;
  }

  next() {
    this.value = this.value + this.timeDuration;
  }

  get currentBeat() {
    return Math.floor(this.value / BEAT_DURATION);
  }

  prevBeat(count = this.beatCount) {
    this.value = Math.max(this.value - count * BEAT_DURATION, 0);
  }

  setBeat(value, count = 1) {
    this.value = value * count * BEAT_DURATION;
  }

  nextBeat(count = this.beatCount) {
    console.log('nexeatt', count);
    this.value = this.value + count * BEAT_DURATION;
  }

  get timeDuration() {
    return new ToneTime(this.time).toSeconds() / this.speed;
  }

  get steps() {
    return 2 / this.timeDuration;
  }

  now() {
    return window.performance.now();
  }

  getDuration() {
    return this.value;
  }
}
