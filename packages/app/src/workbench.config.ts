import type { PublicRuntimeConfig } from '@nuxt/schema';
import { defineConfig } from '@web-workbench/core/config';
import rootItems from '@/rootItems';

import SvgSymbolCuby from '@/assets/symbols/cuby.svg?component';
import SvgSymbolGithub from '@/assets/symbols/github.svg?component';
import SvgSymbolVueSemanticStructure from '@/assets/symbols/vue_semantic_structure.svg?component';
import SvgSymbolNuxtBooster from '@/assets/symbols/nuxt_booster.svg?component';
import SvgSymbolNuxt from '@/assets/symbols/nuxt.svg?component';
import SvgSimoneComputer from '@/assets/symbols/simone_computer.svg?component';

export enum SYMBOL {
  VUE_SEMANTIC_STRUCTURE = 'vue_semantic_structure',
  NUXT_BOOSTER = 'nuxt_booster',
  CUBY = 'cuby',
  GITHUB = 'github',
  NUXT = 'nuxt',
  SIMONE_COMPUTER = 'simone_computer'
}

// test.NuxtConfigSchema['RuntimeConfig'];
export default defineConfig((publicRuntimeConfig: PublicRuntimeConfig) => {
  const { firebase } = publicRuntimeConfig;
  return {
    firebase: firebase,
    symbols: [
      {
        key: SYMBOL.CUBY,
        component: SvgSymbolCuby,
        group: 'custom'
      },
      {
        key: SYMBOL.GITHUB,
        component: SvgSymbolGithub,
        group: 'custom'
      },
      {
        key: SYMBOL.VUE_SEMANTIC_STRUCTURE,
        component: SvgSymbolVueSemanticStructure,
        group: 'custom'
      },
      {
        key: SYMBOL.NUXT_BOOSTER,
        component: SvgSymbolNuxtBooster,
        group: 'custom'
      },
      {
        key: SYMBOL.NUXT,
        component: SvgSymbolNuxt,
        group: 'custom'
      },
      {
        key: SYMBOL.SIMONE_COMPUTER,
        component: SvgSimoneComputer,
        group: 'custom'
      }
    ],
    rootItems,
    disks: [
      {
        name: 'workbench13',
        order: 0,
        data: () =>
          import('@web-workbench/disk-workbench13').then(
            module => module?.default || module
          )
      },
      {
        name: 'extras13',
        order: 1,
        data: () =>
          import('@web-workbench/disk-extras13').then(
            module => module?.default || module
          )
      },
      {
        name: 'synthesizer',
        order: 2,
        data: () =>
          import('@web-workbench/disk-synthesizer').then(
            module => module?.default || module
          )
      },
      {
        name: 'moonCity',
        order: 3,
        data: () =>
          import('@web-workbench/disk-moon-city').then(
            module => module?.default || module
          )
      },
      {
        hidden: true,
        name: 'debug',
        order: 4,
        data: () =>
          import('@web-workbench/disk-debug').then(
            module => module?.default || module
          )
      },
      {
        hidden: true,
        name: 'third-dimension',
        order: 5,
        data: () =>
          import('@web-workbench/disk-third-dimension').then(
            module => module?.default || module
          )
      },
      {
        hidden: true,
        name: 'Web Paint',
        order: 5,
        data: () =>
          import('@web-workbench/disk-web-paint').then(
            module => module?.default || module
          )
      }
    ],
    startCommands: [],
    cloudStorages: [
      {
        name: 'CDLAMMPEE',
        firebase: {
          apiKey: firebase.apiKey,
          url: firebase.databaseURL
        }
      },
      {
        name: 'CDGUESTBOOK',
        firebase: {
          apiKey: firebase.apiKey,
          url: firebase.databaseURL
        }
      }
    ]
  };
});
