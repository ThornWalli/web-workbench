import { reactive, ref, type Reactive } from 'vue';
import Core from '../classes/Core';

const core = ref<Reactive<Core>>();

export default function useCore() {
  return {
    core,
    setup: async () => {
      const c = new Core();
      await loadModules(c);
      core.value = reactive(c);
    }
  };
}

async function loadModules(core: Core) {
  core.addModule(
    await import('../classes/modules/Parser').then(module => module.default)
  );
  core.addModule(
    await import('../classes/modules/Files').then(module => module.default)
  );
  core.addModule(
    await import('../classes/modules/Windows').then(module => module.default)
  );
  core.addModule(
    await import('../classes/modules/Symbols').then(module => module.default)
  );
}
