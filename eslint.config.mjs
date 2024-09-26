import { withNuxt } from './packages/app/.nuxt/eslint.config.mjs';
import eslintPluginPrettierRecommended from 'eslint-plugin-prettier/recommended';
import pluginSecurity from 'eslint-plugin-security';
import eslintIgnores from './eslint.ignores.mjs';

export default withNuxt(
  pluginSecurity.configs.recommended,
  eslintPluginPrettierRecommended,
  {
    files: ['**/*.js', '**/*.vue'],
    ignores: eslintIgnores,
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
          max: 10
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
      'vue/multi-word-component-names': 'off'
    }
  }
);
