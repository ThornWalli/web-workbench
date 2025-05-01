import { reactive } from 'vue';
import Core from '../classes/Core.js';

/**
 * @type {import('vue').Reactive<Core>}
 */
let core;
export default function useCore() {
  if (!core) {
    core = reactive(new Core());
  }

  window.core = core;

  return {
    core
  };
}
