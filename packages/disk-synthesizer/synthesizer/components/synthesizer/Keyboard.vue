<template>
  <div
    ref="rootEl"
    :style="style"
    :class="styleClasses"
    :disabled="disabled"
    class="wb-disks-synthesizer-keyboard">
    <div>
      <div class="keys white">
        <div
          v-for="({ note, black }, index) in octaveRange"
          :key="index"
          class="key"
          :style="{ '--index': index }"
          :class="{
            black,
            white: !black,
            selected: noteNames.includes(note.toLowerCase())
          }"
          @mouseout="onPointerUp(note)"
          @pointerdown="onPointerDown(note)"
          @pointerup="onPointerUp(note)">
          <span v-if="!black">
            <i v-if="showNoteLabels">{{ note }}</i>
          </span>
        </div>
      </div>
      <div class="keys black">
        <div
          v-for="({ note, black }, index) in octaveRange"
          :key="index"
          class="key"
          :style="{ '--index': index }"
          :class="{
            black,
            white: !black,
            selected: noteNames.includes(note.toLowerCase())
          }"
          @mouseout="onPointerUp(note)"
          @pointerdown="onPointerDown(note)"
          @pointerup="onPointerUp(note)">
          <span v-if="black">
            <i v-if="showNoteLabels">{{ note }}</i>
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ipoint } from '@js-basics/vector';
import { resolveChord } from '../../utils/note';
import { computed, onMounted, ref } from 'vue';
import type NoteDescription from '../../classes/NoteDescription';

const rootEl = ref<HTMLElement>();

const MAX_OCTAVE = 9;

const $props = defineProps({
  disabled: {
    type: Boolean,
    default: false
  },
  selectedNotes: {
    type: Array<NoteDescription>,
    default: null
  },
  size: {
    type: String,
    validator: (value: string) => ['small', 'medium', 'large'].includes(value),
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
});

const $emit = defineEmits<{
  (e: 'down' | 'up', note: string): void;
}>();

const pressedKeys = ref<string[]>([]);
const dimension = ref(ipoint(0, 0));

const noteNames = computed(() => {
  return Array.from(
    new Set(
      $props.selectedNotes
        .map(note => resolveChord(note.getName() || ''))
        .flat()
    )
  );
});

const height = computed(() => {
  return {
    small: 96,
    medium: 96 * 1.5,
    large: 96 * 2
  }[$props.size];
});

const octaveRange = computed(() => {
  const result = [];
  const notes = [
    'c',
    'c#',
    'd',
    'd#',
    'e',
    'f',
    'f#',
    'g',
    'g#',
    'a',
    'a#',
    'b'
  ];
  for (let i = 0; i < $props.octaveCount; i++) {
    result.push(
      ...notes.map(char => {
        const note = `${char}${$props.startOctave + i}`;
        return {
          note,
          black: isBlackKey(note)
        };
      })
    );
  }
  if ($props.startOctave + $props.octaveCount <= MAX_OCTAVE) {
    result.push({
      note: notes[0] + ($props.startOctave + $props.octaveCount),
      black: false
    });
  }
  return result;
});
const styleClasses = computed(() => {
  return {
    disabled: $props.disabled
  };
});
const style = computed(() => {
  return {
    ...dimension.value.toCSSVars('dimension'),
    '--height': height.value,
    '--keys': octaveRange.value.filter(({ black }) => !black).length,
    '--white-keys': octaveRange.value.filter(({ black }) => !black).length,
    '--black-keys': octaveRange.value.filter(({ black }) => black).length
  };
});

onMounted(() => {
  dimension.value = ipoint(rootEl.value?.offsetWidth || 0, 0);
});

function isBlackKey(key: string) {
  return /^[a-z]#\d+/.test(key);
}

function onPointerDown(note: string) {
  if (!$props.disabled) {
    pressedKeys.value.push(note);
    $emit('down', note);
  }
}

function onPointerUp(note: string) {
  if (!$props.disabled && pressedKeys.value.includes(note)) {
    $emit('up', note);
    pressedKeys.value = pressedKeys.value.filter(key => key !== note);
  }
}
</script>

<style lang="postcss" scoped>
.wb-disks-synthesizer-keyboard {
  padding-top: 6px;

  & > div {
    position: relative;
    background: #000;
  }

  --height: 280;

  & .keys {
    position: relative;

    --gutter: 2px;
    --container-width: calc(
      var(--dimension-x) * 1px - (var(--gutter) * (var(--white-keys) - 1))
    );
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

      & > span {
        position: relative;
        display: block;
        width: var(--width);
        height: 100%;
      }

      & i {
        position: absolute;
        bottom: 4px;
        left: 50%;
        padding: 2px;
        font-family: var(--font-family-bit-font);
        font-size: 10px;
        font-style: normal;
        color: currentColor;
        color: #000;
        text-align: center;
        background: #fff;
        opacity: 1;
        transform: translateX(-50%);
      }
    }
  }

  & .keys.black {
    position: absolute;
    top: 0;
    left: 0;
  }

  & .keys.white .key {
    & > span {
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

    &.selected {
      & > span {
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

      & > span {
        position: relative;
        top: -6px;
        left: calc(-1 * var(--inner-width) / 2);
        width: var(--inner-width);
        height: 70%;
        color: white;
        background: black;
        border-bottom: solid 10px #444;
        filter: drop-shadow(2px 0 0 #ccc) drop-shadow(-2px 0 0 #ccc)
          drop-shadow(0 2px 0 #ccc) drop-shadow(0 -2px 0 #888);
      }

      &.selected {
        & > span {
          background: #444;
        }
      }
    }
  }

  &:not(.disabled) {
    & .keys.white .key {
      &:active {
        & > span {
          background: #aaa;
        }
      }
    }

    & .keys.black .key.black {
      &:active {
        & > span {
          background: #444;
        }
      }
    }
  }
}
</style>
