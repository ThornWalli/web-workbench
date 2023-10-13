<template>
  <metronom :model="model" v-bind="$attrs" @pause="onPause" @draw="onDraw">
    <template v-for="(_, name) in $slots" #[name]="slotData">
      <slot :name="name" v-bind="slotData" />
    </template>
  </metronom>
</template>

<script>
import { Subscription, filter } from 'rxjs';
import Metronom from '../Metronom';
import MetronomClass from '../../../classes/Metronom';
import MidiController from '../../../classes/MidiController';
import NoteDescription from '../../../classes/NoteDescription';

import useTone from '../../../composables/useTone';

export default {
  components: { Metronom },

  inheritAttrs: false,

  props: {
    model: {
      type: MetronomClass,
      required: true
    },
    midiController: {
      type: MidiController,
      required: true
    },
    autoStart: {
      type: Boolean,
      default: false
    }
  },

  emits: ['note'],
  async setup() {
    return { ...(await useTone()) };
  },

  data() {
    return {
      ready: false,
      subscriptions: new Subscription(),
      openNotes: new Map()
    };
  },

  async mounted() {
    await this.midiController.start();

    const observable = this.midiController.listen();
    this.subscriptions.add(
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
  },

  methods: {
    onDraw(ctx, { position, dimension }) {
      const openNotes = Array.from(this.openNotes.values());
      for (let i = 0; i < openNotes.length; i++) {
        const openNote = openNotes[Number(i)];
        const duration =
          (this.model.getDuration() - openNote) / (this.model.speed * 2);
        const w = duration * dimension.x;
        // (window.Tone.Transport.bpm.value / 120 * this.model.speed);
        ctx.fillRect(position.x, position.y, w, dimension.y);

        // const w =
        //   (duration * dimension.x) /
        //   ((window.Tone.Transport.bpm.value / 120) * this.model.speed);
        // ctx.fillRect((dimension.x - w) / 2, 0, w, dimension.y);
      }
    },

    onStart() {
      this.model.play();
    },

    onPause() {
      this.model.pause();
    },

    onNoteOn({ value }) {
      const start = !this.openNotes.size;
      if (start) {
        this.onStart();
      }
      console.log(
        'value.identifier',
        value.identifier,
        this.model.getDuration()
      );
      this.openNotes.set(value.identifier, this.model.getDuration());
    },

    onNoteOff({ value }) {
      const dur = this.openNotes.get(value.identifier);

      this.openNotes.delete(value.identifier);
      const timeList = [1, 2, 4, 8, 16, 32]
        .map(v => {
          return [`${v}n`, `${v}t`, `${v}n.`];
        })
        .flat()
        .map(v => [v, new (this.tone.getTone().Time)(v).toSeconds()])
        .sort((a, b) => b[1] - a[1]);

      const duration = Math.max(
        this.model.getDuration() - dur,
        timeList[timeList.length - 1][1]
      );

      console.log('timeList', timeList);
      const time = new window.Tone.Time(
        timeList
          .map(([, v]) => v)
          // .reverse()
          // .map(v => 2 / v)
          .find(v => {
            const offset = v * 0.2;
            console.log(
              'vddddddd',
              duration,
              v,
              v - offset <= duration && duration <= v + offset
            );

            return v - offset <= duration && duration <= v + offset;
          })
      );
      console.log('time', time.toNotation());
      // const duration = Math.max((this.model.getDuration() - dur) / 2, 1 / 32);
      // const time = new window.Tone.Time(
      //   [0.5, 1, 2, 4, 8, 16, 32]
      //     .reverse()
      //     .map(v => 2 / v)
      //     .find(v => {
      //       const offset = v * 0.2;
      //       return v - offset <= duration <= v + offset;
      //     })
      // );

      const delay = Math.ceil(dur / time.toSeconds()) * time.toSeconds();
      console.log({
        name: value.identifier,
        time: time.toNotation(),
        delay
      });
      this.$emit(
        'note',
        new NoteDescription({
          delay,
          name: value.identifier,
          time: time.toNotation()
        })
      );

      // if (this.openNotes.size < 1) {
      //   this.model.pause();
      //   this.model.reset();
      // }
    }
  }
};
</script>
