<template>
  <wb-env-atom-form-field tag="label" class="wb-env-atom-form-field-dropdown" :label="label">
    <div class="wrapper">
      <select v-model="currentModel" v-bind="input">
        <option
          v-for="(option, index) in options"
          :key="index"
          :value="option.value"
        >
          {{ option.title }}
        </option>
      </select><span v-if="!disabled && !readonly" class="select-expander">
        <svg-control-tiny-array-down />
      </span>
    </div>
  </wb-env-atom-form-field>
</template>

<script>
import SvgControlTinyArrayDown from '@/assets/svg/control/tiny_arrow_down.svg?component';

import WbEnvAtomFormField from '@/components/environments/atoms/FormField';

export default {
  components: { SvgControlTinyArrayDown, WbEnvAtomFormField },

  props: {

    model: {
      type: Object,
      default () {
        return {
          value: 'option-1'
        };
      }
    },

    label: {
      type: String,
      default: 'Select Label'
    },
    id: {
      type: String,
      default: null
    },
    name: {
      type: String,
      default: null
    },
    size: {
      type: Number,
      default: null
    },
    multiple: {
      type: Boolean,
      default: false
    },
    readonly: {
      type: Boolean,
      default: false
    },
    disabled: {
      type: Boolean,
      default: false
    },
    options: {
      type: Array,
      default () {
        return [
          { title: 'Option 1.', value: 'option-1' },
          { title: 'Option 2.', value: 'option-2' },
          { title: 'Option 3.', value: 'option-3' },
          { title: 'Option 4.', value: 'option-4' },
          { title: 'Option 5.', value: 'option-5' }
        ];
      }
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
    input () {
      return {
        id: this.id,
        size: this.size > 1 ? this.size : null,
        multiple: this.multiple,
        readonly: this.readonly,
        disabled: this.disabled
      };
    }
  }
};
</script>

<style lang="postcss" scoped>
.wb-env-atom-form-field-dropdown {
  --color-disabled-text: var(--color-dropdown-disabled-text, #05a);
  --color-disabled-background: var(--color-dropdown-disabled-background, #fff);
  --color-text: var(--color-dropdown-text, #fff);
  --color-background: var(--color-dropdown-background, #05a);
  --color-border: var(--color-dropdown-border, #05a);
  --color-outline: var(--color-dropdown-outline, #fff);
  --color-scrollbar-primary: var(--color-dropdown-scrollbar-primary, #fff);
  --color-scrollbar-secondary: var(--color-dropdown-scrollbar-secondary, #05a);
  --color-expander-icon: var(--color-dropdown-expander-icon, #05a);
  --color-expander-border: var(--color-dropdown-expander-border, #05a);
  --color-expander-background: var(--color-dropdown-expander-background, #fff);

  position: relative;

  /* & > * {
    display: inline-block;
    font-size: 1rem;
  } */
  & > div {
    position: relative;
  }

  & select {
    box-sizing: border-box;
    width: 100%;
    padding-bottom: 4px;
    margin: 0 -2px;
    line-height: 18px;
    color: var(--text);
    vertical-align: middle;
    appearance: none;
    background: var(--color-background);
    border: solid var(--color-border) 2px;
    border-radius: 0;
    outline: none;
    outline: solid var(--color-outline) 2px;
    outline-offset: -4px;
    scrollbar-color: var(--color-scrollbar-primary) var(--color-scrollbar-secondary);

    &::-webkit-scrollbar {
      width: 1em;
    }

    &::-webkit-scrollbar-track {
      background-color: var(--color-scrollbar-secondary);
    }

    &::-webkit-scrollbar-thumb {
      background-color: var(--color-scrollbar-primary);
    }

    &:not([size]) {
      padding-top: 6px;
      padding-right: 32px;
      padding-left: 6px;
    }

    &[size] option {
      padding-top: 6px;
      padding-left: 10px;
    }

    &:disabled {
      color: var(--color-disabled-text);
      background: var(--color-disabled-background);
      opacity: 1;
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

  & .select-expander {
    position: absolute;
    top: 0;
    right: 0;
    box-sizing: content-box;
    display: inline-block;
    flex: 1 auto;
    height: 18px;
    padding: 5px 10px;
    line-height: 1;
    vertical-align: top;
    pointer-events: none;
    background: var(--color-expander-background);
    border: solid var(--color-expander-border);
    border-width: 2px 2px 2px 0;

    /* transform: translateX(-100%); */

    & > * {
      position: absolute;
      top: 1em;
      left: 50%;
      display: block;
      margin-top: -5px;
      margin-left: -5px;
      fill: var(--color-expander-icon);
    }
  }

  & select[size] + .select-expander {
    display: none;
  }

  & select:focus + .select-expander {
    filter: var(--filter-default);
  }

  html.no-touchevents & {
    & select:hover,
    & select:hover + .select-expander {
      filter: var(--filter-default);
    }
  }

  html.touchevents & {
    & select:hover,
    & select:active + .select-expander {
      filter: var(--filter-default);
    }
  }

  &.field-label-top {
    margin-top: 10px;

    & .field-label {
      display: block;
      padding-top: 0;
    }

    & select {
      display: block;
      width: 100%;
    }
  }
}
</style>
