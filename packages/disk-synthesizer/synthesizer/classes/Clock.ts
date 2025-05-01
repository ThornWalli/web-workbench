import { Clock as ToneClock, getDraw } from 'tone';
import { ReplaySubject } from 'rxjs';

export default class Clock {
  steps: number;
  speed: number;
  value = 0;
  subject = new ReplaySubject(0);
  destroyed = false;

  callback: CallableFunction;
  context: ToneClock;

  time = '1n';

  constructor(steps: number, speed: number, callback: CallableFunction) {
    this.steps = steps || 1;
    this.speed = speed || 1;
    this.callback = callback;
    this.context = new ToneClock(
      this.onTick.bind(this),
      this.steps / this.speed
    );
  }

  reset() {
    this.value = 0;
  }

  destroy() {
    try {
      this.destroyed = true;
      this.context?.dispose();
    } catch (error) {
      console.error(error);
    }
  }

  onTick() {
    getDraw().schedule(() => {
      if (this.context.state === 'stopped') {
        return;
      }
      this.callback(this.value);
      this.value = (this.value + 1 / this.steps) % 1;
    }, this.time);
  }

  start() {
    this.context.start();
  }

  stop() {
    this.context.stop();
  }
}
