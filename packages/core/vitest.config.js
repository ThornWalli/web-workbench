import { defineConfig } from 'vite';

export default defineConfig({
  test: {
    include: [
      // 'test/firebaseWrapper.test.js',

      'test/basicInterpreter.test.js'
      // 'test/mathParser.test.js'
      // 'test/stringParameterParser.test.js'
    ],
    testTimeout: 60_000,
    hookTimeout: 140_000
  }
});
