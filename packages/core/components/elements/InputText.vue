<template>
  <div class="wb-env-element-input-text" :class="styleClasses">
    <div>
      <div class="result">
        <template v-if="value.length > 0 && selectionEnd > 0">
          <template v-if="selectionStart >= 0 && selectionEnd === value.length">
            <span v-html="escapeHtml(value.slice(0, selectionStart))" />
            <span
              class="selected"
              v-html="
                escapeHtml(value.slice(selectionStart, selectionEnd + 1)) ||
                '&nbsp;'
              " />
          </template>
          <template
            v-else-if="selectionStart && selectionStart === selectionEnd">
            <span v-html="escapeHtml(value.slice(0, selectionStart))" />
            <span
              class="selected"
              v-html="
                escapeHtml(value.slice(selectionStart, selectionStart + 1)) ||
                '&nbsp;'
              " />
            <span
              v-html="
                escapeHtml(value.slice(selectionStart + 1, value.length))
              " />
          </template>
          <template v-else>
            <span v-html="escapeHtml(value.slice(0, selectionStart))" />
            <span
              class="selected"
              v-html="escapeHtml(value.slice(selectionStart, selectionEnd))" />
            <span
              v-html="escapeHtml(value.slice(selectionEnd, value.length))" />
          </template>
        </template>
        <span v-if="!selectionStart && value === ''" class="selected"
          >&nbsp;</span
        >
        <template
          v-else-if="
            value.length > 0 &&
            !selectionStart &&
            selectionStart === selectionEnd
          ">
          <span class="selected" v-html="escapeHtml(value.slice(0, 1))" />
          <span v-html="escapeHtml(value.slice(1, value.length))" />
        </template>
      </div>

      <div class="input">
        <textarea
          v-if="multiline"
          ref="inputEl"
          v-model="value"
          :readonly="readonly"
          @pointerdown="onPointerDown"
          @input="onInput"
          @click="onClick"
          @keydown="onKeydown"
          @keyup="onKeyup"
          @focus="onClick" />
        <input
          v-if="!multiline"
          ref="inputEl"
          v-model="value"
          type="text"
          :readonly="readonly"
          @pointerdown="onPointerDown"
          @input="onInput"
          @click="onClick"
          @keydown="onKeydown"
          @keyup="onKeyup"
          @focus="onClick" />
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { Subscription, first, debounceTime, filter } from 'rxjs';

import { escapeHtml } from '../../utils/string';
import domEvents from '../../services/domEvents';
import {
  computed,
  getCurrentInstance,
  onMounted,
  onUnmounted,
  ref,
  watch
} from 'vue';
import { findClosestEl } from '@web-workbench/core/services/dom';
import { KEYBOARD_CODE } from '@web-workbench/core/types/dom';

const $props = defineProps({
  rootElement: {
    type: HTMLElement,
    default() {
      return null;
    }
  },
  overrideFocused: {
    type: Boolean,
    default: false
  },
  readonly: {
    type: Boolean,
    required: false,
    default: false
  },
  multiline: {
    type: Boolean,
    required: false,
    default: true
  },
  name: {
    type: String,
    default: 'value'
  },
  modelValue: {
    type: String,
    default: undefined
  },
  /**
   * @deprecated
   * @description Use modelValue instead
   */
  model: {
    type: Object,
    required: false,
    default() {
      return {
        value: 'Input Value'
      };
    }
  }
});

const $emit = defineEmits<{
  (e: 'blur' | 'refresh' | 'input'): void;
  (e: 'update:model-value' | 'enter', value: string): void;
  (e: 'keydown' | 'keyup', value: KeyboardEvent): void;
}>();

const inputEl = ref<HTMLInputElement | null>(null);
const focused = ref($props.overrideFocused);
const selectionLength = ref(0);
const selectionStart = ref(0);
const selectionEnd = ref(0);
const controlShiftActive = ref(false);
const controlCapsLockActive = ref(false);
let focusedSubscriptions = new Subscription();

const value = computed({
  get() {
    return $props.modelValue || '';
  },
  set(value) {
    $emit('update:model-value', value);
  }
});

const styleClasses = computed(() => {
  return {
    readonly: $props.readonly,
    multiline: $props.multiline,
    'selection-empty': !selectionLength.value,
    focused: focused.value,
    'shift-active': controlShiftActive.value,
    'caps-lock-active': controlCapsLockActive.value
  };
});

watch(
  () => $props.overrideFocused,
  value => {
    focused.value = value;
  }
);
watch(
  () => focused.value,
  value => {
    if (value) {
      onFocus();
    } else {
      onBlur();
    }
  }
);

onMounted(() => {
  inputEl.value?.setSelectionRange(value.value.length, value.value.length);
  refresh();
  if (focused.value) {
    onFocus();
  }
});

onUnmounted(() => {
  focusedSubscriptions.unsubscribe();
});

