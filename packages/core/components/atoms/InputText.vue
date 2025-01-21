<template>
  <div class="wb-env-atom-input-text" :class="styleClasses">
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
          ref="input"
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
          ref="input"
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

<script>
import { Subscription, first, debounceTime, filter } from 'rxjs';

import { escapeHtml } from '../../utils/string';
import domEvents from '../../services/domEvents';
import { touchEvent, closestEl } from '../../services/dom';

export default {
  props: {
    rootElement: {
      type: HTMLElement,
      default() {
        return null;
      }
    },
    options: {
      type: Object,
      default() {
        return {
          focused: false
        };
      }
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
    model: {
      type: Object,
      required: false,
      default() {
        return {
          value: 'Input Value'
        };
      }
    }
  },

  emits: [
    'update:model-value',
    'input',
    'refresh',
    'keydown',
    'keyup',
    'enter'
  ],

  data() {
    return {
      escapeHtml,
      selectionLength: null,
      selectionStart: null,
      selectionEnd: null,
      controlShiftActive: false,
      controlCapsLockActive: false,
      focusedSubscriptions: new Subscription(),
      refreshFrame: null
    };
  },

  computed: {
    focused() {
      return this.options.focused;
    },
    value: {
      get() {
        if (this.modelValue !== undefined) {
          return this.modelValue || '';
        }
        console.log('modelValue', this.modelValue);
        return this.model[this.name];
      },
      set(value) {
        if (this.modelValue !== undefined) {
          this.$emit('update:model-value', value);
        } else {
          console.warn('model is deprecated');
          this.model[this.name] = value;
        }
      }
    },
    styleClasses() {
      return {
        readonly: this.readonly,
        multiline: this.multiline,
        'selection-empty': !this.selectionLength,
        focused: this.focused,
        'shift-active': this.controlShiftActive,
        'caps-lock-active': this.controlCapsLockActive
      };
    }
  },

  watch: {
    focused(value) {
      if (value) {
        this.focusedSubscriptions.add(
          domEvents
            .get('click')
            .pipe(
              filter(
                ({ target }) =>
                  !closestEl(target, this.rootElement || this.$parent.$el)
              ),
              first()
            )
            .subscribe(this.blur.bind(this)),
          domEvents.get('keypress').subscribe(
            function () {
              this.$refs.input?.focus();
            }.bind(this)
          ),
          domEvents.get('keydown').subscribe(({ keyCode }) => {
            switch (keyCode) {
              case 16:
                this.controlShiftActive = true;
                break;
              case 20:
                this.controlCapsLockActive = !this.controlCapsLockActive;
                break;
            }
          }),
          domEvents.get('keyup').subscribe(({ keyCode }) => {
            switch (keyCode) {
              case 16:
                this.controlShiftActive = false;
                break;
            }
            this.$emit('keyup', keyCode);
          })
        );
        this.$refs.input.focus();
      } else {
        this.focusedSubscriptions.unsubscribe();
        this.$refs.input.blur();
      }
    }
  },

  unmounted() {
    window.cancelAnimationFrame(this.refreshFrame);
    this.focusedSubscriptions.unsubscribe();
  },

  mounted() {
    this.$refs.input.setSelectionRange(this.value.length, this.value.length);
    this.refresh();
    if (this.focused) {
      this.$refs.input.focus();
    }
  },

  methods: {
    focus() {
      this.setFocus(true);
    },

    blur() {
      this.setFocus(false);
    },

    resetSelection() {
      const input = this.$refs.input;
      this.selectionStart = input.selectionStart = 0;
      this.selectionEnd = input.selectionEnd = 0;
      this.selectionLength = 0;
    },

    refresh() {
      const input = this.$refs.input;
      this.selectionStart = input.selectionStart;
      this.selectionEnd = input.selectionEnd;
      this.selectionLength = this.selectionEnd - this.selectionStart;
      this.$emit('refresh');
    },

    // Events

    setFocus(focused) {
      this.options.focused = focused;
    },

    // Dom Events
    onPointerDown() {
      const subscription = domEvents.pointerMove
        .pipe(debounceTime(128))
        .subscribe(e => {
          touchEvent(e);
          this.refresh();
        });

      domEvents.pointerUp.pipe(first()).subscribe(e => {
        touchEvent(e);
        subscription.unsubscribe();
      });
    },
    onInput() {
      this.refresh();
      this.$emit('input');
    },
    onClick() {
      if (!this.focused) {
        this.setFocus(true);
      } else {
        this.refresh();
      }
    },
    onKeydown(e) {
      if (!this.multiline && e.keyCode === 13) {
        e.preventDefault();
        e.stopPropagation();
        this.$emit('enter', this.value);
        this.refresh();
      } else {
        this.$emit('keydown', e);
        this.refresh();
      }
    },
    onKeyup(e) {
      this.$emit('keyup', e.keyCode);
      this.refresh();
    }
  }
};
</script>

<style lang="postcss" scoped>
.wb-env-atom-input-text {
  --color-selected: var(--color-input-text-selected, #05a);
  --color-pointer: #fa5;

  min-width: 120px;
  padding-top: 1px;

  & > div {
    position: relative;
    min-height: 18px;
  }

  & * {
    font-family: var(--font-workbench-topaz-console);
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
