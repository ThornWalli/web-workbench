import { useRuntimeConfig } from '#imports';
import { defineEventHandler } from 'h3';
export default defineEventHandler(event => {
  const config = useRuntimeConfig();
  if (!config.public.coiWorker) {
    event.node.res.setHeader('Cross-Origin-Opener-Policy', 'same-origin');
    event.node.res.setHeader('Cross-Origin-Embedder-Policy', 'require-corp');
  }
});
