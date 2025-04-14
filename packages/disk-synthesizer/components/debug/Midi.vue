<template>
  <div>
    <editor :track="track" />
  </div>
</template>
<script>
import useTone from '../../composables/useTone';
import Metronom from '../../classes/Metronom';

import Track from '../../classes/Track';
import Editor from '../synthesizer/Editor';
import useWindow from '@web-workbench/core/composables/useWindow';

export default {
  components: { Editor },

  async setup() {
    const windowContext = useWindow();

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
