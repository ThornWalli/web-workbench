// vetur.config.js
/** @type {import('vls').VeturConfig} */
module.exports = {
  // **optional** default: `{}`
  // override vscode settings
  // Notice: It only affects the settings used by Vetur.
  settings: {
    'vetur.useWorkspaceDependencies': true,
    'vetur.experimental.templateInterpolationService': false
  },
  // **optional** default: `[{ root: './' }]`
  // support monorepos
  projects: [
    './packages/app',
    './packages/core',
    './packages/disk-debug',
    './packages/disk-extras13',
    './packages/disk-workbench13',
    './packages/disk-synthesizer',
    './packages/disk-moon-city'
  ]
};
