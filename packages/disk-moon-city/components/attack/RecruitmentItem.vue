<template>
  <div>
    <div class="mc-recruitment-item">
      <div>
        <base-button @click="$emit('recruit')">
          <mc-label
            color="yellow"
            text-glossy
            :content="t('view.attack.label.recruitment_costs') + ' :'"
            merge />
          <mc-label
            :model-value="recruiting"
            color="gray"
            :content="fillTextStart(recruitmentCosts, 5, '0')"
            text-background
            selectable />
        </base-button>
        <div>
          <mc-label
            color="yellow"
            text-glossy
            :content="t('view.attack.label.people_total') + '    :'"
            merge />
          <mc-label
            color="gray"
            :content="fillTextStart(value, 5, '0')"
            text-background />
        </div>
        <base-button @click="$emit('training')">
          <mc-label
            color="blue"
            text-glossy
            :content="t('view.attack.label.training') + ' :'"
            merge />
          <mc-label
            :model-value="training"
            color="gray"
            :content="fillTextStart(trainingCosts, 5, '0')"
            text-background
            selectable />
        </base-button>
        <div>
          <mc-label
            color="blue"
            text-glossy
            :content="t('view.attack.label.strength') + '    :'"
            merge />
          <mc-label>
            <mc-label-progress-bar :value="level" type="inset" />
          </mc-label>
        </div>
      </div>
      <mc-recruitment-icon :type="type" />
    </div>
  </div>
</template>

<script setup>
import useI18n from '../../composables/useI18n';
import { RECRUITMENT_TYPE } from '../../utils/keys';
import McLabel from '../Label.vue';
import McRecruitmentIcon from './RecruitmentIcon.vue';
import McLabelProgressBar from '../label/ProgressBar.vue';

import BaseButton from '../base/Button.vue';
import { fillTextStart } from '../../utils/string';

const { t } = useI18n();

defineEmits(['recruit', 'training']);

defineProps({
  type: {
    type: String,
    validator: value => Object.values(RECRUITMENT_TYPE).includes(value),
    default: 'security_service'
  },

  recruiting: {
    type: Boolean,
    default: false
  },
  recruitmentCosts: {
    type: Number,
    default: 0
  },
  training: {
    type: Boolean,
    default: false
  },
  trainingCosts: {
    type: Number,
    default: 0
  },
  value: {
    type: Number,
    default: 0
  },
  level: {
    type: Number,
    default: 0
  }
});
</script>

<style lang="postcss" scoped>
.mc-recruitment-item {
  display: flex;
  gap: 6px;
  align-items: center;

  & > div {
    display: flex;
    flex: 1;
    flex-direction: column;

    & > div,
    & > button {
      display: flex;
      flex: 1;
      width: 202px;
    }

    & .mc-label {
      &:first-child {
        flex: 1;
      }
    }
  }
}
</style>
