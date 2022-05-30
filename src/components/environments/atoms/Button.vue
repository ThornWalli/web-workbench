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
:root {
  --color__button__label: #fff;

  /* Primary Style */
  --color__button__primary__label: #05a;
  --color__button__primary__background: #fff;
  --color__button__primary__border: #fff;
  --color__button__primary__outline: #05a;

  /* Secondary Style */
  --color__button__secondary__label: #fff;
  --color__button__secondary__background: #05a;
  --color__button__secondary__border: #fff;

  /* Dialog Style */
  --color__button__dialog__label: #05a;
  --color__button__dialog__background: #fff;
  --color__button__dialog__border: #fa5;
  --color__button__dialog__outline: #05a;
}

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
    padding: 8px;
    padding-bottom: 4px;
    font-family: var(--workbenchFont_topaz);
    font-size: var(--global_fontSizePx);

    @nest .wb-atom-button-wrapper & {
      margin-top: 0;
      margin-bottom: 0;
    }
  }

  &.style-type--primary {
    & .label {
      color: var(--color__button__primary__label);
      background: var(--color__button__primary__background);
      border: solid var(--color__button__primary__border) 2px;
      outline: solid var(--color__button__primary__outline) 2px;
      outline-width: 2px;
      outline-offset: -4px;
    }
  }

  &.style-type--secondary {
    & .label {
      color: var(--color__button__secondary__label);
      background: var(--color__button__secondary__background);
      border: none;
      border: solid var(--color__button__secondary__border) 2px;
    }
  }

  &.style-type--dialog {
    & .label {
      padding: 6px;
      padding-top: 6px;
      padding-bottom: 4px;
      color: var(--color__button__dialog__label);
      background: var(--color__button__dialog__background);
      border: solid var(--color__button__dialog__border) 2px;
      outline: solid var(--color__button__dialog__outline) 2px;
      outline-offset: -6px;
    }
  }

  &.style-type--primary,
  &.style-type--secondary,
  &.style-type--dialog {
    &:active {
      filter: var(--filter__default);
    }

    &.wb-env-atom-button--disabled {
      filter: var(--filter__default);
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
  }
}
</style>
