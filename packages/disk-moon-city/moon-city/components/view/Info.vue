<template>
  <div class="mc-view-info">
    <teleport to="#layout_content_1">
      <mc-frame-info-primary />
    </teleport>
    <teleport to="#layout_content_2">
      <mc-frame-info-secondary>
        <mc-info-navigation v-model="currentAction" :actions="actions" />
      </mc-frame-info-secondary>
    </teleport>
    <teleport to="#layout_screen">
      <mc-info-screen v-model="currentAction" />
    </teleport>
  </div>
</template>

<script lang="ts" setup>
import McFrameInfoPrimary from '../frame/InfoPrimary.vue';
import McFrameInfoSecondary from '../frame/InfoSecondary.vue';

import McInfoScreen from '../info/Screen.vue';
import McInfoNavigation from '../info/Navigation.vue';
import { inject, ref } from 'vue';
import { INFO_NAVIGATION_TYPES } from '../../types';

const close = inject<() => void>('close', () => {
  return;
});

const currentAction = ref<INFO_NAVIGATION_TYPES>(INFO_NAVIGATION_TYPES.START);
const actions = [
  [
    {
      label: 'Beenden',
      click: () => {
        close();
      }
    }
    // {
    //   label: 'Der Start…',
    //   value: INFO_NAVIGATION_TYPES.START
    // },
    // {
    //   label: 'Sicherheitsdienst',
    //   shortLabel: 'S.Dienst',
    //   value: INFO_NAVIGATION_TYPES.SECURITY_SERVICE
    // },
    // {
    //   label: 'Soldaten',
    //   value: INFO_NAVIGATION_TYPES.SOLDIER
    // },
    // {
    //   label: 'Söldner',
    //   value: INFO_NAVIGATION_TYPES.MERCENARY
    // }
  ]
];
</script>
