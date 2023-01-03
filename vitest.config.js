import { defineConfig } from 'vite';

export default defineConfig({
  test: {
    include: [
      'test/*.test.js'
    ],
    exclude: [
      'test/firebaseWrapper.test.js'
    ],
    testTimeout: 60_000,
    hookTimeout: 140_000
  }
});
