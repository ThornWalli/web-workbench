import { defineNuxtPlugin, useHead, useRuntimeConfig } from '#app';

export default defineNuxtPlugin(() => {
  const config = useRuntimeConfig();

  function needCrossOriginFallback() {
    if (typeof SharedArrayBuffer !== 'undefined') {
      return false;
    }
    return true;
  }

  if (config.public.coiWorker && needCrossOriginFallback()) {
    useHead({
      script: [
        {
          src: '/coi-serviceworker.min.js'
        },
        {
          innerHTML: `
      window.coi = {
        shouldRegister: !reloadedBySelf,
        shouldDeregister: () => false,
        coepCredentialless: () => true,
        coepDegrade: () => true,
        doReload: () => window.location.reload(),
        quiet: false
    }`
        }
      ]
    });
  }
});
