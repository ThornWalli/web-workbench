<template>
  <mc-view class="wb-disks-mooncity-view-overview">
    <template v-slot:view-2-1>
      <mc-atom-player-creation />
    </template>
  </mc-view>
</template>

<script>

import McView from '../View';
import McAtomPlayerCreation from '../atoms/PlayerCreation';

export default {
  components: { McView, McAtomPlayerCreation }

};
</script>

<style>

</style>
