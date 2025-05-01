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

<script setup>
import ElementText from './element/Text.vue';
const textTests = [
  { color: 'red' },
  { color: 'yellow' },
  { color: 'dark-yellow' },
  { color: 'blue' },
  { color: 'dark-blue' },
  { color: 'green' },
  { color: 'dark-green' },
  { color: 'gray' },
  { color: 'white' }
];
</script>
