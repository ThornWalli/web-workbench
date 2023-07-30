<template>
  <div class="wb-disks-workbench13-calculator">
    <span class="calculator__result" data-hook="calculatorResult">{{ resultValue }}</span>
    <div class="calculator__buttons">
      <span v-for="(button, index) in buttons" :key="index"><input type="button" :value="button" @click="onClickButton"></span>
    </div>
  </div>
</template>

<script>

import ContextMenuItems from '../../../web-workbench/classes/ContextMenuItems';
import MixinWindowComponent from '@/components/mixins/WindowComponent';
import contextMenu from '@/web-workbench/disks/workbench13/calculator/contextMenu';

export default {
  mixins: [
    MixinWindowComponent
  ],
  data () {
    return {

      tmpValueA: null,
      tmpValueB: null,
      tmpOperator: null,

      result: null,
      value: null,

      buttons: [
        '7',
        '8',
        '9',
        'CA',
        'CE',
        '4',
        '5',
        '6',
        '*',
        '/',
        '1',
        '2',
        '3',
        '+',
        '-',
        '0',
        '.',
        '<-',
        '+-',
        '='
      ]
    };
  },
  computed: {
    contextMenu () {
      return new ContextMenuItems(contextMenu, { core: this.core, model: this });
    },
    resultValue () {
      return [
        this.tmpValueA, this.tmpOperator, this.tmpValueB
      ].filter(value => value !== null).join(' ');
    }
  },
  methods: {
    // eslint-disable-next-line complexity
    async onClickButton (e) {
      const value = e.target.value;
      if (/^[0-9,.]+$/.test(value) && this.tmpOperator === null) {
        this.tmpValueA = (this.tmpValueA || '') + value;
      } else if (/^[0-9,.]+$/.test(value) && this.tmpOperator && this.tmpValueA !== null) {
        this.tmpValueB = (this.tmpValueB || '') + value;
      }

      if (/^[\\/*-+=]$/.test(value) && this.tmpValueA !== null && this.tmpValueB !== null && this.tmpOperator) {
        const result = await this.core.modules.parser.parseMath(`${this.tmpValueA}${this.tmpOperator}${this.tmpValueB}`);
        this.tmpValueA = result;
        this.tmpOperator = null;
        this.tmpValueB = null;
      }

      if (/^[\\/*-+]$/.test(value) && this.tmpValueA !== null && this.tmpValueB === null) {
        this.tmpOperator = value;
      }
      if (/^<-$/.test(value) && this.tmpValueA !== null) {
        if (this.tmpValueA !== null && this.tmpValueB === null) {
          this.tmpOperator = null;
          this.tmpValueA = String(this.tmpValueA).slice(0, this.tmpValueA.length - 1);
        } else if (this.tmpValueA !== null && this.tmpOperator) {
          this.tmpValueB = String(this.tmpValueB).slice(0, this.tmpValueB.length - 1);
        }
      }
      if (/^\+-$/.test(value)) {
        if (this.tmpValueA !== null && this.tmpValueB === null) {
          this.tmpValueA = parseFloat(this.tmpValueA) * -1;
        } else if (this.tmpValueA !== null && this.tmpOperator) {
          this.tmpValueB = parseFloat(this.tmpValueB) * -1;
        }
      }
      if (/^CA$/.test(value)) {
        this.tmpOperator = this.tmpValueA = this.tmpValueB = null;
      }

      if (/^CE$/.test(value)) {
        if (this.tmpValueB !== null) {
          this.tmpValueB = null;
        } else if (this.tmpOperator) {
          this.tmpOperator = null;
        } else if (this.tmpValueA !== null) {
          this.tmpValueA = null;
        }
      }
    }
  }
};
</script>

<style lang="postcss" scoped>
:root {
  --color__workbench13__calculator__background: #000;
  --color__workbench13__calculator__button__text: #fff;
  --color__workbench13__calculator__button__border: #fff;
  --color__workbench13__calculator__result__border: #fff;
}

.wb-disks-workbench13-calculator {
  padding: var(--default-element-margin);

  /* padding-top: 5px; */

  /* margin: -3px -2px; */
  background: var(--color__workbench13__calculator__background);

  & .calculator__result {
    display: block;
    width: auto;
    padding: 2px 4px;
    padding-bottom: 0;
    margin-right: 2px;
    margin-bottom: 9px;
    margin-left: 2px;
    text-align: right;
    border: solid var(--color__workbench13__calculator__result__border);
    border-width: 2px 1px;

    &:empty {
      &::before {
        display: inline-block;
        content: "\00a0";
      }
    }
  }

  & .calculator__buttons {
    width: 180px;
    clear: fix;

    & > span {
      display: block;
      float: left;
      width: calc(100% / 5);
      padding: 6px 5px;

      & input {
        display: block;
        width: 26px;
        padding: 0;
        padding-top: 2px;
        padding-left: 1px;
        line-height: 1;
        color: var(--color__workbench13__calculator__button__text);
        text-align: center;
        appearance: none;
        background: transparent;
        border: solid var(--color__workbench13__calculator__button__border) 1px;
        border-top-width: 2px;
        border-radius: 0;
        outline: none;
      }
    }
  }
}
</style>
