<template>
  <div
    class="wb-env-console"
    :class="styleClasses"
    @click="onClick"
  >
    <div class="console__wrapper">
      <ul
        ref="consoleOutput"
        class="console__output typo-style"
      />
      <div class="console__input">
        <span
          ref="consoleCommandDelimiter"
          class="console__input__prefix"
          v-html="delimiter"
        />
        <wb-env-atom-input-text
          ref="input"
          :root-element="rootElement || $el"
          class="console__input__element"
          :multiline="false"
          :options="options"
          :readonly="readonly"
          :model="inputModel"
          @enter="onInputEnter"
          @keydown="onInputKeydown"
        />
      </div>
    </div>
  </div>
</template>

<script>

// Unknown command

import { ipoint } from '@js-basics/vector';
import { CommandBucket } from '@/web-workbench/services/commandBucket';
import CommandContainer from '@/web-workbench/classes/Command';
import ConsoleLogger from '@/web-workbench/classes/logger/Console';
import WbEnvAtomInputText from '@/components/environments/atoms/InputText';
import webWorkbench from '@/web-workbench';
import { ConsoleInterface } from '../../web-workbench/classes/ConsoleInterface';

let consoleCount = 1;

export default {
  components: {
    WbEnvAtomInputText
  },

  props: {
    core: {
      type: Object,
      required: false,
      default () {
        return webWorkbench;
      }
    },

    rootElement: {
      type: HTMLElement,
      default () {
        return null;
      }
    },
    options: {
      type: Object,
      default () {
        return {
          focused: false
        };
      }
    },
    parentFocused: {
      type: Boolean,
      default () {
        return false;
      }
    },
    showIntroduction: {
      type: Boolean,
      default () {
        return false;
      }
    },
    parentLayout: {
      type: Object,
      default () {
        return {
          size: ipoint(0, 0)
        };
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
      type: [
        Array, String
      ],
      default: null
    },
    preRows: {
      type: [
        Array
      ],
      default () {
        return [];
      }
    }
  },
  data () {
    const logger = new ConsoleLogger({
      core: this.core,
      consoleInterface: new ConsoleInterface(),
      onAdd: this.onAdd
    });
    const commandBucket = new CommandBucket();

    const consoleScope = this;

    commandBucket.add([
      new CommandContainer({
        name: [
          'CLS', 'CLEAR'
        ],
        action () {
          consoleScope.clearConsole();
        }
      })
    ]);

    return {

      logger,

      inputModel: { value: '', focused: false },

      inputHistory: [],
      currentRow: 0,
      startRow: 0,
      rows: [
              `[CLI ${consoleCount}]`
      ],
      inputHistoryIndex: -1,
      lineHeight: 18,
      maxRows: 10,

      delimiterOptions: {
        value: this.delimiterPrefix, prompt: false, confirm: false
      },

      executeOptions: { show: true, logger, showCommand: true, commandBucket },

      activeSleepResolve: null,
      activeConfirmResolve: null,
      activePromptResolve: null,

      triggerRefresh: false,

      resizeTimeout: null
    };
  },

  computed: {

    styleClasses () {
      return {
        'js--prompt': this.activePromptResolve,
        'js--focsued': this.options.focused
      };
    },

    delimiter () {
      let value = this.delimiterOptions.value;
      const { confirm, prompt } = this.delimiterOptions;
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
    },

    parentLayoutSize () {
      return this.parentLayout.size;
    }
  },
  watch: {
    parentFocused (options) {
      this.inputModel.focused = options.focused;
    },
    parentLayoutSize (value) {
      global.clearTimeout(this.resizeTimeout);
      this.resizeTimeout = global.setTimeout(() => {
        this.render();
      }, 200);
    },
    activeSleepResolve () {
      this.setDelimiter({ value: '' });
    },
    activeConfirmResolve () {
      this.setDelimiter({ value: this.delimiterPrefix, confirm: this.activeConfirmResolve });
    },
    activePromptResolve () {
      this.setDelimiter({
        value: this.delimiterPrefix,
        prompt: this.activePromptResolve
      });
    }
  },

  created () {
    this.rows.unshift(...this.preRows);
  },

  destroyed () {
    consoleCount--;
  },

  async mounted () {
    if ('console' in this.$parent) {
      this.$parent.console = this;
    }
    consoleCount++;
    if (this.showIntroduction) {
      await this.createInstruction().then(() => {
        return this.enter('basic "TMP:CONSOLE_INSTRUCTIONS.basic"', {
          showCommand: false
        });
      }).catch((err) => {
        throw err;
      });
    }
    this.$nextTick(async () => {
      if (this.startCommands) {
        const commands = [].concat(this.startCommands);
        const run = (commands) => {
          return this.enter(commands.shift(), {
            showCommand: false
          }).then(() => {
            if (commands.length > 0) {
              return run(commands);
            }
            return null;
          });
        };
        await run(commands);

        this.$emit('startCommandsComplete');
      }
    });
  },
  methods: {

    async enter (value, executeOptions) {
      this.inputHistoryIndex = -1;
      this.currentRow = 0;
      this.startRow = 0;
      this.$emit('freeze');
      await this.core.executeCommand(value, Object.assign({}, this.executeOptions, executeOptions));
      this.$emit('unfreeze');

      this.render();
      this.refresh(true);
    },

    createInstruction () {
      const lines = [
        '#basic',
        'CLS',
        'PRINT "Scroll (Up/Down): <strong>Shift+Up</strong> / <strong>Shift+Down</strong>"',
        'PRINT "Enter <strong>commands</strong> to show all commands."'
      ];
      return this.core.modules.files.fs.createTmpFile('CONSOLE_INSTRUCTIONS.basic', {
        type: 'basic',
        content: lines
      });
    },

    clearConsole () {
      this.startRow = this.rows.length;
      this.render();
    },

    render () {
      this.$refs.consoleOutput.innerHTML = '';
      this.maxRows = Math.ceil(this.$el.offsetHeight / this.lineHeight) - 2;
      const rowCount = this.rows.length - 1;
      let i = 0;
      const startRow = 0 + this.currentRow;
      const endRow = rowCount;
      for (let j = endRow - this.startRow; j >= startRow; j--) {
        const row = this.rows[rowCount - j];
        const liEl = document.createElement('li');

        liEl.innerHTML = String(row).replace(/[\\]?\\n/, '<br>') + '\n';
        // liEl.innerHTML = row + '\n';
        this.$refs.consoleOutput.appendChild(liEl);
        const count = parseInt(liEl.offsetHeight / this.lineHeight);
        liEl.setAttribute('data-rows', count);
        i += count;

        if (j === startRow) {
          i = i - this.maxRows;
          while (i > 0 && this.$refs.consoleOutput.childElementCount > 1) {
            const child = this.$refs.consoleOutput.firstElementChild;
            i -= child.getAttribute('data-rows');
            this.$refs.consoleOutput.removeChild(child);
          }
          continue;
        }
      }
    },

    refresh (trigger) {
      this.$nextTick(() => {
        if (trigger) {
          this.triggerRefresh = {
            scroll: true
          };
          this.$emit('refresh', this.triggerRefresh);
          this.$nextTick(() => {
            this.triggerRefresh = null;
          });
        }
      });
    },

    moveRows (direction) {
      let change = false;
      if (direction) {
        // top
        if (this.startRow > 0) {
          this.startRow = 0;
          change = true;
        } else if (this.currentRow < this.rows.length) {
          this.currentRow++;
          change = true;
        }
      } else if (this.currentRow > 0) {
        // bottom
        this.currentRow--;
        change = true;
      }
      if (change) {
        this.render();
      }
    },

    onAdd (message, options) {
      const messages = [];
      if (Array.isArray(message)) {
        messages.push(...message);
      } else {
        messages.push(String(message));
      }
      this.rows.push(...messages);
      this.render();
    },

    setDelimiter (value, prompt = false, confirm = false) {
      Object.assign(this.delimiterOptions, {
        value,
        prompt,
        confirm
      });
    },

    // Events

    onClick () {
      this.inputModel.focused = true;
    },

    onInputEnter (value) {
      this.inputHistory.push(value);
      this.inputModel.value = '';
      return this.enter(value);
    },

    // eslint-disable-next-line complexity
    onInputKeydown (e) {
      const keyCode = e.keyCode;
      let change = false;
      if ((this.$refs.input.controlCapsLockActive || this.$refs.input.controlShiftActive) && (keyCode === 38 || keyCode === 40)) {
        e.preventDefault();
        this.moveRows(keyCode === 38);
      } else {
        switch (keyCode) {
          case 38:
            this.inputHistoryIndex++;
            this.inputHistoryIndex = Math.min(this.inputHistoryIndex, this.inputHistory.length - 1);
            change = true;
            break;
          case 40:
            this.inputHistoryIndex--;
            this.inputHistoryIndex = Math.max(this.inputHistoryIndex, -1);
            change = true;
            break;
        }
        if (change && this.inputHistory.length > 0) {
          let value;
          if (this.inputHistoryIndex < 0) {
            value = '';
          } else {
            value = this.inputHistory[this.inputHistory.length - 1 - this.inputHistoryIndex];
          }
          this.inputModel.value = value;
        }
        this.refresh();
      }
    }
  }
};

</script>

<style lang="postcss">
:root {
  --color__console__text: #fff;
  --color__console__typo__fieldsetBorder: #fa5;
  --color__console__typo__line: #fff;
  --color__console__typo__strong: #fa5;
  --color__console__typo__strongEm: #fff;
}

.wb-env-console {
  min-height: 100%;
  padding: 3px;
  line-height: normal;
  color: var(--color__console__text);

  /* min-width: 554px; */
  user-select: none;

  @nest #root > & {
    @media (min-height: 480px) {
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
      content: "- ";
    }

    &:hover {
      &::before {
        content: "+ ";
      }
    }
  }

  & .console__input,
  & .console__output {
    &,
    & * {
      font-family: var(--workbenchFont_topaz_console);
    }
  }

  & .console__output {
    word-break: break-all;
    white-space: pre-wrap;

    & > * {
      clear: fix;

      & .console__row__table__row,
      & .console__row__table__head {
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

  & .console__input {
    display: flex;

    /* padding-bottom: calc(var(--global_fontSizePx) - 3px);

    @nest .js--scroll-y & {
      padding-bottom: 0 !important;
    } */

    & .console__input__element {
      flex: 1;
    }
  }

  & .console__input__prefix {
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
    border: solid var(--color__console__typo__fieldsetBorder) 2px;

    & legend {
      padding: 0 10px;
      line-height: 1;
    }
  }

  & hr {
    display: block;
    height: 4px;
    margin: 15px -1px;
    background: var(--color__console__typo__line);
    border: solid var(--color__console__typo__line);
    border: none;
    border-width: 2px 0 0 0;
    appearance: none;
  }

  & h2 {
    font-size: 32px;
    font-weight: normal;
    line-height: 1;
  }

  & p {
    margin: 5px 0;
    overflow: hidden;
    line-height: calc(20 / var(--global_fontSizePx));
  }

  & strong,
  & b {
    font-weight: normal;
    color: var(--color__console__typo__strong);

    & em {
      color: var(--color__console__typo__strongEm);
    }
  }

  /* blinking {
        animation-name: text-blinking;
        animation-duration: 2s;
        animation-iteration-count: infinite;
      } */
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
        content: "•";
      }
    }
  }
}
</style>
