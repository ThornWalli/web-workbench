import Core from '../classes/Core.js';
import debug from './useCore/debug.js';

/**
 * @type {import('vue').Reactive<Core>}
 */
let core;
export default function useCore() {
  if (!core) {
    core = reactive(new Core());
    debug(core);
  }
  return {
    core
  };
}