function onFocus() {
  focusedSubscriptions.add(
    domEvents.pointerDown
      .pipe(
        filter(({ target }) => {
          const instance = getCurrentInstance();
          const el = $props.rootElement || instance?.parent?.vnode.el;
          return !findClosestEl(target as HTMLElement, el as HTMLElement);
        }),
        first()
      )
      .subscribe(onBlur)
  );
  focusedSubscriptions.add(
    domEvents.keyPress.subscribe(() => {
      inputEl.value?.focus();
    })
  );
  focusedSubscriptions.add(
    domEvents.keyDown.subscribe(({ code }) => {
      switch (code) {
        case KEYBOARD_CODE.SHIFT_LEFT:
        case KEYBOARD_CODE.SHIFT_RIGHT:
          controlShiftActive.value = true;
          break;
        case KEYBOARD_CODE.CAPS_LOCK:
          controlCapsLockActive.value = !controlCapsLockActive.value;
          break;
      }
    })
  );
  focusedSubscriptions.add(
    domEvents.keyUp.subscribe(e => {
      switch (e.code) {
        case KEYBOARD_CODE.SHIFT_LEFT:
        case KEYBOARD_CODE.SHIFT_RIGHT:
          controlShiftActive.value = false;
          break;
      }
      $emit('keyup', e);
    })
  );
  inputEl.value?.focus();
}

function onBlur() {
  focusedSubscriptions.unsubscribe();
  focusedSubscriptions = new Subscription();
  inputEl.value?.blur();
  $emit('blur');
}

function refresh() {
  const el = inputEl.value;
  if (el) {
    selectionStart.value = el.selectionStart || 0;
    selectionEnd.value = el.selectionEnd || 0;
    selectionLength.value = selectionEnd.value - selectionStart.value;
    $emit('refresh');
  }
}

function setFocus(value: boolean) {
  focused.value = value;
}

// Dom Events
function onPointerDown() {
  const subscription = domEvents.pointerMove
    .pipe(debounceTime(128))
    .subscribe(() => {
      refresh();
    });

  domEvents.pointerUp.pipe(first()).subscribe(() => {
    subscription.unsubscribe();
  });
}
function onInput() {
  refresh();
  $emit('input');
}
function onClick() {
  if (focused.value) {
    refresh();
  } else {
    setFocus(true);
  }
}
function onKeydown(e: KeyboardEvent) {
  if (!$props.multiline && e.code === KEYBOARD_CODE.ENTER) {
    e.preventDefault();
    e.stopPropagation();
    $emit('enter', value.value);
    refresh();
  } else {
    $emit('keydown', e);
    refresh();
  }
}
function onKeyup(e: KeyboardEvent) {
  $emit('keyup', e);
  refresh();
}

defineExpose({
  resetSelection: () => {
    inputEl.value?.setSelectionRange(0, 0);
  },
  controlShiftActive,
  controlCapsLockActive
});
</script>

<style lang="postcss" scoped>
.wb-env-element-input-text {
  --color-selected: var(--color-input-text-selected, #05a);
  --color-pointer: #fa5;

  min-width: 120px;
  padding-top: 1px;

  & > div {
    position: relative;
    min-height: 18px;
  }

  & * {
    font-family: var(--font-family-workbench-topaz-console);
  }

  & .result {
    font-size: 0;

    & > span {
      padding-top: 1px;
      font-size: initial;
    }
  }

  &:not(.selection-empty) {
    & .selected {
      display: inline;
      background: var(--color-selected);
      filter: var(--filter-default);
    }
  }

  & .input {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    overflow: visible;

    & textarea,
    & input[type='text'] {
      width: 100%;
      height: 100%;
      padding: 0;
      overflow: visible;
      line-height: 18px;
      color: black;
      appearance: none;
      resize: none;
      outline: none;
      border: 0;
      opacity: 0;

      &:focus {
        background-color: red;
      }
    }
  }

  &.multiline {
    & .result {
      overflow: visible;
      white-space: pre;
    }

    & .input {
      & textarea {
        white-space: pre;
      }
    }
  }

  /* &.full {
    & .input {
      padding-bottom: calc(18px * 2);

      & textarea {
        width: calc(100% + 30px);
        height: calc(100% + 18px * 2);
        padding-right: 30px;
        overflow-y: scroll;
      }
    }
  } */

  &:not(.readonly) {
    &.selection-empty {
      & .selected {
        position: relative;

        &::before {
          position: absolute;
          top: 0;
          bottom: 0;
          left: 0;
          display: inline-block;
          width: 100%;
          min-width: 8px;
          content: '';
          background: var(--color-pointer);
          animation-name: editor-cursor-blinking;
          animation-duration: 1200ms;
          animation-timing-function: linear;
          animation-iteration-count: infinite;
          animation-play-state: paused;

          .scaling &,
          .moving & {
            display: none !important;
          }
        }
      }
    }

    &.focused,
    &.focused.selection-empty {
      & .selected {
        &::before {
          display: inline-block;
          animation-play-state: running;
        }
      }
    }
  }
}

@keyframes editor-cursor-blinking {
  0% {
    visibility: visible;
  }

  50% {
    visibility: hidden;
  }

  100% {
    visibility: hidden;
  }
}
</style>
