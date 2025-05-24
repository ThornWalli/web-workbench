import useFonts from '@web-workbench/core/composables/useFonts';
import BitFont from '../assets/fonts/BitFont/BitFont.woff2';
import PixFont from '../assets/fonts/PixFont/PixFont.woff2';
import BitFontTtf from '../assets/fonts/BitFont/BitFont.ttf';
import { fromEvent, Subscription } from 'rxjs';
import { ipoint } from '@js-basics/vector';

import { onMounted, onUnmounted, ref } from 'vue';

const DIMENSION = ipoint(640, 400);

export default function useAppInit({
  absolute
}: {
  absolute?: HTMLElement | Window;
} = {}) {
  absolute = absolute || window;
  const position = ref(ipoint(0, 0));
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
      src: [BitFont, 'woff2']
    },
    {
      fontFamily: 'PixFont-web',
      fontVariant: 'normal',
      fontFeatureSettings: 'normal',
      fontWeight: 400,
      fontStyle: 'normal',
      fontDisplay: 'swap',
      src: [PixFont, 'woff2']
    }
  ]);

  const subscription = new Subscription();

  onMounted(() => {
    if (absolute) {
      subscription.add(fromEvent(window, 'resize').subscribe(onRefresh));
      onRefresh();
    }
  });

  onUnmounted(() => {
    subscription.unsubscribe();
  });

  const onRefresh = () => {
    let dimension;
    if (absolute === window) {
      dimension = ipoint(window.innerWidth, window.innerHeight);
    } else if (absolute instanceof HTMLElement) {
      dimension = ipoint(absolute.offsetWidth, absolute.offsetHeight);
    }
    if (!dimension) {
      throw new Error('Unable to get dimension');
    }
    position.value = ipoint(() => Math.round((dimension - DIMENSION) / 2));
  };

  return {
    position
  };
}
