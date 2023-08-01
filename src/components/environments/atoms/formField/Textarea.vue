<template>
  <wb-env-atom-form-field tag="label" class="wb-env-atom-form-field-textarea" :label="label" :class="styleClasses" :label-top="labelTop">
    <span class="wrapper">
      <span>
        <textarea
          v-model="currentModel"
          v-bind="input"
        />
        <span class="helper resize">
          <svg-control-textarea-resize />
        </span>
      </span>
    </span>
  </wb-env-atom-form-field>
</template>

<script>
import SvgControlTextareaResize from '@/assets/svg/control/textarea_resize.svg?component';

import WbEnvAtomFormField from '@/components/environments/atoms/FormField';

export default {
  components: {
    SvgControlTextareaResize, WbEnvAtomFormField
  },

  props: {
    labelTop: {
      type: Boolean,
      default: false
    },

    model: {
      type: Object,
      default () {
        return {};
      }
    },

    label: {
      type: String,
      default: 'Textarea Label'
    },
    id: {
      type: String,
      default: null
    },
    name: {
      type: String,
      default: null
    },
    placeholder: {
      type: String,
      default: 'Textarea Placeholder…'
    },
    rows: {
      type: Number,
      default: null
    },
    wrap: {
      type: Boolean,
      default: true
    },
    resize: {
      type: String,
      validate: value => [
        'both', 'horizontal', 'vertical', null
      ].includes(value),
      default: 'both'
    },
    readonly: {
      type: Boolean,
      default: false
    },
    disabled: {
      type: Boolean,
      default: false
    },
    autocomplete: {
      type: Boolean,
      default: false
    }
  },

  computed: {
    currentModel: {
      get () {
        return this.name ? this.model[this.name] : this.model.value;
      },
      set (value) {
        if (this.name) {
          this.model[this.name] = value;
        } else {
          this.model.value = value;
        }
      }
    },
    styleClasses () {
      return {
        resize: this.resize,
        [`resize-${this.resize}`]: this.resize
      };
    },

    input () {
      return {
        id: this.id,
        name: this.name,
        placeholder: this.placeholder,
        rows: this.rows,
        wrap: this.wrap ? 'on' : 'off',
        resize: this.resize,
        readonly: this.readonly,
        disabled: this.disabled,
        autocomplete: this.autocomplete ? 'on' : 'off'
      };
    }
  }
};
</script>

<style lang="postcss" scoped>
.wb-env-atom-form-field-textarea {
  --color-text: var(--color-textarea-text, #fff);
  --color-background: var(--color-textarea-background, #05a);
  --color-border: var(--color-textarea-border, #05a);
  --color-outline: var(--color-textarea-outline, #fff);
  --color-resize-background: var(--color-textarea-resize-background, #05a);
  --color-resize-icon: var(--color-textarea-resize-icon, #fff);

  & textarea {
    box-sizing: border-box;
    display: block;
    width: 100%;
    padding: 6px;
    padding-top: 7px;
    padding-bottom: 4px;
    font-size: 1em;
    line-height: 1.2;
    color: var(--color-text);
    overflow-wrap: break-word;
    white-space: pre-wrap;
    appearance: none;
    resize: none;
    background: var(--color-background);
    border: solid var(--color-border) 2px;
    outline: solid var(--color-outline) 2px;
    outline-offset: -4px;

    ::-webkit-resizer {
      display: none;
    }

    &::placeholder {
      color: currentColor;
    }

    &:focus {
      filter: var(--filter-default);
    }

    html.no-touchevents & {
      &:hover {
        filter: var(--filter-default);
      }
    }

    html.touchevents & {
      &:active {
        filter: var(--filter-default);
      }
    }
  }

  & .resize {
    position: absolute;
    right: 2px;
    bottom: 2px;
    display: none;
    width: 16px;
    pointer-events: none;

    &::before {
      display: block;
      padding-top: 100%;
      content: "";
      background-color: var(--color-resize-background);
    }

    & svg {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;

      & :deep(*) {
        fill: var(--color-resize-icon);
      }
    }
  }

  &.resize {
    & .resize {
      display: block;
    }
  }

  &.resize-both {
    & textarea {
      resize: both;
    }
  }

  &.resize-horizontal {
    & textarea {
      resize: horizontal;
    }
  }

  &.resize-vertical {
    & textarea {
      resize: vertical;
    }
  }

  & textarea:focus + .resize {
    filter: var(--filter-default);
  }

  html.no-touchevents & {
    & textarea:hover + .resize {
      filter: var(--filter-default);
    }
  }

  html.touchevents & {
    & textarea:active + .resize {
      filter: var(--filter-default);
    }
  }

  & .wrapper {
    display: inline-block;

    & > span {
      position: relative;
      display: block;
    }
  }

  &.label-top {
    margin-top: 10px;

    & :deep(> .label) {
      display: block;
      padding-top: 0;
    }

    & textarea {
      display: block;
      width: 100%;
    }
  }
}
</style>
