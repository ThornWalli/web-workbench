<template>
  <div>
    <div class="mc-recruitment-item">
      <div>
        <base-button>
          <mc-label
            color="yellow"
            text-glossy
            :content="t('view.attack.label.recruitment_costs') + ' :'"
            merge />
          <mc-label color="gray" content="0000" text-background selectable />
        </base-button>
        <div>
          <mc-label
            color="yellow"
            text-glossy
            :content="t('view.attack.label.people_total') + '    :'"
            merge />
          <mc-label color="gray" content="00000" text-background />
        </div>
        <base-button>
          <mc-label
            color="blue"
            text-glossy
            :content="t('view.attack.label.training') + ' :'"
            merge />
          <mc-label color="gray" content="0000" text-background selectable />
        </base-button>
        <div>
          <mc-label
            color="blue"
            text-glossy
            :content="t('view.attack.label.strength') + '    :'"
            merge />
          <mc-label>
            <mc-label-progress-bar :value="0.5" type="inset" />
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
import McLabelProgressBar from '../Label/ProgressBar.vue';

import BaseButton from '../base/Button.vue';
const { t } = useI18n();

defineProps({
  type: {
    type: String,
    validator: value => Object.values(RECRUITMENT_TYPE).includes(value),
    default: 'security_service'
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
