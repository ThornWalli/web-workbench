<template>
  <div class="page">
    <client-only>
      <component :is="coreComponent" v-if="ready && !error" :core="core" @ready="onReady" />
      <wb-env-error v-if="error" v-bind="error" />
    </client-only>
    <wb-env-error class="no-script" v-bind="noJavascriptError" />
  </div>
</template>

<script setup>

import { useHead, onMounted, ref, markRaw, defineAsyncComponent } from '#imports';
import WbEnvError from '@/components/environments/Error';

useHead({
  noscript: [
    {
      innerHTML: '<style>.no-script {display: block !important;}</style>'
    }
  ]
});

const props = defineProps({
  startCommand: {
    type: String,
    default: null
  }
});

const noJavascriptError = ref({
  input: 'No interaction available.',
  text: 'Javascript is disabled.',
  stack: null,
  code: '#00000000.00000000'
});
const error = ref(null);
if (process.client) {
  if (/(Speed Insights)|(Chrome-Lighthouse)/.test(window.navigator.userAgent)) {
    error.value = {
      input: 'No interaction available.',
      text: 'Not made for Lighthouse ;)',
      stack: null,
      code: `#${Math.floor(Math.random() * 99999999)}.${Math.floor(Math.random() * 99999999)}`
    };
  } else if (!(!window.navigator.userAgent.includes('Firefox/') || 'fromEntries' in Object)) {
    error.value = {
      input: 'No interaction available.',
      text: 'Use a latest version of a Webkit browser (e.g. Chrome).',
      stack: null,
      code: `#${Math.floor(Math.random() * 99999999)}.${Math.floor(Math.random() * 99999999)}`
    };
  }
}

const ready = ref(false);
const core = ref(null);
const coreComponent = ref(null);

onMounted(async () => {
  if (!error.value) {
    coreComponent.value = markRaw(defineAsyncComponent(() => import('@/components/environments/Core')));
    core.value = markRaw(await import('@/web-workbench').then(module => module.default));
    ready.value = true;
  }
});

const onReady = () => {
  core.value.executeCommand(props.startCommand);
};

</script>

<style lang="postcss" scoped>
:deep(> * ),
.page {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: black;
}

.no-script {display: none;}

</style>

