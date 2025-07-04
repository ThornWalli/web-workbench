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
            :content="
              fillTextStart(
                String(recruitmentCosts || defaultRecruitmentCosts),
                5,
                '0'
              )
            "
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
            :content="fillTextStart(String(value || defaultValue), 5, '0')"
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
            :content="
              fillTextStart(
                String(trainingCosts || defaultTrainingCosts),
                5,
                '0'
              )
            "
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
            <mc-label-progress-bar
              :value="level || defaultLevel"
              type="inset" />
          </mc-label>
        </div>
      </div>
      <mc-recruitment-icon :type="type" />
    </div>
  </div>
</template>

<script lang="ts" setup>
import useI18n from '../../composables/useI18n';
import type { RECRUITMENT_TYPE } from '../../types';
import McLabel from '../Label.vue';
import McRecruitmentIcon from './RecruitmentIcon.vue';
import McLabelProgressBar from '../label/ProgressBar.vue';

import BaseButton from '../base/Button.vue';
import { fillTextStart } from '../../utils/string';

const { t } = useI18n();

defineEmits<{
  (e: 'recruit' | 'training'): void;
}>();

const defaultRecruitmentCosts = 0;
const defaultTrainingCosts = 0;
const defaultValue = 0;
const defaultLevel = 0;

defineProps<{
  type?: RECRUITMENT_TYPE;
  recruiting?: boolean;
  recruitmentCosts?: number;
  training?: boolean;
  trainingCosts?: number;
  value?: number;
  level?: number;
}>();

// #
// }>({
//   type: {
//     type: String,
//     validator: (value: RECRUITMENT_TYPE) =>
//       Object.values(RECRUITMENT_TYPE).includes(value),
//     default: RECRUITMENT_TYPE.SECURITY_SERVICE
//   },

//   recruiting: {
//     type: Boolean,
//     default: false
//   },
//   recruitmentCosts: {
//     type: Number,
//     default: 0
//   },
//   training: {
//     type: Boolean,
//     default: false
//   },
//   trainingCosts: {
//     type: Number,
//     default: 0
//   },
//   value: {
//     type: Number,
//     default: 0
//   },
//   level: {
//     type: Number,
//     default: 0
//   }
// });
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
