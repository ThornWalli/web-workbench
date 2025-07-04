<template>
  <div>
    <!-- <navigation v-bind="navigation"></navigation> -->
    <metronom
      :model="metronomModel"
      @render="onRender"
      @ready="onReady"
      @value="track.setCurrentDuration($event)">
      <template #background="{ onRefresh }">
        <timeline-canvas
          :key="metronomModel.value"
          :track="track"
          :duration="metronomModel.getDuration()"
          clickable
          @refresh="onRefresh"
          @note:click="onClickNote" />
      </template>
      <template #navigation="{ navigation: metronomNavigation }">
        <navigation v-bind="metronomNavigation" />
        <navigation v-bind="navigationData" />
        <!-- <navigation v-bind="{ metronomNavigation, }"></navigation> -->
      </template>
    </metronom>
  </div>
</template>

<script lang="ts" setup>
import { Subscription, filter } from 'rxjs';
import domEvents from '@web-workbench/core/services/domEvents';
import type Track from '../../classes/Track';
import MetronomClass from '../../classes/Metronom';
import MidiController from '../../classes/MidiController';
import type { MidiControllerEvent } from '../../classes/MidiController';
import useTone from '../../composables/useTone';
import NoteDescription from '../../classes/NoteDescription';
import { getNoteTimes } from '../../utils/note';
import TimelineCanvas from './TimelineCanvas.vue';
import Navigation from './Navigation.vue';
import Metronom from './Metronom.vue';
import type { EventValueReady } from './Metronom.vue';
import { computed, onMounted, onUnmounted, ref } from 'vue';
import type { IPoint } from '@js-basics/vector';

const { tone } = useTone();
const $props = defineProps<{
  track: Track;
}>();

const model = ref({
  input: 'note',
  inputType: ''
});
const metronomModel = ref(new MetronomClass());
const subscriptions = ref(new Subscription());
const midiController = ref(new MidiController());
const openNotes = ref(new Map());

const _render = ref();

const navigationData = computed(() => {
  return {
    model: model.value,
    items: [
      [],
      [
        { text: 'Input:' },
        { label: 'Note', value: 'note', name: 'input' },
        { label: 'Pause', value: 'pause', name: 'input', disabled: true }
      ],
      [
        { text: 'Note:&nbsp;' },
        { label: 'Auto', value: '', name: 'inputType' },
        ...getNoteTimes().map(([title]) => ({
          label: `1/${title.replace(/(\d+)[nm]/, '$1')} n`,
          name: 'inputType',
          value: title
        }))
      ]
    ]
  };
});

onMounted(() => {
  midiController.value.start();
  const observable = midiController.value.listen();
  subscriptions.value.add(
    domEvents.keyDown.subscribe(e => {
      switch (e.code) {
        case 'ArrowLeft':
          metronomModel.value.prev();
          break;
        case 'ArrowRight':
          metronomModel.value.next();
          break;
        case 'ArrowUp':
          metronomModel.value.prevBeat();
          break;
        case 'ArrowDown':
          metronomModel.value.nextBeat();
          break;
        default:
          if (/Digit(\d+)/.test(e.code)) {
            const number = Number(e.code.replace(/Digit(\d+)/, '$1'));

            const time = getNoteTimes()[number - 1];
            if (time) {
              metronomModel.value.time = time[0];
            }
          }
          break;
      }
    })
  );

  subscriptions.value.add(
    observable.pipe(filter(({ type }) => type === 'noteOn')).subscribe(onNoteOn)
  );
  subscriptions.value.add(
    observable
      .pipe(filter(({ type }) => type === 'noteOff'))
      .subscribe(onNoteOff)
  );
});
onUnmounted(() => {
  subscriptions.value.unsubscribe();
  midiController.value.destroy();
});

function onReady({ render }: EventValueReady) {
  _render.value = render;
}

function onRender(
  ctx: CanvasRenderingContext2D,
  {
    position,
    dimension
  }: {
    position: IPoint & number;
    dimension: IPoint & number;
  }
) {
  const openNotesList = Array.from(openNotes.value.values());
  for (let i = 0; i < openNotesList.length; i++) {
    const openNote = openNotesList[Number(i)];
    const duration =
      (metronomModel.value.now() - openNote) /
      1000 /
      (metronomModel.value.speed * 2);
    const w = duration * dimension.x;
    ctx.fillRect(position.x, position.y, w, dimension.y);
  }
}

let animationLoop: ReturnType<typeof startAnimationLoop> | undefined;
function onNoteOn({ value }: MidiControllerEvent) {
  if (value && typeof value === 'object') {
    if (!animationLoop) {
      animationLoop = startAnimationLoop(() => {
        if (_render.value) {
          _render.value();
        }
      });
    }
    openNotes.value.set(value.identifier, metronomModel.value.now());
  }
}

function onNoteOff({ value }: MidiControllerEvent) {
  if (value && typeof value === 'object') {
    const Tone = tone.getTone();

    const timeList = [1, 2, 4, 8, 16, 32]
      .map(v => {
        return [`${v}n`, `${v}t`, `${v}n.`];
      })
      .flat()
      .map(v => [v, Tone.Time(v).toSeconds()])
      .sort((a, b) => {
        return Number(b[1]) - Number(a[1]);
      });

    const duration = Math.max(
      (metronomModel.value.now() - openNotes.value.get(value.identifier)) /
        1000,
      Number(timeList[timeList.length - 1][1])
    );
    openNotes.value.delete(value.identifier);

    const time = Tone.Time(
      timeList
        .map(([, v]) => Number(v))
        .find(v => {
          const offset = v * 0.2;

          return v - offset <= duration && duration <= v + offset;
        })
    );

    const delay = metronomModel.value.getDuration();
    console.log({
      delay,
      name: value.identifier,
      time: time.toNotation()
    });
    $props.track.addNote(
      new NoteDescription({
        delay,
        name: value.identifier,
        time: time.toNotation()
      })
    );

    console.log('notes', $props.track.notes);
    if (openNotes.value.size < 1) {
      animationLoop?.stop();
      animationLoop = undefined;
    }
  } else {
    console.warn('onNoteOff', value);
  }
}

function onClickNote({
  note,
  selected
}: {
  note: NoteDescription;
  selected: boolean;
}) {
  console.log('onClickNote', { note, selected });
}

function startAnimationLoop(cb: CallableFunction) {
  let lastTime = 0;
  let total = 0;
  let stopped = false;
  const loop = (time: number) => {
    const delta = time - lastTime;
    lastTime = time;
    total += delta;
    cb(time, total);
    if (!stopped) {
      requestAnimationFrame(loop);
    }
  };
  requestAnimationFrame(loop);
  return {
    stop: () => (stopped = true)
  };
}
</script>
