import { inject } from 'vue';

export default function useScrollContent() {
  const refresh = inject<CallableFunction>('scrollContent:refresh');

  return {
    refresh
  };
}
