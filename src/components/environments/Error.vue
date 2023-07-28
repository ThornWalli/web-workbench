<template>
  <div
    class="wb-env-error"
    @click="onClick"
  >
    <div class="error__inner">
      <span class="error__title">{{ text }}</span>
      <span class="error__input">{{ input }}</span>
      <br><br>
      <span class="error__message clearfix">{{ placeholder }} {{ code }}</span>
    </div>
    <pre v-if="stack" class="error__stack">
      {{ stack }}
    </pre>
    <div class="error__content">
      <slot />
    </div>
  </div>
</template>

<script>
export default {
  props: {
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
      default: 'at CommandContainer.action (http://localhost:6006/main.37cca2800c296072f35f.bundle.js:30395:15)\n    at CommandContainer.action (http://localhost:6006/main.37cca2800c296072f35f.bundle.js:17441:83)\n    at _callee4$ (http://localhost:6006/main.37cca2800c296072f35f.bundle.js:19515:28)\n    at tryCatch (http://localhost:6006/vendors~main.37cca2800c296072f35f.bundle.js:120008:40)\n    at Generator.invoke [as _invoke] (http://localhost:6006/vendors~main.37cca2800c296072f35f.bundle.js:120237:22)\n    at Generator.prototype.<computed> [as next] (http://localhost:6006/vendors~main.37cca2800c296072f35f.bundle.js:120060:21)\n    at asyncGeneratorStep (http://localhost:6006/main.37cca2800c296072f35f.bundle.js:19143:103)\n    at _next (http://localhost:6006/main.37cca2800c296072f35f.bundle.js:19145:194)\n    at http://localhost:6006/main.37cca2800c296072f35f.bundle.js:19145:364\n    at new Promise (<anonymous>)'
    },
    placeholder: {
      type: String,
      default: 'Guru Meditation'
    },
    userInteraction: {
      type: Boolean,
      default: true
    }
  },
  methods: {
    onClick () {
      if (this.userInteraction) {
        this.$emit('close');
      }
    }
  }
};
</script>

<style lang="postcss">
:root {
  --color__error__background: #000;
  --color__error__text: #f00;
}
</style>

<style lang="postcss" scoped>
.wb-env-error {
  position: absolute;
  top: 0;
  left: 0;

  /* z-index: 150; */
  width: 100%;
  min-height: 100%;
  color: var(--color__error__text) !important;
  user-select: none;
  background: var(--color__error__background);

  & .error__title {
    float: left;
  }

  & .error__input {
    float: right;
  }

  & .error__inner {
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
    animation-play-state: running;
    animation-timing-function: linear;
    animation-iteration-count: infinite;
  }

  & .error__message {
    display: block;
    clear: both;
    text-align: center;
  }

  & .error__stack {
    display: block;
    padding: 10px 20px;
    margin: 0 auto;

    /* font-family: var(--workbenchFont_topaz_console); */
    line-height: calc(18px * 2);
    word-break: break-word;
    white-space: pre-wrap;
    opacity: 0.4;

    @media (width >= 768px) {
      width: 80%;
    }
  }

  & .error__inner,
  & .error__content {
    .js--static-mode & {
      max-width: 640px;
      margin: 0 auto;
    }
  }

  @media (--screen-xs-max) {
    & .error__title,
    & .error__input {
      display: block;
      float: none;
      margin-top: 20px;
      text-align: center;
    }

    & .error__content {
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
