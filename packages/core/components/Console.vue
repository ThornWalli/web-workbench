<template>
  <div
    ref="rootEl"
    class="wb-env-console"
    :class="styleClasses"
    @click="onClick">
    <div class="wrapper">
      <ul ref="consoleOutputEl" class="output typo-style" />
      <div class="input">
        <span
          ref="consoleCommandDelimiterEl"
          class="prefix"
          v-html="delimiter" />
        <wb-env-element-input-text
          ref="inputEl"
          :root-element="rootElement || $el"
          class="element"
          :multiline="false"
          :override-focused="parentFocused"
          :readonly="readonly"
          :model-value="inputModel.value"
          @blur="onInputBlur"
          @update:model-value="onUpdateModelValue"
          @enter="onInputEnter"
          @keydown="onInputKeydown" />
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import {
  computed,
  getCurrentInstance,
  markRaw,
  nextTick,
  onMounted,
  onUnmounted,
  reactive,
  ref,
  watch
} from 'vue';

import { ConsoleInterface } from '../classes/ConsoleInterface';

import { CommandBucket } from '../services/commandBucket';
import CommandContainer from '../classes/Command';
import ConsoleLogger from '../classes/logger/Console';
import WbEnvElementInputText from './elements/InputText.vue';

import { KEYBOARD_CODE } from '../types/dom';
import useWindow from '../composables/useWindow';
import type { TriggerRefresh } from '../types/component';

const {
  window: windowInstance,
  core: coreModule,
  parentFocused,
  parentLayout
} = useWindow();

let consoleCount = 1;

const rootEl = ref<HTMLElement | null>(null);
const consoleOutputEl = ref<HTMLElement | null>(null);
const consoleCommandDelimiterEl = ref<HTMLElement | null>(null);
const inputEl = ref<InstanceType<typeof WbEnvElementInputText> | null>(null);

const $props = defineProps({
  rootElement: {
    type: HTMLElement,
    default() {
      return null;
    }
  },
  showIntroduction: {
    type: Boolean,
    default() {
      return false;
    }
  },
  delimiterPrefix: {
    type: String,
    default: '1.SYS'
  },
  readonly: {
    type: Boolean,
    default: false
  },
  startCommands: {
    type: [Array<string>, String],
    default: null
  },
  preRows: {
    type: Array<string>,
    default() {
      return [];
    }
  }
});

const $emit = defineEmits<{
  (e: 'freeze' | 'unfreeze' | 'startCommandsComplete'): void;
  (e: 'refresh', value: TriggerRefresh): void;
}>();

// ###

const commandBucket = markRaw(new CommandBucket());

commandBucket.add([
  new CommandContainer({
    name: ['CLS', 'CLEAR'],
    action() {
      clearConsole();
    }
  })
]);

const logger = ref(
  markRaw(
    new ConsoleLogger({
      core: coreModule,
      consoleInterface: new ConsoleInterface(),
      onAdd: onAdd
    })
  )
);

const inputModel = ref({ value: '', focused: false });

const inputHistory = ref<string[]>([]);
const currentRow = ref(0);
const startRow = ref(0);
const rows = ref([`[CLI ${consoleCount}]`]);
const inputHistoryIndex = ref(-1);
const lineHeight = ref(18);

const delimiterOptions = ref<{
  value: object | string;
  prompt: boolean;
  confirm: boolean;
}>({
  value: $props.delimiterPrefix,
  prompt: false,
  confirm: false
});

const activeSleepResolve = ref(null);
const activeConfirmResolve = ref(null);
const activePromptResolve = ref(null);
const triggerRefresh = ref<boolean | { scroll?: boolean } | null>(false);

const executeOptions = reactive({
  show: true,
  logger,
  showCommand: true,
  commandBucket
});

// #region Computed

const styleClasses = computed(() => {
  return {
    'js--prompt': activePromptResolve.value,
    'js--focused': parentFocused.value
  };
});

const delimiter = computed(() => {
  let value = delimiterOptions.value.value;
  const { confirm, prompt } = delimiterOptions.value;
  if (confirm) {
    value = '(y/n) ?';
  } else if (prompt) {
    value = '?';
  } else if (value) {
    value = `${value}:&gt`;
  }
  if (value) {
    value = `${value}&nbsp;`;
  }
  return value;
});

const parentLayoutSize = computed(() => {
  return parentLayout.value.size;
});

// #endregion

// #region Watchers

