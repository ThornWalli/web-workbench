<template>
  <div class="wb-env-molecule-dialog-content">
    <div>
      <p v-if="message" v-html="formattedMessage" />
      <div v-if="prompt" class="input">
        <wb-form-field-textbox
          ref="dialogInput"
          v-model="value"
          :placeholder="null"
          :step="promptStep"
          :type="type"
          :label="null" />
      </div>

      <wb-button-wrapper
        :align="!abortLabel ? 'center' : 'outer'"
        class="buttons">
        <wb-button
          v-if="applyLabel || (confirm && yesLabel)"
          style-type="dialog"
          :label="confirm ? yesLabel : applyLabel"
          @click="onClickApply" />
        <wb-button
          v-if="abortLabel || (confirm && noLabel)"
          style-type="dialog"
          :label="confirm ? noLabel : abortLabel"
          @click="onClickAbort" />
      </wb-button-wrapper>
    </div>
  </div>
</template>

<script>
import WbButton from '../atoms/Button';
import WbFormFieldTextbox from '../atoms/formField/Textbox';
import WbButtonWrapper from '../molecules/ButtonWrapper';

export default {
  components: {
    WbButton,
    WbFormFieldTextbox,
    WbButtonWrapper
  },

  props: {
    message: {
      type: String,
      default() {
        return 'Dialog Message';
      }
    },
    confirm: {
      type: Boolean,
      default: false
    },
    prompt: {
      type: Boolean,
      default: false
    },
    promptType: {
      type: String,
      default: 'text'
    },
    promptStep: {
      type: Number,
      default: undefined
    },
    promptValue: {
      type: String,
      default: ''
    },
    password: {
      type: Boolean,
      default: false
    },
    apply: {
      type: Function,
      default() {
        return null;
      }
    },
    abort: {
      type: Function,
      default() {
        return null;
      }
    },
    applyLabel: {
      type: String,
      default() {
        return 'Continue';
      }
    },
    abortLabel: {
      type: String,
      default() {
        return 'Cancel';
      }
    },
    yesLabel: {
      type: String,
      default() {
        return 'Yes';
      }
    },
    noLabel: {
      type: String,
      default() {
        return 'No';
      }
    }
  },

  emits: ['apply', 'abort'],

  data() {
    return {
      value: this.promptValue
    };
  },

  computed: {
    isNumber() {
      return this.promptType === 'number';
    },
    type() {
      return this.password ? 'password' : this.promptType;
    },
    formattedMessage() {
      return this.message.replace(/\\n|\n/g, '<br>');
    }
  },

  methods: {
    onClickApply() {
      const value = this.value || true;
      if (typeof this.apply === 'function') {
        this.apply(value);
      } else {
        this.$emit('apply', value);
      }
    },
    onClickAbort() {
      if (typeof this.abort === 'function') {
        this.abort();
      } else {
        this.$emit('abort');
      }
    }
  }
};
</script>

<style lang="postcss" scoped>
.wb-env-molecule-dialog-content {
  --color-background-primary: var(
    --color-dialog-content-background-primary,
    #fff
  );
  --color-background-secondary: var(
    --color-dialog-content-background-secondary,
    #fff
  );
  --color-text: var(--color-dialog-content-text, #05a);

  width: 300px;
  min-width: 280px;
  padding: 2px;
  padding: 0 var(--default-element-margin);
  margin: 2px;
  color: var(--color-text);
  background: var(--color-background-primary);
  border: solid var(--color-background-primary) 2px;
  outline: solid var(--color-background-secondary) 2px;
  outline-offset: -4px;

  & > div {
    padding: var(--default-element-margin);
    padding-top: 0;
  }

  & p {
    margin: calc(var(--default-element-margin) * 2) 0;
  }

  & .input {
    padding: 0 var(--default-element-margin);
  }

  & .buttons {
    /* padding: 0 calc(var(--default-element-margin) * 2); */
    margin: var(--default-element-margin) 0;
  }
}
</style>
