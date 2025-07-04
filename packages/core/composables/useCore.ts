import { reactive, ref } from 'vue';
import type { Reactive } from 'vue';
import type Core from '../classes/Core';

const core = ref<Reactive<Core>>();

export default function useCore() {
  return {
    core,
    setup: async () => {
      const c = await import('../').then(module => module.default);
      core.value = reactive(c);
    }
  };
}
