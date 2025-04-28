<template>
  <wb-form class="wb-disks-extras13-web-painting-color-select">
    <span
      ref="colorPaletteSecondary"
      :style="stylePrimaryColor"
      class="color-select secondary"
      @contextmenu="onContextMenuSecondary">
      <span
        ref="colorPalettePrimary"
        :style="styleSecondaryColor"
        class="color-select primary" />
    </span>
    <ul data-hook="colorPaletteItems">
      <li v-for="(item, colorIndex) in colors" :key="colorIndex">
        <label>
          <input
            v-model="index"
            type="radio"
            name="index"
            :value="colorIndex" />
          <span :style="{ 'background-color': item.toRGB() }" />
        </label>
      </li>
    </ul>
  </wb-form>
</template>

<script lang="ts" setup>
import { Subscription } from 'rxjs';

import {
  toRaw,
  markRaw,
  onUnmounted,
  onMounted,
  watch,
  computed,
  ref
} from 'vue';
import WbForm from '@web-workbench/core/components/molecules/Form.vue';
import domEvents from '@web-workbench/core/services/domEvents';

import Color from '../../lib/Color';
import type { ColorSelect } from '../../lib/types';

const $props = defineProps<{
  modelValue: ColorSelect;
}>();

const $emit = defineEmits<{
  (e: 'update:model-value', modelValue: ColorSelect): void;
}>();

const index = ref(0);
const subscription = new Subscription();

const colors = ref([
  markRaw(new Color(0, 0, 0)),
  markRaw(new Color(255, 255, 255))
]);
const primarySelect = ref(true);

const paletteSteps = computed(() => {
  return $props.modelValue.paletteSteps;
});
const stylePrimaryColor = computed(() => {
  return {
    'background-color': `${toRaw($props.modelValue.primaryColor).toRGB()}`
  };
});
const styleSecondaryColor = computed(() => {
  return {
    'background-color': `${toRaw($props.modelValue.secondaryColor).toRGB()}`
  };
});

watch(
  () => paletteSteps.value,
  () => {
    refreshColors();
  }
);
watch(
  () => index.value,
  (index: number) => {
    const color = colors.value[Number(index)];
    if (primarySelect.value) {
      setValue('primaryColor', color);
    } else {
      setValue('secondaryColor', color);
    }
  }
);

onMounted(() => {
  refreshColors();
  subscription.add(
    domEvents.keyPress.subscribe(e => {
      switch (e.keyCode) {
        case 120:
        case 88:
          toggleColors();
          break;
      }
    })
  );
});

onUnmounted(() => {
  subscription.unsubscribe();
});

function setValue(name: string, value: Color) {
  $emit('update:model-value', {
    ...$props.modelValue,
    [name]: value
  });
}
function toggleColors() {
  const tmp = $props.modelValue.primaryColor;
  setValue('primaryColor', $props.modelValue.secondaryColor);
  setValue('secondaryColor', tmp);
}
function refreshColors() {
  const pSteps = paletteSteps.value;
  const colorsList = [];
  for (let r = pSteps.r; r >= 0; r--) {
    for (let g = pSteps.g; g >= 0; g--) {
      for (let b = pSteps.b; b >= 0; b--) {
        colorsList.push(
          markRaw(
            new Color(
              Math.floor((255 / pSteps.r) * r),
              Math.floor((255 / pSteps.g) * g),
              Math.floor((255 / pSteps.b) * b)
            )
          )
        );
      }
    }
  }
  colors.value = colorsList;
}

function onContextMenuSecondary(e: Event) {
  e.preventDefault();
  toggleColors();
}

//  data() {
//     return {
//       index: 0,
//       subscription: new Subscription(),
//       colors: [markRaw(new Color(0, 0, 0)), markRaw(new Color(255, 255, 255))],
//       primarySelect: true
//     };
//   },

//   computed: {
//     paletteSteps() {
//       return this.modelValue.paletteSteps;
//     },
//     stylePrimaryColor() {
//       return {
//         'background-color': `${toRaw(this.modelValue.primaryColor).toRGB()}`
//       };
//     },
//     styleSecondaryColor() {
//       return {
//         'background-color': `${toRaw(this.modelValue.secondaryColor).toRGB()}`
//       };
//     }
//   },

//   watch: {
//     paletteSteps() {
//       this.refreshColors();
//     },

//     index(index) {
//       const color = this.colors[Number(index)];
//       if (this.primarySelect) {
//         this.setValue('primaryColor', color);
//       } else {
//         this.setValue('secondaryColor', color);
//       }
//     }
//   },

//   unmounted() {
//     this.subscription.unsubscribe();
//   },

//   mounted() {
//     this.refreshColors();
//     this.subscription.add(
//       domEvents.keyPress.subscribe(e => {
//         switch (e.keyCode) {
//           case 120:
//           case 88:
//             this.toggleColors();
//             break;
//         }
//       })
//     );
//   },

//   methods: {
//     setValue(name, value) {
//       this.$emit('update:model-value', {
//         ...this.modelValue,
//         [name]: value
//       });
//     },

//     toggleColors() {
//       const tmp = this.modelValue.primaryColor;
//       this.setValue('primaryColor', this.modelValue.secondaryColor);
//       this.setValue('secondaryColor', tmp);
//     },

//     refreshColors() {
//       const paletteSteps = this.paletteSteps;
//       const colors = [];
//       for (let r = paletteSteps.r; r >= 0; r--) {
//         for (let g = paletteSteps.g; g >= 0; g--) {
//           for (let b = paletteSteps.b; b >= 0; b--) {
//             colors.push(
//               markRaw(
//                 new Color(
//                   Math.floor((255 / paletteSteps.r) * r),
//                   Math.floor((255 / paletteSteps.g) * g),
//                   Math.floor((255 / paletteSteps.b) * b)
//                 )
//               )
//             );
//           }
//         }
//       }
//       this.colors = colors;
//     },

//     onContextMenuSecondary(e) {
//       e.preventDefault();
//       this.toggleColors();
//     }
//   }
// }; -->
</script>

<style lang="postcss" scoped>
.wb-disks-extras13-web-painting-color-select {
  --color-web-painting-color-select-background: #000;
  --color-web-painting-color-select-border: #fff;

  position: relative;
  background: var(--color-web-painting-color-select-background);
  border-left: solid var(--color-web-painting-color-select-border) 2px;

  & input {
    display: none;
  }

  & ul {
    clear: fix;

    & li {
      float: left;

      & span {
        position: relative;

        /* z-index: 1; */
        display: block;
        width: 12px;
        height: 12px;
      }

      & input:checked + svg,
      &:hover input:not([disabled]) + span {
        /* z-index: 2; */

        &::after {
          position: absolute;
          top: 0;
          left: 0;
          box-sizing: border-box;
          width: 100%;
          height: 100%;
          content: '';
          border: solid var(--color-web-painting-color-select-border) 2px;
          mix-blend-mode: difference;
        }
      }
    }
  }

  & .color-select {
    &.primary {
      position: relative;
      top: 50%;
      left: 50%;
      display: block;
      width: 50%;
      height: 50%;
      background: transparent;
      transform: translate(-50%, -50%);
    }

    &.secondary {
      display: block;
      height: 22px;
      background: transparent;
    }
  }
}
</style>
