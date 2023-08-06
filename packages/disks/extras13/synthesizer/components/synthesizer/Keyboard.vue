<template>
  <div :style="styleClasses" class="wb-disks-debug-synthesizer-keyboard">
    <div>
      <div
        class="keys white"
      >
        <div
          v-for="({note, black}, index) in octaveRange"
          :key="index"
          class="key"
          :style="{ '--index': index }"
          :class="{ black, white: !black }"
          @click="onClick(note)"
        >
          <span v-if="!black">
            <i v-if="showNoteLabels">{{ note }}</i>
          </span>
        </div>
      </div>
      <div
        class="keys black"
      >
        <div
          v-for="({note, black}, index) in octaveRange"
          :key="index"
          class="key"
          :style="{ '--index': index }"
          :class="{black, white: !black }"
          @click="onClick(note)"
        >
          <span v-if="black">
            <i v-if="showNoteLabels">{{ note }}</i>
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ipoint } from '@js-basics/vector';

export default {

  props: {
    size: {
      type: String,
      validator: value => [
        'small', 'medium', 'large'
      ].includes(value),
      default: 'large'
    },
    showNoteLabels: {
      type: Boolean,
      default: false
    },
    startOctave: {
      type: Number,
      default: 4
    },
    octaveCount: {
      type: Number,
      default: 6
    }
  },
  emits: [
    'note'
  ],

  data: function () {
    return {
      keys: [],
      dimension: ipoint()
    };
  },

  computed: {
    height () {
      return {
        small: 140,
        medium: 210,
        large: 280
      }[this.size];
    },
    octaveRange () {
      const result = [];
      const notes = [
        'C', 'Db', 'D', 'Eb', 'E', 'F', 'Gb', 'G', 'Ab', 'A', 'Bb', 'B'
      ];
      for (let i = 0; i < this.octaveCount; i++) {
        result.push(...notes.map((char) => {
          const note = `${char}${this.startOctave + i}`;
          return {
            note,
            black: this.isBlackKey(note)
          };
        }));
      }
      console.log(notes[0], this.startOctave, (this.octaveCount));
      result.push({
        note: notes[0] + (this.startOctave + (this.octaveCount)),
        black: false
      });
      return result;
    },
    styleClasses () {
      return {
        ...this.dimension.toCSSVars('dimension'),
        '--height': this.height,
        '--keys': this.octaveRange.filter(({ black }) => !black).length,
        '--white-keys': this.octaveRange.filter(({ black }) => !black).length,
        '--black-keys': this.octaveRange.filter(({ black }) => black).length
      };
    }
  },
  mounted () {
    this.dimension = ipoint(this.$el.offsetWidth, 0);
  },
  methods: {
    isBlackKey (key) {
      return /^[a-zA-Z]{2}\d+/.test(key);
    },
    onClick (note) {
      this.$emit('note', note);
    }
  }
};

</script>

<style lang="postcss" scoped>
.wb-disks-debug-synthesizer-keyboard {
  padding-top: 6px;

  & > div {
    position: relative;
    background: #000;
  }

  --height: 280;

  & .keys {
    position: relative;

    --gutter: 2px;
    --container-width: calc(var(--dimension-x) * 1px - (var(--gutter) * (var(--white-keys) - 1)));
    --width: calc(var(--container-width) / var(--keys));

    display: flex;
    width: 100%;
    height: calc(var(--height) * 1px);
    pointer-events: none;

    & .key {
      position: relative;
      display: block;
      width: var(--width);
      height: 100%;
      margin-left: 2px;
      overflow: hidden;

      &:first-child {
        margin-left: 0;
      }

      &>span {
        position: relative;
        display: block;
        width: var(--width);
        height: 100%;
      }

      & i {
        position: absolute;
        bottom: 4px;
        left: 0;
        width: 100%;
        color: currentColor;
        text-align: center;
        opacity: 1;
      }

    }

  }

  & .keys.black {
    position: absolute;
    top: 0;
    left: 0;
  }

  & .keys.white .key {
    &>span {
      color: black;
      background: white;
      border-bottom: solid 10px #aaa;
    }

    &.white {
      pointer-events: auto;
    }

    &.black {
      display: none;
    }

    &:active {
      &>span {
        background: #aaa;
      }
    }

  }

  & .keys.black .key {
    &.black {
      position: relative;
      width: 0;
      height: 100%;
      padding: 0;
      overflow: visible;
      pointer-events: auto;

      --black-width: calc(var(--width) * 0.6);
      --inner-width: calc(var(--black-width) - 2px);

      &>span {
        position: relative;
        top: -6px;
        left: calc(-1 * var(--inner-width) / 2);
        width: var(--inner-width);
        height: 70%;
        color: white;
        background: black;
        filter: drop-shadow(2px 0 0 #CCC) drop-shadow(-2px 0 0 #CCC) drop-shadow(0 2px 0 #CCC) drop-shadow(0 -2px 0 #888);
        border-bottom: solid 10px #444;
      }

      &:active {
        &>span {
          background: #444;
        }
      }

    }
  }

}
</style>
