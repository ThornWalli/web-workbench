import { watch, reactive } from 'vue';
import type { Reactive } from 'vue';
import * as sounds from '../utils/sounds';
import { bufferCount, concatAll, concatMap, from } from 'rxjs';
import { fromFetch } from 'rxjs/fetch';

let volumes: Reactive<{
  internal: number;
  global: number;
  music: number;
  sfx: number;
}>;
let playedAudios: {
  audio: HTMLAudioElement;
  type: sounds.SOUND_TYPE;
}[] = [];
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
          audio.volume = volumes.global * volumes[type];
        });
      },
      { deep: true }
    );
  }

  const prepareCache = (urls: string[]) => {
    return from(urls).pipe(
      bufferCount(6),
      concatAll(),
      concatMap(url => fromFetch(url))
    );
  };

  const play = (type: sounds.SOUND_TYPE, name: sounds.MUSIC | sounds.SFX) => {
    const audio = new Audio();
    const songs = sounds[type];
    if (songs && !(name in songs)) {
      console.error(`Sound ${type} ${name} not found`);
      return {
        promise: Promise.resolve(),
        stop: () => {
          return;
        }
      };
    }
    audio.src = (songs as Record<string, string>)[name];
    audio.volume = volumes.internal * volumes.global * volumes[type];
    playedAudios.push({ audio, type });
    const destroy = () => {
      audio.pause();
      audio.remove();
      playedAudios = playedAudios.filter(({ audio: value }) => audio !== value);
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

  const playMusic = (name: sounds.MUSIC | sounds.SFX) => {
    console.log('play music', name);
    return play(sounds.SOUND_TYPE.MUSIC, name);
  };
  const playSfx = (name: sounds.MUSIC | sounds.SFX) => {
    return play(sounds.SOUND_TYPE.SFX, name);
  };

  const mute = () => {
    volumes.internal = 0;
  };

  const unmute = () => {
    volumes.internal = 1;
  };

  const setGlobalVolume = (value: number) => {
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
