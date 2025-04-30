import { defineConfig } from '@web-workbench/core/config';
import rootItems from '@/rootItems';

export default defineConfig(() => {
  return {
    rootItems,
    disks: {
      debug: () =>
        import('@web-workbench/disk-debug').then(module => module.default),
      extras13: () =>
        import('@web-workbench/disk-extras13').then(
          module => module?.default || module
        ),
      workbench13: () =>
        import('@web-workbench/disk-workbench13').then(
          module => module?.default || module
        ),
      synthesizer: () =>
        import('@web-workbench/disk-synthesizer').then(
          module => module?.default || module
        ),
      moonCity: () =>
        import('@web-workbench/disk-moon-city').then(
          module => module?.default || module
        )
    }
  };
});
