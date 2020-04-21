<template>
  <div
    class="wb-env-atom-input-text"
    :class="styleClasses"
  >
    <div>
      <div class="input-text__result">
        <template v-if="value.length > 0 && selectionEnd > 0">
          <template v-if="selectionStart >= 0 && selectionEnd === value.length">
            <span v-html="escapeHtml(value.slice(0, selectionStart)) " />
            <span class="input-text__selected" v-html="escapeHtml(value.slice(selectionStart, selectionEnd + 1)) || '&nbsp;'" />
          </template>
          <template v-else-if="selectionStart && selectionStart === selectionEnd">
            <span v-html="escapeHtml(value.slice(0, selectionStart)) " />
            <span class="input-text__selected" v-html="escapeHtml(value.slice(selectionStart, selectionStart + 1)) || '&nbsp;'" />
            <span v-html="escapeHtml(value.slice(selectionStart + 1, value.length)) " />
          </template>
          <template v-else>
            <span v-html="escapeHtml(value.slice(0, selectionStart)) " />
            <span class="input-text__selected" v-html="escapeHtml(value.slice(selectionStart, selectionEnd)) " />
            <span v-html="escapeHtml(value.slice(selectionEnd, value.length)) " />
          </template>
        </template>
        <span v-if="!selectionStart && value === ''" class="input-text__selected 5">&nbsp;</span>
        <template v-else-if="value.length > 0 && !selectionStart && selectionStart === selectionEnd">
          <span class="input-text__selected" v-html="escapeHtml(value.slice(0, 1))" />
          <span v-html="escapeHtml(value.slice(1, value.length)) " />
        </template>
      </div>

      <div class="input-text__input">
        <textarea
          v-if="multiline"
          ref="input"
          v-model="value"
          :readonly="readonly"
          @touchstart="onPointerDown"
          @mousedown="onPointerDown"
          @input="onInput"
          @click="onClick"
          @keydown="onKeydown"
          @keyup="onKeyup"
          @focus="onClick"
        />
        <input
          v-if="!multiline"
          ref="input"
          v-model="value"
          type="text"
          :readonly="readonly"
          @touchstart="onPointerDown"
          @mousedown="onPointerDown"
          @input="onInput"
          @click="onClick"
          @keydown="onKeydown"
          @keyup="onKeyup"
          @focus="onClick"
        >
      </div>
    </div>
  </div>
</template>
<story
  name="InputText"
  group="Environments/Atoms"
  knobs="{}">

  <InputText />
</story>

<script>

import { first, debounceTime, filter } from 'rxjs/operators';
import { escapeHtml } from '@/web-workbench/utils/string';
import domEvents from '@/web-workbench/services/domEvents';
import { touchEvent, closestEl } from '@/web-workbench/services/dom';

