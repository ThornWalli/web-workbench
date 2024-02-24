import { defineConfig } from 'vite';

export default defineConfig({
  test: {
    include: ['test/synthesizer.test.js'],
    testTimeout: 60_000,
    hookTimeout: 140_000
  }
});
