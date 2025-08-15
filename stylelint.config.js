import ignoreFiles from './stylelint.ignore.js';

export default {
  extends: [
    'stylelint-config-standard',
    'stylelint-config-recess-order',
    'stylelint-prettier/recommended'
  ],
  customSyntax: 'postcss-html',
  ignoreFiles,
  rules: {
    'no-invalid-position-declaration': null,
    'no-descending-specificity': null,
    'value-keyword-case': [
      'lower',
      {
        camelCaseSvgKeywords: true
      }
    ],
    'declaration-property-value-no-unknown': [
      true,
      {
        ignoreProperties: {
          '/.+/': '/(vw|em|fix)+/'
        }
      }
    ],
    'function-no-unknown': [
      true,
      {
        ignoreFunctions: ['em', 'vw', 'number', 'deep', 'global']
      }
    ],
    'selector-pseudo-class-no-unknown': [
      true,
      {
        ignorePseudoClasses: ['global', 'deep']
      }
    ]
  }
};
