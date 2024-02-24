<template>
  <div>
    <editor :track="track"></editor>
  </div>
</template>
<script>
import useWindow, {
  windowProps,
  windowEmits
} from '@web-workbench/core/composables/useWindow';
import useTone from '../../composables/useTone';
import Metronom from '../../classes/Metronom';

import Track from '../../classes/Track';
import Editor from '../synthesizer/Editor.vue';

export default {
  components: { Editor },

  props: {
    ...windowProps
  },
  emits: [...windowEmits],

  async setup(props, context) {
    const windowContext = useWindow(props, context);

    return { ...windowContext, ...(await useTone()) };
  },

  data() {
    const metronom = new Metronom();
    return {
      track: new Track({
        beatCount: 1,
        speed: metronom.speed,
        notes: [{ name: 'C4', time: '2n', delay: 4 }]
      })
    };
  }
};
</script>