let resizeTimeout: number;
watch(
  () => parentLayoutSize.value,
  () => {
    window.clearTimeout(resizeTimeout);
    resizeTimeout = window.setTimeout(() => {
      render();
    }, 200);
  }
);
watch(
  () => activeSleepResolve.value,
  () => {
    setDelimiter({ value: '' });
  }
);
watch(
  () => activeConfirmResolve.value,
  () => {
    setDelimiter({
      value: $props.delimiterPrefix,
      confirm: activeConfirmResolve.value
    });
  }
);
watch(
  () => activePromptResolve.value,
  () => {
    setDelimiter({
      value: $props.delimiterPrefix,
      prompt: activePromptResolve.value
    });
  }
);

// #endregion

// #region Initialization

rows.value.unshift(...$props.preRows);

onMounted(async () => {
  const instance = getCurrentInstance();
  if (instance && instance.parent && 'console' in instance.parent) {
    instance.parent.console = this;
  }
  consoleCount++;
  if ($props.showIntroduction) {
    const instruction = createInstruction();
    if (instruction) {
      await instruction.then(() => {
        return enter('basic "TMP:CONSOLE_INSTRUCTIONS.basic"', {
          showCommand: false
        });
      });
    }
  }
  nextTick(async () => {
    if ($props.startCommands) {
      const commands = Array<string>().concat($props.startCommands);
      const run = (commands: string[]): Promise<undefined> => {
        return enter(commands.shift() || '', {
          showCommand: false
        }).then(() => {
          if (commands.length > 0) {
            return run(commands);
          }
          return undefined;
        });
      };
      await run(commands);

      $emit('startCommandsComplete');
    }
  });
});

onUnmounted(() => {
  consoleCount--;
});

// #endregion

// #region Methods

function onUpdateModelValue(value: string) {
  inputModel.value.value = value;
}

async function enter(value: string, options?: object) {
  inputHistoryIndex.value = -1;
  currentRow.value = 0;
  startRow.value = 0;
  $emit('freeze');

  const result = await coreModule.executeCommand(value, {
    ...executeOptions,
    ...options
  });

  if (result && (typeof result === 'number' || typeof result === 'string')) {
    onAdd(result);
  }
  $emit('unfreeze');

  render();
  refresh(true);
}

function createInstruction() {
  const lines = [
    '#basic',
    'CLS',
    'PRINT "Scroll (Up/Down): <strong>Shift+Up</strong> / <strong>Shift+Down</strong>"',
    'PRINT "Enter <strong>commands</strong> to show all commands."'
  ];
  return coreModule.modules.files?.fs.createTmpFile(
    'CONSOLE_INSTRUCTIONS.basic',
    'CONSOLE_INSTRUCTIONS.basic',
    {
      type: 'basic',
      content: lines
    }
  );
}

function clearConsole() {
  startRow.value = rows.value.length;
  render();
}

function render() {
  if (rootEl.value && consoleOutputEl.value) {
    consoleOutputEl.value.innerHTML = '';
    const maxRows =
      Math.floor(rootEl.value.offsetHeight / lineHeight.value) - 2;

    let i = 0;
    while (currentRow.value + i < currentRow.value + maxRows) {
      const row =
        rows.value[
          Math.max(rows.value.length - maxRows - currentRow.value, 0) + i
        ];
      if (row !== undefined) {
        const liEl = document.createElement('li');
        liEl.innerHTML = String(row).replace(/[\\]?\\n/, '<br>') + '\n';
        consoleOutputEl.value.appendChild(liEl);
      } else {
        break;
      }
      i++;
    }
  }
}

function refresh(trigger?: boolean) {
  nextTick(() => {
    if (trigger) {
      triggerRefresh.value = {
        scroll: true
      };
      $emit('refresh', triggerRefresh.value);
      nextTick(() => {
        triggerRefresh.value = null;
      });
    }
  });
}

function moveRows(direction: boolean) {
  let change = false;
  if (direction) {
    // top
    if (startRow.value > 0) {
      startRow.value = 0;
      change = true;
    } else if (currentRow.value < rows.value.length) {
      currentRow.value++;
      change = true;
    }
  } else if (currentRow.value > 0) {
    // bottom
    currentRow.value--;
    change = true;
  }
  if (change) {
    render();
  }
}

function setDelimiter(value: string | object, prompt = false, confirm = false) {
  delimiterOptions.value = {
    ...delimiterOptions,

    value,
    prompt,
    confirm
  };
}

function onAdd(message: string | string[] | number) {
  const messages = [];

  if (Array.isArray(message)) {
    messages.push(...message);
  } else {
    messages.push(String(message));
  }

  rows.value.push(...messages);
  render();
}

function onClick() {
  inputModel.value.focused = true;
}

