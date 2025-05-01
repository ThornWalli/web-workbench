import { withNuxt } from './packages/app/.nuxt/eslint.config.mjs';
import eslintPluginPrettierRecommended from 'eslint-plugin-prettier/recommended';
import pluginSecurity from 'eslint-plugin-security';
import eslintIgnores from './eslint.ignores.js';
import tseslint from 'typescript-eslint';

export default withNuxt({
  files: ['**/*.js', '**/*.ts', '**/*.d.ts', '**/*.vue'],
  rules: {
    'prettier/prettier': 'error',
    classPrivateMethods: 'off',
    'block-spacing': 'error',
    'no-debugger': 'off',
    'no-console': 'off',
    'no-empty-function': 'error',
    'vue/no-v-html': 'off',
    'vue/no-mutating-props': 'warn',
    'security/detect-non-literal-fs-filename': 'off',
    complexity: [
      'error',
      {
        max: 12
      }
    ],
    'no-multiple-empty-lines': [
      'error',
      {
        max: 1,
        maxEOF: 1
      }
    ],
    'vue/component-name-in-template-casing': [
      'error',
      'kebab-case',
      {
        registeredComponentsOnly: true,
        ignores: []
      }
    ],
    'vue/multi-word-component-names': 'off',
    'vue/html-self-closing': 'off', // prettier workaround
    'security/detect-object-injection': 'off'
  }
}).prepend(
  eslintIgnores,
  tseslint.configs.recommended,
  pluginSecurity.configs.recommended,
  eslintPluginPrettierRecommended
);
