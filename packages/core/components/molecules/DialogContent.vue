<template>
  <div class="wb-env-molecule-dialog-content">
    <div>
      <p v-if="message" v-html="formattedMessage" />
      <div v-if="prompt" class="input">
        <wb-form-field-textfield
          ref="dialogInput"
          v-model="modelValue"
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

<script lang="ts" setup>
import { computed, ref } from 'vue';
import WbButton from '../atoms/Button.vue';
import WbFormFieldTextfield from '../atoms/formField/Textfield.vue';
import WbButtonWrapper from '../molecules/ButtonWrapper.vue';

const $props = defineProps({
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
});

const $emit = defineEmits(['apply', 'abort']);

const modelValue = ref($props.promptValue);

const type = computed(() => ($props.password ? 'password' : $props.promptType));
const formattedMessage = computed(() =>
  $props.message.replace(/\\n|\n/g, '<br>')
);

const onClickApply = () => {
  const value = modelValue.value || true;
  if (typeof $props.apply === 'function') {
    $props.apply(value);
  } else {
    $emit('apply', value);
  }
};

const onClickAbort = () => {
  if (typeof $props.abort === 'function') {
    $props.abort();
  } else {
    $emit('abort');
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
  outline: solid var(--color-background-secondary) 2px;
  outline-offset: -4px;
  background: var(--color-background-primary);
  border: solid var(--color-background-primary) 2px;

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
