<template>
  <wb-env-atom-form-field tag="label" class="wb-env-atom-form-field-dropdown" :label="label">
    <div class="dropdown__wrapper">
      <select v-model="currentModel" v-bind="input">
        <option
          v-for="(option, index) in options"
          :key="index"
          :value="option.value"
        >
          {{ option.title }}
        </option>
      </select><span v-if="!disabled && !readonly" class="select__expander">
        <svg-control-tiny-array-down />
      </span>
    </div>
  </wb-env-atom-form-field>
</template>

<story
  name="Dropdown"
  group="Environments/Atoms/FormField"
  knobs="{}">
  <Dropdown />
</story>

<script>
import SvgControlTinyArrayDown from '@/assets/svg/control/tiny_arrow_down.svg?vue-template';

import WbEnvAtomFormField from '@/components/environments/atoms/FormField';

export default {
  components: { SvgControlTinyArrayDown, WbEnvAtomFormField },

  props: {

    model: {
      type: Object,
      default () {
        return {};
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

<style lang="postcss">

.wb-env-atom-form-field-dropdown {
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
    line-height: 1;
    color: var(--workbenchColor_1);
    vertical-align: middle;
    background: var(--workbenchColor_3);
    border: solid var(--workbenchColor_3) 2px;
    border-radius: 0;
    outline: none;
    outline: solid var(--workbenchColor_1) 2px;
    outline-offset: -4px;
    scrollbar-color: var(--workbenchColor_1) var(--workbenchColor_3);
    appearance: none;

    &::-webkit-scrollbar {
      width: 1em;
    }

    &::-webkit-scrollbar-track {
      background-color: var(--workbenchColor_3);
    }

    &::-webkit-scrollbar-thumb {
      background-color: var(--workbenchColor_1);
    }

    &:not([size]) {
      padding-top: 6px;
      padding-right: 32px;
      padding-left: 10px;
    }

    &[size] option {
      padding-top: 6px;
      padding-left: 10px;
    }

    &:disabled {
      color: var(--workbenchColor_3);
      background: var(--workbenchColor_1);
    }

    &:focus {
      filter: invert(100%);
    }

    @nest html.no-touchevents & {
      &:hover {
        filter: invert(100%);
      }
    }

    @nest html.touchevents & {
      &:active {
        filter: invert(100%);
      }
    }
  }

  & .select__expander {
    position: absolute;
    top: 0;
    right: 0;
    box-sizing: content-box;
    display: inline-block;
    flex: 1 auto;
    height: 1em;
    padding: 5px 10px;
    line-height: 1;
    vertical-align: top;
    pointer-events: none;
    background: var(--workbenchColor_1);
    border: solid var(--workbenchColor_3);
    border-width: 2px 2px 2px 0;

    /* transform: translateX(-100%); */

    & > * {
      position: absolute;
      top: 1em;
      left: 50%;
      display: block;
      margin-top: -5px;
      margin-left: -5px;
      fill: var(--workbenchColor_3);
    }
  }

  & select[size] + .select__expander {
    display: none;
  }

  & select:focus + .select__expander {
    filter: invert(100%);
  }

  @nest html.no-touchevents & {
    & select:hover,
    & select:hover + .select__expander {
      filter: invert(100%);
    }
  }

  @nest html.touchevents & {
    & select:hover,
    & select:active + .select__expander {
      filter: invert(100%);
    }
  }

  &.field__label-top {
    margin-top: 10px;

    & .field__label {
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
