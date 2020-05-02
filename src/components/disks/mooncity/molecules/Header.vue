<template>
  <div class="wb-disks-mooncity-molecules-header">
    <atom-header-field v-for="(field, index) in fields " :key="index" :class="`header__field header__field--${field.type}`" v-bind="field" />

    <!-- {{partial "game/components/audio-control" audio-control}}} -->
  </div>
</template>

<script>

import AtomHeaderField from '../atoms/header/Field';
export default {
  components: { AtomHeaderField },
  data () {
    return {
      fields: [
        {
          labelColor: 'blue',
          type: 'name',
          label: 'Name'
        },
        {
          labelColor: 'yellow',
          type: 'credits',
          label: 'Credits',
          value: '00000000'
        },
        {
          labelColor: 'blue',
          type: 'date',
          label: 'Datum',
          value: '01-01-2038'
        },
        {
          labelColor: 'yellow',
          type: 'round',
          label: 'Zug',
          value: '001'
        }
      ]
    };
  }
};
</script>

<style lang="postcss">
.wb-disks-mooncity-molecules-header {
  position: relative;
  height: 26px;

  & > .header__field {
    position: absolute;
    top: 6px;
    clear: fix;
    white-space: nowrap;

    &.header__field--name {
      left: 16px;
      width: 124px;
    }

    > span,
    > button {
      float: left;
    }

    &.header__field--credits {
      left: 150px;
      width: 134px;
    }

    &.header__field--date {
      left: 296px;
      width: 134px;
    }

    &.header__field--round {
      left: 439px;
      width: 61px;
    }
  }

  .component[data-component="game/audio-control"] {
    position: absolute;
    top: 6px;
    left: 508px;
  }
}
</style>
