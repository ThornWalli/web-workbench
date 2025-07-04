import { reactive, type Reactive } from 'vue';
import Core from '../classes/Core';

/**
 * @type {import('vue').Reactive<Core>}
 */
let core: Reactive<Core>;
export default function useCore() {
  return {
    setupCore: () => {
      core = reactive(new Core());
      return core;
    },
    core
  };
}
