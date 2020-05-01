<template>
  <div class="wb-env-molecule-dialog-content">
    <div>
      <p v-if="message" v-html="formattedMessage" />
      <div
        v-if="prompt"
        class="dialog-content__input"
      >
        <wb-form-field-textbox
          ref="dialogInput"
          :model="inputModel"
          :placeholder="null"
          :type="password ? 'password' : 'text'"
          :label="null"
        />
      </div>

      <wb-button-wrapper
        :align="!abortLabel ? 'center': 'outer'"
        class="dialog-content__buttons"
      >
        <wb-button
          v-if="applyLabel || confirm && yesLabel"
          style-type="dialog"
          :label="confirm ? yesLabel : applyLabel"
          @click="onClickApply"
        />
        <wb-button
          v-if="abortLabel || confirm && noLabel"
          style-type="dialog"
          :label="confirm ? noLabel : abortLabel"
          @click="onClickAbort"
        />
      </wb-button-wrapper>
    </div>
  </div>
</template>

<story
  name="DialogContent"
  group="Environments/Molecules"
  knobs="{}">
  <DialogContent message="Ok to Initialize volume\nRAM DISK\n(all data will be erased) ?" />
</story>

<script>

import WbButton from '@/components/environments/atoms/Button';
import WbFormFieldTextbox from '@/components/environments/atoms/formField/Textbox';
import WbButtonWrapper from '@/components/environments/molecules/ButtonWrapper';

export default {

  components: {
    WbButton,
    WbFormFieldTextbox,
    WbButtonWrapper
  },

  props: {
    message: {
      type: String,
      default () {
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
    password: {
      type: Boolean,
      default: false
    },
    apply: {
      type: Function,
      default () {
        return null;
      }
    },
    abort: {
      type: Function,
      default () {
        return null;
      }
    },
    applyLabel: {
      type: String,
      default () {
        return 'Continue';
      }
    },
    abortLabel: {
      type: String,
      default () {
        return 'Cancel';
      }
    },
    yesLabel: {
      type: String,
      default () {
        return 'Yes';
      }
    },
    noLabel: {
      type: String,
      default () {
        return 'No';
      }
    }
  },
  data () {
    return {
      inputModel: {
        value: ''
      }
    };
  },
  computed: {
    formattedMessage () {
      return this.message.replace(/\\n|\n/g, '<br>');
    }
  },
  methods: {
    onClickApply () {
      const value = this.inputModel.value || true;
      if (typeof this.apply === 'function') {
        this.apply(value);
      } else {
        this.$emit('apply', value);
      }
    },
    onClickAbort () {
      if (typeof this.abort === 'function') {
        this.abort();
      } else {
        this.$emit('abort');
      }
    }
  }

};

</script>

<style lang="postcss">
:root {
  --color__dialogContent__backgroundPrimary: #fff;
  --color__dialogContent__backgroundSecondary: #fff;
  --color__dialogContent__text: #0055ad;
}

.wb-env-molecule-dialog-content {
  width: 300px;
  min-width: 280px;
  padding: 2px;
  padding: 0 var(--default-element-margin);
  margin: 2px;
  color: var(--color__dialogContent__text);
  background: var(--color__dialogContent__backgroundPrimary);
  border: solid var(--color__dialogContent__backgroundPrimary) 2px;
  outline: solid var(--color__dialogContent__backgroundSecondary) 2px;
  outline-offset: -4px;

  & > div {
    padding: var(--default-element-margin);
    padding-top: 0;
  }

  & p {
    margin: calc(var(--default-element-margin) * 2) 0;
  }

  & .dialog-content__input {
    padding: 0 var(--default-element-margin);
  }

  & .dialog-content__buttons {
    padding: 0 calc(var(--default-element-margin) * 2);
    margin: var(--default-element-margin) 0;
  }
}
</style>
