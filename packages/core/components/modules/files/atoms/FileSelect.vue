<template>
  <div class="wb-module-files-atoms-file-select">
    <div>
      <wb-item-select v-bind="itemSelect" />
    </div>
    <div>
      <wb-button-wrapper align="outer" full direction="vertical">
        <wb-button
          style-type="secondary"
          :label="backLabel"
          :disabled="disableds.back"
          @click="onClicBack" />
        <wb-button
          style-type="secondary"
          :label="upLabel"
          :disabled="disableds.up"
          @click="onClickUp" />
        <wb-button
          v-if="downLabel"
          style-type="secondary"
          :label="downLabel"
          :disabled="disableds.down"
          @click="onClickDown" />
      </wb-button-wrapper>
    </div>
  </div>
</template>

<script setup>
import { computed, markRaw, nextTick, onMounted, ref, watch } from 'vue';

import WbButton from '../../../atoms/Button';
import WbButtonWrapper from '../../../molecules/ButtonWrapper';
import WbItemSelect from '../../../atoms/formField/ItemSelect';

import ItemContainer from '../../../../classes/FileSystem/ItemContainer';

const $props = defineProps({
  fileSystem: {
    type: Object,
    default() {
      return null;
    }
  },
  fsItem: {
    type: Object,
    default() {
      return null;
    }
  },
  name: {
    type: String,
    default() {
      return 'fsItem';
    }
  },
  model: {
    type: Object,
    default() {
      return {
        fsItem: null
      };
    }
  },
  backLabel: {
    type: String,
    default() {
      return '../';
    }
  },
  upLabel: {
    type: String,
    default() {
      return 'Up';
    }
  },
  downLabel: {
    type: String,
    default() {
      return 'Down';
    }
  },
  maxVisibleItems: {
    type: Number,
    default() {
      return 5;
    }
  }
});

const itemSelect = computed(() => {
  return {
    name: $props.name,
    title: null,
    items: items.value,
    modelValue: $props.model[$props.name],
    'onUpdate:model-value': value => {
      $props.model[$props.name] = value;
    }
  };
});

const $emit = defineEmits(['select', 'refresh']);

const currentFsItem = ref($props.fsItem || markRaw($props.fileSystem.root));
const fsItems = ref([]);
const currentIndex = ref(0);

const disableds = computed(() => {
  return {
    back: !currentFsItem.value.parent,
    up: currentIndex.value - 1 < 0,
    down: currentIndex.value + 1 > fsItems.value.length - $props.maxVisibleItems
  };
});

const currentPath = computed(() => {
  return $props.model[$props.name];
});

const items = computed(() => {
  const items = fsItems.value
    .slice(currentIndex.value, currentIndex.value + $props.maxVisibleItems)
    .map(fsItem => {
      return {
        label: fsItem.id,
        value: fsItem.getPath()
      };
    })
    .concat(
      Array(Math.max($props.maxVisibleItems - fsItems.value.length, 0)).fill({
        label: '&nbsp;',
        disabled: true
      })
    );

  if (fsItems.value.length < 1) {
    items[Math.floor(items.length / 2)] = {
      label: 'Empty',
      disabled: true
    };
  }
  return items;
});

watch(
  () => currentPath.value,
  async () => {
    currentFsItem.value = markRaw(
      await $props.fileSystem.get($props.model[$props.name])
    );
    if (currentFsItem.value instanceof ItemContainer) {
      fsItems.value = Array.from(
        (await currentFsItem.value.getItems()).values()
      ).map(markRaw);
      currentIndex.value = 0;
    }
    $emit('select', currentFsItem.value);
  }
);

onMounted(async () => {
  fsItems.value = Array.from(
    (await currentFsItem.value.getItems()).values()
  ).map(markRaw);
  nextTick(() => {
    $emit('refresh', { reset: true, resize: false, scroll: false });
  });
});

const onClicBack = () => {
  if (!(currentFsItem.value instanceof ItemContainer)) {
    $props.model[$props.name] = currentFsItem.value.parent.parent.getPath();
  } else {
    $props.model[$props.name] = currentFsItem.value.parent.getPath();
  }
};

const onClickUp = () => {
  currentIndex.value = Math.max(currentIndex.value - 1, 0);
};

const onClickDown = () => {
  currentIndex.value = Math.min(
    currentIndex.value + 1,
    fsItems.value.length - $props.maxVisibleItems
  );
};
// export default {

//   emits: ['select', 'refresh'],

//   data() {
//     return {
//       currentFsItem: this.fsItem || markRaw(this.fileSystem.root),
//       fsItems: [],
//       currentIndex: 0
//     };
//   },

//   computed: {
//     disableds() {
//       return {
//         back: !this.currentFsItem.parent,
//         up: this.currentIndex - 1 < 0,
//         down: this.currentIndex + 1 > this.fsItems.length - this.maxVisibleItems
//       };
//     },

//     currentPath() {
//       return this.model[this.name];
//     },

//     items() {
//       const items = this.fsItems
//         .slice(this.currentIndex, this.currentIndex + this.maxVisibleItems)
//         .map(fsItem => {
//           return {
//             label: fsItem.id,
//             value: fsItem.getPath()
//           };
//         })
//         .concat(
//           Array(Math.max(this.maxVisibleItems - this.fsItems.length, 0)).fill({
//             label: '&nbsp;',
//             disabled: true
//           })
//         );

//       if (this.fsItems.length < 1) {
//         items[Math.floor(items.length / 2)] = {
//           label: 'Empty',
//           disabled: true
//         };
//       }
//       return items;
//     }
//   },
//   watch: {
//     async currentPath() {
//       this.currentFsItem = markRaw(
//         await this.fileSystem.get(this.model[this.name])
//       );
//       if (this.currentFsItem instanceof ItemContainer) {
//         this.fsItems = Array.from(
//           (await this.currentFsItem.getItems()).values()
//         ).map(markRaw);
//         this.currentIndex = 0;
//       }
//       this.$emit('select', this.currentFsItem);
//     }
//   },
//   async mounted() {
//     this.fsItems = Array.from(
//       (await this.currentFsItem.getItems()).values()
//     ).map(markRaw);
//     this.$nextTick(() => {
//       this.$emit('refresh', { reset: true, resize: false, scroll: false });
//     });
//   },
//   methods: {
//     onClicBack() {
//       if (!(this.currentFsItem instanceof ItemContainer)) {
//         this.model[this.name] = this.currentFsItem.parent.parent.getPath();
//       } else {
//         this.model[this.name] = this.currentFsItem.parent.getPath();
//       }
//     },
//     onClickUp() {
//       this.currentIndex = Math.max(this.currentIndex - 1, 0);
//     },
//     onClickDown() {
//       this.currentIndex = Math.min(
//         this.currentIndex + 1,
//         this.fsItems.length - this.maxVisibleItems
//       );
//     }
//   }
// };
</script>

<style lang="postcss" scoped>
.wb-module-files-atoms-file-select {
  /* empty */
  display: flex;

  & > div {
    flex: 1;

    & > div {
      height: 100%;
    }

    padding: 0 var(--default-element-margin);

    &:last-child {
      flex: 0;
      padding-left: 0;
    }
  }
}
</style>
