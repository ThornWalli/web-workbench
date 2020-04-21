<template>
  <wb-env-atom-form-field tag="label" class="wb-env-atom-form-textbox" :label="label">
    <input
      ref="input"
      v-model="currentModel"
      v-bind="input"
    >
  </wb-env-atom-form-field>
</template>

<story
  name="Textbox"
  group="Environments/Atoms/FormField"
  knobs="{}">
  <Textbox />
</story>

<script>

import WbEnvAtomFormField from '@/components/environments/atoms/FormField';

export default {

  components: { WbEnvAtomFormField },

  props: {
    model: {
      type: Object,
      default () {
        return {};
      }
    },
    label: {
      type: String,
      default: 'Textbox Label'
    },
    type: {
      type: String,
      default: 'text'
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
      default: 'Placeholder'
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
    input () {
      return {
        name: this.name,
        type: this.type,
        placeholder: this.placeholder,
        readonly: this.readonly,
        disabled: this.disabled,
        autocomplete: this.autocomplete ? 'on' : 'off'
      };
    }
  }
};
</script>

<style lang="postcss">

.wb-env-atom-form-textbox {
  & input {
    box-sizing: content-box;
    display: inline-block;
    width: 160px;
    padding: 6px;
    padding-bottom: 4px;
    margin: 0 -2px;
    color: var(--workbenchColor_1);
    vertical-align: middle;
    background: var(--workbenchColor_3);
    border: solid var(--workbenchColor_3) 2px;
    outline: solid var(--workbenchColor_1) 2px;
    outline-offset: calc(-4 / var(--global_fontSize) * 1em);
    appearance: none;

    /* @nest .wb-env-dialog & {
      box-sizing: border-box;
      display: block;
      width: 100%;
      color: var(--workbenchColor_3);
      background: var(--workbenchColor_1);
      border: solid var(--workbenchColor_1) 2px;
      outline: solid var(--workbenchColor_3) 2px;
    } */

    &::placeholder {
      color: currentColor;
    }

    &:disabled,
    &[readonly] {
      color: var(--workbenchColor_3);
      background: var(--workbenchColor_1);
    }

    &:not([readonly]) {
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
  }
}
</style>
