<template>
  <div>
    <div class="mc-recruitment-icon">
      <img :src="src" />
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import graphics from '../../utils/graphics';
import { RECRUITMENT_TYPE } from '../../utils/keys';

const $props = defineProps({
  type: {
    type: String,
    validator: value => Object.values(RECRUITMENT_TYPE).includes(value),
    default: 'security_service'
  }
});

const src = computed(() => {
  switch ($props.type) {
    case RECRUITMENT_TYPE.SECURITY_SERVICE:
      return graphics.attack.recruitment[RECRUITMENT_TYPE.SECURITY_SERVICE];
    case RECRUITMENT_TYPE.SOLDIER:
      return graphics.attack.recruitment[RECRUITMENT_TYPE.SOLDIER];
    case RECRUITMENT_TYPE.MERCENARY:
      return graphics.attack.recruitment[RECRUITMENT_TYPE.MERCENARY];
  }
  return null;
});
</script>

<style lang="postcss" scoped>
.mc-recruitment-icon {
  position: relative;
  width: 64px;
  height: 64px;

  &::before {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    content: '';
    background: url('../../assets/graphics/attack/recruitment/frame.png');
    background-size: contain;
  }

  & img {
    position: relative;
    top: 4px;
    left: 4px;
    display: block;
    width: 54px;
    height: 54px;
  }
}
</style>
