<template>
  <div>
    <element-text v-for="(item, index) in textTests" :key="index" v-bind="item">
      Thorn
    </element-text>
    <br />
    <element-text
      v-for="(item, index) in textTests"
      :key="index"
      v-bind="item"
      border>
      Thorn
    </element-text>
    <br />
    <element-text
      v-for="(item, index) in textTests"
      :key="index"
      v-bind="item"
      underline>
      Thorn
    </element-text>
    <br />
    <element-text
      v-for="(item, index) in textTests"
      :key="index"
      v-bind="item"
      border
      underline>
      Thorn
    </element-text>
  </div>
</template>

<script lang="ts" setup>
import { COLOR } from '../../utils/color';
import ElementText from '../Text.vue';
const textTests = [
  { color: COLOR.RED },
  { color: COLOR.YELLOW },
  { color: COLOR.DARK_YELLOW },
  { color: COLOR.BLUE },
  { color: COLOR.DARK_BLUE },
  { color: COLOR.GREEN },
  { color: COLOR.DARK_GREEN },
  { color: COLOR.GRAY },
  { color: COLOR.WHITE }
];
</script>