export default {
  props: {
    rootElement: {
      type: HTMLElement,
      default () {
        return null;
      }
    },
    options: {
      type: Object,
      default () {
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
    model: {
      type: Object,
      required: false,
      default () {
        return {
          value: 'Input Value'
        };
      }
    }
  },

  data () {
    return {
      escapeHtml,
      selectionLength: null,
      selectionStart: null,
      selectionEnd: null,
      controlShiftActive: false,
      controlCapsLockActive: false,
      focusedSubscribtions: [],
      refreshFrame: null
    };
  },

  computed: {
    focused () {
      return this.options.focused;
    },
    value: {
      get () {
        return this.model[this.name];
      },
      set (value) {
        this.model[this.name] = value;
      }
    },
    styleClasses () {
      return {
        'js--readonly': this.readonly,
        'js--multiline': this.multiline,
        'js--selection-empty': !this.selectionLength,
        'js--focused': this.focused,
        'js--shift-active': this.controlShiftActive,
        'js--caps-lock-active': this.controlCapsLockActive
      };
    }
  },

  watch: {
    focused (value) {
      if (value) {
        this.focusedSubscribtions.push(
          domEvents.get('click').pipe(filter(({ target }) => !closestEl(target, this.rootElement || this.$parent.$el)), first()).subscribe(this.blur.bind(this)),
          domEvents.get('keypress').subscribe(function () { this.$refs.input.focus(); }.bind(this)),
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
          }));
        this.$refs.input.focus();
      } else {
        this.focusedSubscribtions.forEach(subscription => subscription.unsubscribe());
        this.focusedSubscribtions = [];
        this.$refs.input.blur();
      }
    }
  },

  destroyed () {
    global.cancelAnimationFrame(this.refreshFrame);
    this.focusedSubscribtions.forEach(subscription => subscription.unsubscribe());
  },

  mounted () {
    this.$refs.input.setSelectionRange(this.value.length, this.value.length);
    this.refresh();
  },

  methods: {

    focus () {
      this.setFocus(true);
    },

    blur () {
      this.setFocus(false);
    },

    refresh () {
      this.selectionStart = this.$refs.input.selectionStart;
      this.selectionEnd = this.$refs.input.selectionEnd;
      this.selectionLength = this.selectionEnd - this.selectionStart;
      this.$emit('refresh');
    },

    // Events

    setFocus (focused) {
      this.options.focused = focused;
    },

    // Dom Events
    onPointerDown (e) {
      const subscribtion = domEvents.pointerMove
        .pipe(debounceTime(128))
        .subscribe((e) => {
          touchEvent(e);
          this.refresh();
        });

      domEvents.pointerUp.pipe(first()).subscribe((e) => {
        touchEvent(e);
        subscribtion.unsubscribe();
      });
    },
    onInput () {
      this.refresh();
      this.$emit('input');
    },
    onClick () {
      if (!this.focused) {
        this.setFocus(true);
      } else { this.refresh(); }
    },
    onKeydown (e) {
      if (!this.multiline && e.keyCode === 13) {
        e.preventDefault();
        e.stopPropagation();
        this.$emit('enter', this.model[this.name]);
        this.refresh();
      } else {
      // this.onKeydownup();
        this.$emit('keydown', e);
        this.refresh();
      }
    },
    onKeyup (e) {
      // this.onKeydownup();
      this.$emit('keyup', e.keyCode);
      this.refresh();
    }
  }
};

</script>

<style lang="postcss">
.wb-env-atom-input-text {
  min-width: 120px;
  padding-top: 1px;

  /* color: var(--workbenchColor_1);
  background: var(--workbenchColor_3); */

  & > div {
    position: relative;
    min-height: 18px;
  }

  & * {
    font-family: var(--workbenchFont_topaz_console);
  }

  & .input-text__result {
    font-size: 0;

    & > span {
      padding-top: 1px;
      font-size: initial;
    }
  }

  &:not(.js--selection-empty) {
    & .input-text__selected {
      display: inline;
      background: var(--workbenchColor_3);
      filter: invert(100%);
    }
  }

  & .input-text__input {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    overflow: visible;

    & textarea,
    & input[type="text"] {
      width: 100%;
      height: 100%;
      padding: 0;
      overflow: visible;
      line-height: 18px;
      color: black;
      resize: none;
      border: 0;
      outline: none;
      opacity: 0;
      appearance: none;
    }
  }

  &.js--multiline {
    & .input-text__result {
      overflow: visible;
      white-space: pre;
    }

    & .input-text__input {
      textarea {
        white-space: pre;
      }
    }
  }

  /* &.js--full {
    & .input-text__input {
      padding-bottom: calc(18px * 2);

      & textarea {
        width: calc(100% + 30px);
        height: calc(100% + 18px * 2);
        padding-right: 30px;
        overflow-y: scroll;
      }
    }
  } */

  &:not(.js--readonly) {
    &.js--selection-empty {
      & .input-text__selected {
        position: relative;

        &::before {
          position: absolute;
          top: 0;
          bottom: 0;
          left: 0;
          display: inline-block;
          width: 100%;
          min-width: 8px;
          content: "";
          background: currentColor;

          /* background: var(--workbenchColor_1); */
          mix-blend-mode: difference;
          animation-name: editor_cursor_blinking;
          animation-duration: 1200ms;
          animation-play-state: paused;
          animation-timing-function: linear;
          animation-iteration-count: infinite;

          @nest .js--scaling &, .js--moving & {
            display: none !important;
          }
        }
      }
    }

    &.js--focused,
    &.js--focused.js--selection-empty {
      & .input-text__selected {
        &::before {
          display: inline-block;
          animation-play-state: running;
        }
      }
    }
  }
}

@keyframes editor_cursor_blinking {
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
