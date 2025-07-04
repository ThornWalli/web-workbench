import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    projects: [
      {
        extends: './packages/core/vitest.config.ts',
        test: {
          name: 'core'
        }
      },
      {
        extends: './packages/disk-synthesizer/vitest.config.ts',
        test: {
          name: 'disk-synthesizer'
        }
      }
    ]
  }
});
