import { watch, reactive } from 'vue';
import * as sounds from '../utils/sounds.js';
import { bufferCount, concatAll, concatMap, from } from 'rxjs';
import { fromFetch } from 'rxjs/fetch';

const AUDIO_TYPE = {
  MUSIC: 'music',
  SFX: 'sfx'
};

let volumes;
let playedAudios = [];
export default function useAudioControl() {
  if (!volumes) {
    volumes = reactive({
      internal: 0.25,
      global: 1,
      music: 0.2,
      sfx: 0.5
    });
    console.log('volumes', volumes);
    watch(
      () => volumes,
      volumes => {
        playedAudios.forEach(({ audio, type }) => {
          audio.volume = volumes.global * volumes[String(type)];
        });
      },
      { deep: true }
    );
  }

  const prepareCache = urls => {
    return from(urls).pipe(
      bufferCount(6),
      concatAll(),
      concatMap(url => fromFetch(url))
    );
  };

  const play = (type, name) => {
    const audio = new Audio();
    if (!sounds[String(type)][String(name)]) {
      console.error(`Sound ${type} ${name} not found`);
      return;
    }
    audio.src = sounds[String(type)][String(name)];
    audio.volume = volumes.internal * volumes.global * volumes[String(type)];

    playedAudios.push({ audio, type });
    const destroy = () => {
      audio.pause();
      audio.remove();
      playedAudios = playedAudios.filter(value => audio !== value);
    };
    audio.addEventListener('ended', () => destroy());

    const promise = audio.play().catch(e => {
      console.error(e);
      return Promise.resolve();
    });

    return {
      promise,
      stop: () => destroy()
    };
  };

  const playMusic = name => {
    console.log('play music', name);
    return play(AUDIO_TYPE.MUSIC, name);
  };
  const playSfx = name => {
    return play(AUDIO_TYPE.SFX, name);
  };

  const mute = () => {
    volumes.internal = 0;
  };

  const unmute = () => {
    volumes.internal = 1;
  };

  const setGlobalVolume = value => {
    volumes.global = value;
  };

  return {
    mute,
    unmute,
    volumes,
    playMusic,
    playSfx,
    prepare: () =>
      prepareCache([
        ...Object.values(sounds.music),
        ...Object.values(sounds.sfx)
      ]),
    setGlobalVolume
  };
}
