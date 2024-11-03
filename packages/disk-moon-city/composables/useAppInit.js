import useFonts from '@web-workbench/core/composables/useFonts';
import BitFont from '../assets/fonts/BitFont/BitFont.woff';
import BitFontTtf from '../assets/fonts/BitFont/BitFont.ttf';
import { fromEvent, Subscription } from 'rxjs';
import { ipoint } from '@js-basics/vector';

import { onMounted, onUnmounted, ref } from 'vue';

const DIMENSION = ipoint(640, 400);

export default function useAppInit() {
  const position = ref(ipoint());
  const { registerFont } = useFonts();

  const fontFile = new FontFace('BitFontCanvas', `url(${BitFontTtf})`, {});
  document.fonts.add(fontFile);

  registerFont([
    {
      fontFamily: 'BitFont-web',
      fontVariant: 'normal',
      fontFeatureSettings: 'normal',
      fontWeight: 400,
      fontStyle: 'normal',
      fontDisplay: 'swap',
      src: [BitFont, 'woff']
    }
  ]);

  const subscription = new Subscription();

  onMounted(() => {
    subscription.add(fromEvent(window, 'resize').subscribe(onRefresh));
    onRefresh();
  });

  onUnmounted(() => {
    subscription.unsubscribe();
  });

  const onRefresh = () => {
    const dimension = ipoint(window.innerWidth, window.innerHeight);
    position.value = ipoint(() => Math.round((dimension - DIMENSION) / 2));
  };

  return {
    position
  };
}
