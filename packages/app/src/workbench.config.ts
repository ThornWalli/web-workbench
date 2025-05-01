import type { PublicRuntimeConfig } from '@nuxt/schema';
import { defineConfig } from '@web-workbench/core/config';
import rootItems from '@/rootItems';
// import type { PublicRuntimeConfig } from '#types';

// test.NuxtConfigSchema['RuntimeConfig'];
export default defineConfig((publicRuntimeConfig: PublicRuntimeConfig) => {
  const { firebase } = publicRuntimeConfig;
  return {
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
      }
    ],
    startCommands: ['mountDisk "debug"'],
    cloudStorages: [
      {
        name: 'CDLAMMPEE',
        firebase: {
          apiKey: firebase.apiKey,
          url: firebase.url
        }
      }
    ]
    // parser: {
    //   memory: {
    //     FIREBASE_API_KEY: firebase.apiKey
    //   }
    // }
  };
});
