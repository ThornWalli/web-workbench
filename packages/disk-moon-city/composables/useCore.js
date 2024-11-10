import Core from '../classes/Core.js';
import debug from './useCore/debug.js';

/**
 * @type {import('vue').Reactive<Core>}
 */
let core;
export default function useCore(options = { debug: false }) {
  if (!core) {
    core = reactive(new Core());
    if (options.debug) {
      debug(core);
    }
  }
  return {
    core
  };
}
