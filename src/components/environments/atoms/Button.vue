<template>
  <label
    v-if="upload"
    class="wb-env-atom-button"
    :class="styleClasses"
  >
    <span class="label">{{ label }}</span>
    <input
      :id="id"
      :name="name"
      type="file"
      :accept="accept"
      :disabled="disabled"
      @input="onInput"
    >
  </label>
  <button
    v-else
    :type="type"
    class="wb-env-atom-button"
    :class="styleClasses"
    :disabled="disabled"
    @click="onClick"
  >
    <span class="label">{{ label }}</span>
  </button>
</template>

<story
  name="Button"
  group="Environments/Atoms"
  knobs="{
    type: {
      default: select('Type',['button','submit', 'upload'], 'button')
    },
    styleType: {
      default: select('Style-Type',['primary','secondary', 'dialog'], 'primary')
    },
    label: {
      default: text('Label','Button Label')
    },
    accept: {
      default: text('Accept','application/json')
    }
  }">

  <Button :type="type" :style-type="styleType" :label="label" :accept="accept" @click="{action('click')}" @upload="{action('upload')}" />
</story>

<script>
export default {
  props: {
    disabled: {
      type: Boolean,
      default: false
    },

    accept: {
      type: String,
      default: 'application/json'
    },

    type: {
      type: String,
      default () {
        return 'button'; // submit, upload
      }
    },

    styleType: {
      type: String,
      default () {
        return 'primary'; // primary, secondary, dialog
      }
    },

    id: {
      type: String,
      required: false,
      default: null
    },
    name: {
      type: String,
      required: false,
      default: null
    },
    label: {
      type: String,
      required: false,
      default: 'Primary Button'
    }

  },
  computed: {
    upload () {
      return this.type === 'upload';
    },
    styleClasses () {
      return {
        'wb-env-atom-button--disabled': this.disabled,
        'wb-env-atom-button--upload': this.upload,
        ['style-type--' + this.styleType]: this.styleType
      };
    }
  },
  methods: {
    onInput (e) {
      this.$emit('upload', e.target.files);
    },
    onClick () {
      this.$emit('click');
    }
  }
};

</script>

<style lang="postcss">
.wb-env-atom-button {
  box-sizing: border-box;
  display: block;
  width: 100%;
  padding: 0;
  text-align: center;
  user-select: none;
  background: transparent;
  border: none;
  border-radius: 0;
  outline: none;
  appearance: none;

  & .label {
    display: block;
    padding: 6px;
    padding-bottom: 4px;
    font-family: var(--workbenchFont_topaz);
    font-size: var(--global_fontSizePx);
    color: var(--workbenchColor_1);

    @nest .wb-atom-button-wrapper & {
      margin-top: 0;
      margin-bottom: 0;
    }
  }

  &.style-type--primary {
    & .label {
      color: var(--workbenchColor_3);
      background: var(--workbenchColor_1);
      border: solid var(--workbenchColor_1) 2px;
      outline: solid var(--workbenchColor_3) 2px;
      outline-width: 2px;
      outline-offset: -4px;

      &:active {
        filter: invert(100%);
      }
    }

    &.wb-env-atom-button--disabled {
      filter: invert(100%);
    }
  }

  &.style-type--secondary {
    & .label {
      background: var(--workbenchColor_3);
      border: none;
      border: solid var(--workbenchColor_1) 2px;

      &:active {
        filter: invert(100%);
      }
    }

    &.wb-env-atom-button--disabled {
      filter: invert(100%);
    }
  }

  &.style-type--dialog {
    & .label {
      padding: 6px;
      padding-top: 6px;
      padding-bottom: 4px;
      color: var(--workbenchColor_3);
      background: var(--workbenchColor_1);
      border: none;
      border: solid var(--workbenchColor_4) 2px;
      outline: solid var(--workbenchColor_3) 2px;
      outline-offset: -6px;

      &:active {
        filter: invert(100%);
      }
    }

    &.wb-env-atom-button--disabled {
      filter: invert(100%);
    }
  }

  &.wb-env-atom-button--upload {
    position: relative;
    display: block;
    padding: 0;
    overflow: hidden;

    & input {
      position: absolute;
      top: 0%;
      left: 0%;
      visibility: hidden;
    }

    &:active {
      filter: invert(100%);
    }

    &.wb-env-atom-button--disabled {
      filter: invert(100%);
    }
  }
}
</style>
