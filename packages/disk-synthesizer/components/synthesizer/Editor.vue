<template>
  <div>
    <!-- <navigation v-bind="navigation"></navigation> -->
    <metronom
      :model="metronom"
      @render="onRender"
      @ready="onReady"
      @value="track.setCurrentDuration($event)">
      <template #background="{ onRefresh }">
        <timeline-canvas
          :key="metronom.value"
          :track="track"
          :duration="metronom.getDuration()"
          clickable
          @refresh="onRefresh"
          @note:click="onClickNote"
      /></template>
      <template #navigation="{ navigation: metronomNavigation }">
        <navigation v-bind="metronomNavigation" />
        <navigation v-bind="navigation" />
        <!-- <navigation v-bind="{ metronomNavigation, }"></navigation> -->
      </template>
    </metronom>
  </div>
</template>

<script>
import { Subscription, filter } from 'rxjs';
import domEvents from '@web-workbench/core/services/domEvents';
import Track from '../../classes/Track';
import MetronomClass from '../../classes/Metronom';
import MidiController from '../../classes/MidiController';
import useTone from '../../composables/useTone';
import NoteDescription from '../../classes/NoteDescription';
import { getNoteTimes } from '../../utils';
import TimelineCanvas from './TimelineCanvas';
import Navigation from './Navigation';
import Metronom from './Metronom';

export default {
  components: {
    TimelineCanvas,
    Navigation,
    Metronom
  },
  props: {
    track: {
      type: Track,
      required: true
    }
  },

  async setup() {
    return { ...(await useTone()) };
  },

  data() {
    return {
      duration: 0,
      model: {
        input: 'note',
        inputType: ''
      },
      metronom: new MetronomClass(),
      subscriptions: new Subscription(),
      midiController: new MidiController(),
      openNotes: new Map()
    };
  },

  computed: {
    navigation() {
      return {
        model: this.model,
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
            })),
            { spacer: true },
            {
              label: 'Remove Note',
              action: () => {
                this.track.removeNote(this.track.selectedIndex);
              }
            },
            {
              label: 'Clean Range',
              action: () => {
                this.track.removeNotesByDurationRange(
                  this.metronom.getDuration(),
                  this.metronom.timeDuration
                );
              }
            },
            {
              label: 'Clean Beat',
              action: () => {
                this.track.removeNotesFromBeat(this.track.getBeatIndex());
              }
            },
            {
              label: 'Reset',
              action: () => {
                this.reset();
              }
            }
          ]
          // [
          //   // {
          //   //   label: 'Prev Note',
          //   //   action: () => {
          //   //     this.track.selectPrevNote();
          //   //   }
          //   // },
          //   // {
          //   //   label: 'Next Note',
          //   //   action: () => {
          //   //     this.track.selectNextNote();
          //   //   }
          //   // },
          // ]

          // {
          //   fill: true,
          //   label: this.isPlaying ? 'Pause' : 'Start',
          //   action: async () => {
          //     if (this.isPlaying) {
          //       this.$emit('pause');
          //     } else {
          //       await this.tone.start();
          //       this.$emit('start');
          //     }
          //   }
          // },
          // this.notes.map(([value, title]) => ({
          //   label: `${title} Note`,
          //   name: 'time',
          //   value
          // })),
          // [1, 1.2, 2, 4, 8, 16, 32].map(value => ({
          //   label: `${value} X`,
          //   name: 'speed',
          //   value
          // }))
        ]
      };
    }
  },
  async mounted() {
    await this.midiController.start();
    console.log('domEvents', domEvents);
    const observable = this.midiController.listen();
    this.subscriptions.add(
      domEvents.keydown.subscribe(e => {
        switch (e.code) {
          case 'ArrowLeft':
            this.metronom.prev();
            break;
          case 'ArrowRight':
            this.metronom.next();
            break;
          case 'ArrowUp':
            this.metronom.prevBeat();
            break;
          case 'ArrowDown':
            this.metronom.nextBeat();
            break;
          default:
            if (/Digit(\d+)/.test(e.code)) {
              const number = e.code.replace(/Digit(\d+)/, '$1');

              const time = getNoteTimes()[number - 1];
              if (time) {
                this.metronom.time = time[0];
              }
            }
            break;
        }
        console.log(e);
      }),
      observable
        .pipe(filter(({ type }) => type === 'noteOn'))
        .subscribe(this.onNoteOn.bind(this)),
      observable
        .pipe(filter(({ type }) => type === 'noteOff'))
        .subscribe(this.onNoteOff.bind(this))
    );
  },

  unmounted() {
    this.subscriptions.unsubscribe();
    this.midiController.destroy();
  },

  methods: {
    onReady({ render }) {
      this._render = render;
    },
    onRender(ctx, { position, dimension }) {
      const openNotes = Array.from(this.openNotes.values());
      for (let i = 0; i < openNotes.length; i++) {
        const openNote = openNotes[Number(i)];
        console.log('test', openNote);
        const duration =
          (this.metronom.now() - openNote) / 1000 / (this.metronom.speed * 2);
        const w = duration * dimension.x;
        console.log(w);
        // (window.Tone.Transport.bpm.value / 120 * this.metronom.speed);
        ctx.fillRect(position.x, position.y, w, dimension.y);
      }
    },

    onNoteOn({ value }) {
      console.log(
        'value.identifier',
        value.identifier,
        this.metronom.getDuration()
      );
      if (!this.animationLoop) {
        this.animationLoop = animationLoop(() => {
          if (this._render) {
            this._render();
          }
        });
      }
      this.openNotes.set(value.identifier, this.metronom.now());
    },

    onNoteOff({ value }) {
      const timeList = [1, 2, 4, 8, 16, 32]
        .map(v => {
          return [`${v}n`, `${v}t`, `${v}n.`];
        })
        .flat()
        .map(v => [v, new (this.tone.getTone().Time)(v).toSeconds()])
        .sort((a, b) => b[1] - a[1]);

      const duration = Math.max(
        (this.metronom.now() - this.openNotes.get(value.identifier)) / 1000,
        timeList[timeList.length - 1][1]
      );
      this.openNotes.delete(value.identifier);

      const time = new window.Tone.Time(
        timeList
          .map(([, v]) => v)
          .find(v => {
            const offset = v * 0.2;

            return v - offset <= duration && duration <= v + offset;
          })
      );
      console.log('time', time.toNotation());

      const delay = this.metronom.getDuration();
      console.log({
        delay,
        name: value.identifier,
        time: time.toNotation()
      });
      this.track.addNote(
        new NoteDescription({
          delay,
          name: value.identifier,
          time: time.toNotation()
        })
      );

      console.log('notes', this.track.notes);
      if (this.openNotes.size < 1) {
        this.animationLoop.stop();
        this.animationLoop = null;
      }
    },

    reset() {
      this.track.reset();
    },

    onClickNote(e) {
      console.log('onClickNote', e);
    }
  }
};

function animationLoop(cb) {
  let lastTime = 0;
  let total = 0;
  let stopped = false;
  const loop = time => {
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
