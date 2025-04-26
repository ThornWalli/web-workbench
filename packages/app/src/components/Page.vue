<template>
  <div class="page">
    <client-only>
      <component
        :is="coreComponent"
        v-if="ready && !error"
        :force-no-disk="noDisk"
        :core="coreInstance"
        :disks="disks"
        @ready="onReady" />
      <wb-env-error v-if="error" v-bind="error" />
    </client-only>
    <wb-env-error class="no-script" v-bind="noJavascriptError" />
  </div>
</template>

<script lang="ts" setup>
import WbEnvError from '@web-workbench/core/components/Error.vue';

import {
  useHead,
  onMounted,
  ref,
  markRaw,
  defineAsyncComponent
} from '#imports';
import useCore from '@web-workbench/core/composables/useCore';

interface ErrorDescription {
  input: string;
  text: string;
  stack: string | null;
  code: string;
}

const error = ref<ErrorDescription>();
const ready = ref(false);
const coreComponent = ref<null | ReturnType<typeof defineAsyncComponent>>(null);

useHead({
  noscript: [
    {
      key: 'pageNoScript',
      innerHTML: '<style>.no-script {display: block !important;}</style>'
    }
  ]
});

const $props = defineProps({
  noDisk: {
    type: Boolean,
    default: false
  },
  disks: {
    type: Object,
    default: () => ({
      debug: () =>
        import('@web-workbench/disk-debug').then(
          module => module?.default || module
        ),
      extras13: () =>
        import('@web-workbench/disk-extras13').then(
          module => module?.default || module
        ),
      workbench13: () =>
        import('@web-workbench/disk-workbench13').then(
          module => module?.default || module
        ),
      synthesizer: () =>
        import('@web-workbench/disk-synthesizer').then(
          module => module?.default || module
        ),
      moonCity: () =>
        import('@web-workbench/disk-moon-city').then(
          module => module?.default || module
        )
    })
  },
  startCommand: {
    type: Array<string>,
    default() {
      return [];
    }
  }
});

const noJavascriptError = ref({
  input: 'No interaction available.',
  text: 'Javascript is disabled.',
  stack: null,
  code: '#00000000.00000000'
});

if (import.meta.client) {
  if (/(Speed Insights)|(Chrome-Lighthouse)/.test(window.navigator.userAgent)) {
    error.value = {
      input: 'No interaction available.',
      text: 'Not made for Lighthouse ;)',
      stack: null,
      code: `#${Math.floor(Math.random() * 99999999)}.${Math.floor(
        Math.random() * 99999999
      )}`
    };
  } else if (
    !(
      !window.navigator.userAgent.includes('Firefox/') ||
      'fromEntries' in Object
    )
  ) {
    error.value = {
      input: 'No interaction available.',
      text: 'Use a latest version of a Webkit browser (e.g. Chrome).',
      stack: null,
      code: `#${Math.floor(Math.random() * 99999999)}.${Math.floor(
        Math.random() * 99999999
      )}`
    };
  }
}

const coreInstance = ref();
onMounted(async () => {
  if (!error.value) {
    const { core, setup } = useCore();
    await setup();

    coreInstance.value = core.value;
    coreComponent.value = markRaw(
      defineAsyncComponent(
        () => import('@web-workbench/core/components/Core.vue')
      )
    );
    ready.value = true;
  }
});

const onReady = () => {
  return Promise.all(
    [...$props.startCommand].map(command =>
      coreInstance.value.executeCommand(command)
    )
  );
};
</script>

<style lang="postcss" scoped>
.page {
  background: black;

  &,
  & :deep(> *) {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
  }
}

.no-script {
  display: none;
}
</style>