function onInputEnter(value: string) {
  if (inputHistory.value[inputHistory.value.length - 1] !== value) {
    inputHistory.value.push(value);
  }
  inputModel.value.value = '';
  return enter(value);
}
function onInputBlur() {
  inputModel.value.focused = false;
  refresh();
  windowInstance.unfocus();
}
function onInputKeydown(e: KeyboardEvent) {
  const code = e.code;
  let change = false;
  if (
    (inputEl.value?.controlCapsLockActive ||
      inputEl.value?.controlShiftActive) &&
    (code === KEYBOARD_CODE.ARROW_UP || code === KEYBOARD_CODE.ARROW_DOWN)
  ) {
    e.preventDefault();
    moveRows(code === KEYBOARD_CODE.ARROW_UP);
  } else {
    switch (code) {
      case KEYBOARD_CODE.ARROW_UP:
        inputHistoryIndex.value++;
        inputHistoryIndex.value = Math.min(
          inputHistoryIndex.value,
          inputHistory.value.length - 1
        );
        change = true;
        break;
      case KEYBOARD_CODE.ARROW_DOWN:
        inputHistoryIndex.value--;
        inputHistoryIndex.value = Math.max(inputHistoryIndex.value, -1);
        change = true;
        break;
    }

    if (change && inputHistory.value.length > 0) {
      let value;
      if (inputHistoryIndex.value < 0) {
        value = '';
      } else {
        value =
          inputHistory.value[
            inputHistory.value.length - 1 - inputHistoryIndex.value
          ];
      }
      inputModel.value.value = value;
    }
    refresh();
  }
}

// #endregion
</script>

<style lang="postcss" scoped>
.wb-env-console {
  --color-text: var(--color-console-text, #fff);
  --color-typo-fieldset-border: var(--color-console-typo-fieldset-border, #fa5);
  --color-typo-line: var(--color-console-typo-line, #fff);
  --color-typo-strong: var(--color-console-typo-strong, #fa5);
  --color-typo-strong-em: var(--color-console-typo-strong-em, #fff);

  min-height: 100%;
  padding: 3px;
  line-height: normal;
  color: var(--color-text);
  user-select: none;

  #root > & {
    @media (height >=480px) {
      position: absolute;
      top: 50%;
      left: 50%;
      width: 640px;
      height: 480px;
      min-height: auto;
      margin-top: -240px;
      margin-left: -320px;
    }
  }

  & a {
    color: currentColor;
    text-decoration: none;

    &::before {
      content: '- ';
    }

    &:hover {
      &::before {
        content: '+ ';
      }
    }
  }

  & .input,
  & .output {
    &,
    & * {
      font-family: var(--font-workbench-topaz-console);
      white-space: pre;
    }
  }

  & .output {
    word-break: break-all;
    white-space: pre-wrap;

    & > * {
      clear: fix;

      & .row-table-row,
      & .row-table-head {
        white-space: nowrap;

        & > * {
          position: relative;
          display: inline-block;
          vertical-align: top;

          & > * {
            width: 100%;
            white-space: normal;
          }
        }
      }
    }
  }

  & .input {
    display: flex;

    /* padding-bottom: calc(var(--global-font-size-px) - 3px);

    .js--scroll-y & {
      padding-bottom: 0 !important;
    } */

    & .element {
      flex: 1;
    }
  }

  & .prefix {
    padding-top: 1px;

    & span {
      display: none;
    }
  }
}

.typo-style {
  & fieldset {
    padding: 5px 10px;
    margin: 10px 0;
    border: solid var(--color-typo-fieldset-border) 2px;

    & legend {
      padding: 0 10px;
      line-height: 1;
    }
  }

  & hr {
    display: block;
    height: 4px;
    margin: 15px -1px;
    appearance: none;
    background: var(--color-typo-line);
    border: solid var(--color-typo-line);
    border: none;
    border-width: 2px 0 0;
  }

  & h2 {
    font-size: 32px;
    font-weight: normal;
    line-height: 1;
  }

  & p {
    margin: 5px 0;
    overflow: hidden;
    line-height: calc(20 / var(--global-font-size-px));
  }

  & :deep(strong),
  & :deep(b) {
    font-weight: normal;
    color: var(--color-typo-strong);

    & em {
      color: var(--color-typo-strong-em);
    }
  }

  & pre {
    overflow: visible;
  }

  & ul.bullets {
    padding: 0.5em 0;

    li {
      position: relative;
      padding-left: 0.75em;

      &::before {
        position: absolute;
        top: 0;
        left: 0;
        display: block;
        content: '•';
      }
    }
  }
}
</style>
