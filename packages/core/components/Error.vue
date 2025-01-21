<template>
  <div class="wb-env-error" @click="onClick">
    <div class="inner">
      <span class="title">{{ text }}</span>
      <span class="input">{{ input }}</span>
      <br /><br />
      <span class="message clearfix">{{ placeholder }} {{ code }}</span>
    </div>
    <pre v-if="stack" class="stack">
      {{ stack }}
    </pre>
    <div class="content">
      <slot />
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  text: {
    type: String,
    default: 'Software Failure.'
  },
  input: {
    type: String,
    default: 'Press left mouse button or touch to continue.'
  },
  code: {
    type: String,
    default: '#00000000.00000000'
  },
  stack: {
    type: String,
    default:
      'at CommandContainer.action (http://localhost:6006/main.37cca2800c296072f35f.bundle.js:30395:15)\n    at CommandContainer.action (http://localhost:6006/main.37cca2800c296072f35f.bundle.js:17441:83)\n    at _callee4$ (http://localhost:6006/main.37cca2800c296072f35f.bundle.js:19515:28)\n    at tryCatch (http://localhost:6006/vendors~main.37cca2800c296072f35f.bundle.js:120008:40)\n    at Generator.invoke [as _invoke] (http://localhost:6006/vendors~main.37cca2800c296072f35f.bundle.js:120237:22)\n    at Generator.prototype.<computed> [as next] (http://localhost:6006/vendors~main.37cca2800c296072f35f.bundle.js:120060:21)\n    at asyncGeneratorStep (http://localhost:6006/main.37cca2800c296072f35f.bundle.js:19143:103)\n    at _next (http://localhost:6006/main.37cca2800c296072f35f.bundle.js:19145:194)\n    at http://localhost:6006/main.37cca2800c296072f35f.bundle.js:19145:364\n    at new Promise (<anonymous>)'
  },
  placeholder: {
    type: String,
    default: 'Guru Meditation'
  },
  userInteraction: {
    type: Boolean,
    default: true
  }
});

const emit = defineEmits(['close']);

const onClick = () => {
  if (props.userInteraction) {
    emit('close');
  }
};
</script>

<style lang="postcss" scoped>
.wb-env-error {
  --color-background: var(--color-error-background, #000);
  --color-text: var(--color-error-text, #f00);

  position: absolute;
  top: 0;
  left: 0;

  /* z-index: 150; */
  width: 100%;
  min-height: 100%;
  color: var(--color-text) !important;
  user-select: none;
  background: var(--color-background);

  & .title {
    float: left;
  }

  & .input {
    float: right;
  }

  & .inner {
    display: block;
    padding: 15px 40px;
    margin: 0 auto;
    text-decoration: none;
    border: solid;
    border-color: currentColor;
    border-width: 6px 5px;

    /* Animation */
    animation-name: blinking;
    animation-duration: 3s;
    animation-timing-function: linear;
    animation-iteration-count: infinite;
    animation-play-state: running;
  }

  & .message {
    clear: both;
    display: block;
    text-align: center;
  }

  & .stack {
    display: block;
    padding: 10px 20px;
    margin: 0 auto;

    /* font-family: var(--font-workbench-topaz-console); */
    line-height: calc(18px * 2);

    /* TODO: Hier nochmal gucken */
    /* stylelint-disable-next-line declaration-property-value-keyword-no-deprecated */
    word-break: break-word;
    white-space: pre-wrap;
    opacity: 0.4;

    @media (width >= 768px) {
      width: 80%;
    }
  }

  & .inner,
  & .content {
    /* TODO: ? */
    .static-mode & {
      max-width: 640px;
      margin: 0 auto;
    }
  }

  @media (--screen-xs-max) {
    & .title,
    & .input {
      float: none;
      display: block;
      margin-top: 20px;
      text-align: center;
    }

    & .content {
      .no-js & {
        margin: 20px;
      }
    }
  }
}

@keyframes blinking {
  0% {
    border-color: currentColor;
  }

  65% {
    border-color: currentColor;
  }

  70% {
    border-color: transparent;
  }

  100% {
    border-color: transparent;
  }
}
</style>
