<template>
  <div class="wb-disks-workbench13-calculator">
    <span class="result" data-hook="calculatorResult">{{ resultValue }}</span>
    <div class="buttons">
      <span v-for="(button, index) in buttons" :key="index"
        ><input type="button" :value="button" @click="onClickButton"
      /></span>
    </div>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue';
import contextMenu from '../contextMenu';
import useWindow from '@web-workbench/core/composables/useWindow';

const { core, setContextMenu } = useWindow();
setContextMenu(contextMenu);

const tmpValueA = ref(null);
const tmpValueB = ref(null);
const tmpOperator = ref(null);

const buttons = ref([
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
]);

const resultValue = computed(() =>
  [tmpValueA.value, tmpOperator.value, tmpValueB.value]
    .filter(value => value !== null)
    .join(' ')
);

// eslint-disable-next-line complexity
async function onClickButton(e) {
  const value = e.target.value;
  if (/^[0-9,.]+$/.test(value) && tmpOperator.value === null) {
    tmpValueA.value = (tmpValueA.value || '') + value;
  } else if (
    /^[0-9,.]+$/.test(value) &&
    tmpOperator.value &&
    tmpValueA.value !== null
  ) {
    tmpValueB.value = (tmpValueB.value || '') + value;
  }

  if (
    /^[\\/*-+=]$/.test(value) &&
    tmpValueA.value !== null &&
    tmpValueB.value !== null &&
    tmpOperator.value
  ) {
    const result = await core.value.modules.parser.parseMath(
      `${tmpValueA.value}${tmpOperator.value}${tmpValueB.value}`
    );
    tmpValueA.value = result;
    tmpOperator.value = null;
    tmpValueB.value = null;
  }

  if (
    /^[\\/*-+]$/.test(value) &&
    tmpValueA.value !== null &&
    tmpValueB.value === null
  ) {
    tmpOperator.value = value;
  }
  if (/^<-$/.test(value) && tmpValueA.value !== null) {
    if (tmpValueA.value !== null && tmpValueB.value === null) {
      tmpOperator.value = null;
      tmpValueA.value = String(tmpValueA.value).slice(
        0,
        tmpValueA.value.length - 1
      );
    } else if (tmpValueA.value !== null && tmpOperator.value) {
      tmpValueB.value = String(tmpValueB.value).slice(
        0,
        tmpValueB.value.length - 1
      );
    }
  }
  if (/^\+-$/.test(value)) {
    if (tmpValueA.value !== null && tmpValueB.value === null) {
      tmpValueA.value = parseFloat(tmpValueA.value) * -1;
    } else if (tmpValueA.value !== null && tmpOperator.value) {
      tmpValueB.value = parseFloat(tmpValueB.value) * -1;
    }
  }
  if (/^CA$/.test(value)) {
    tmpOperator.value = tmpValueA.value = tmpValueB.value = null;
  }

  if (/^CE$/.test(value)) {
    if (tmpValueB.value !== null) {
      tmpValueB.value = null;
    } else if (tmpOperator.value) {
      tmpOperator.value = null;
    } else if (tmpValueA.value !== null) {
      tmpValueA.value = null;
    }
  }
}
</script>

<style lang="postcss" scoped>
.wb-disks-workbench13-calculator {
  --color-background: var(--color-workbench13-calculator-background, #000);
  --color-button-text: var(--color-workbench13-calculator-button-text, #fff);
  --color-button-border: var(
    --color-workbench13-calculator-button-border,
    #fff
  );
  --color-result-border: var(
    --color-workbench13-calculator-result-border,
    #fff
  );

  padding: var(--default-element-margin);
  background: var(--color-background);

  & .result {
    display: block;
    width: auto;
    padding: 2px 4px;
    padding-bottom: 0;
    margin-right: 2px;
    margin-bottom: 9px;
    margin-left: 2px;
    text-align: right;
    border: solid var(--color-result-border);
    border-width: 2px 1px;

    &:empty {
      &::before {
        display: inline-block;
        content: '\00a0';
      }
    }
  }

  & .buttons {
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
        color: var(--color-button-text);
        text-align: center;
        appearance: none;
        background: transparent;
        border: solid var(--color-button-border) 1px;
        border-top-width: 2px;
        border-radius: 0;
        outline: none;
      }
    }
  }
}
</style>
