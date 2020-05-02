<template>
  <div class="wb-disks-mooncity-molecules-header">
    <atom-header-field v-for="(field, index) in fields " :key="index" v-bind="field" />
    <!-- <span class="assetboard transparent name" data-assetboard="game/label">
        <span class="color-blue">{{ fields.label }}:</span><span class="color-gray value" />
      </span>

      <span class="assetboard transparent credits" data-assetboard="game/label">
        <span class="color-yellow">{{ fields.label }}:</span><span class="color-gray value">00000000</span>
      </span>

      <span class="assetboard transparent date" data-assetboard="game/label">
        <span class="color-blue">{{ fields.label }}:</span><span class="color-gray value">01-01-2038</span>
      </span>

      <span class="assetboard transparent round" data-assetboard="game/label">
        <span class="color-yellow">{{ fields.label }}:</span><span class="color-gray value">001</span>
      </span> -->

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
          type: 'name',
          label: 'Name'
        },
        {
          type: 'credits',
          label: 'Credits',
          value: '00000000'
        },
        {
          type: 'date',
          label: 'Datum',
          value: '01-01-2038'
        },
        {
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

  & > * {
    position: absolute;
    top: 6px;
    clear: fix;
    white-space: nowrap;

    &.name {
      left: 16px;
      width: 124px;
    }

    > span,
    > button {
      float: left;
    }

    &.credits {
      left: 150px;
      width: 134px;
    }

    &.date {
      left: 296px;
      width: 134px;
    }

    &.round {
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
