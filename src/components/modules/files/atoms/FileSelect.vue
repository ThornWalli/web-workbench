<template>
  <div class="wb-module-files-atoms-file-select">
    <div>
      <wb-item-select :title="null" :items="items" :name="name" :model="model" />
    </div>
    <div>
      <wb-button-wrapper align="outer" full direction="vertical">
        <wb-button
          class="file-select__back-button"
          style-type="secondary"
          :label="backLabel"
          :disabled="disableds.back"
          @click="onClicBack"
        />
        <wb-button
          style-type="secondary"
          :label="upLabel"
          :disabled="disableds.up"
          @click="onClickUp"
        />
        <wb-button
          v-if="downLabel"
          style-type="secondary"
          :label="downLabel"
          :disabled="disableds.down"
          @click="onClickDown"
        />
      </wb-button-wrapper>
    </div>
  </div>
</template>

<script>

import ItemContainer from '@/web-workbench/classes/FileSystem/ItemContainer';
import WbButton from '@/components/environments/atoms/Button';
import WbButtonWrapper from '@/components/environments/molecules/ButtonWrapper';
import WbItemSelect from '@/components/environments/atoms/formField/ItemSelect';

export default {
  components: { WbButton, WbButtonWrapper, WbItemSelect },

  props: {
    fileSystem: {
      type: Object,
      default () {
        return null;
      }
    },
    fsItem: {
      type: Object,
      default () {
        return null;
      }
    },
    name: {
      type: String,
      default () {
        return 'fsItem';
      }
    },
    model: {
      type: Object,
      default () {
        return {
          fsItem: null
        };
      }
    },
    backLabel: {
      type: String,
      default () {
        return '../';
      }
    },
    upLabel: {
      type: String,
      default () {
        return 'Up';
      }
    },
    downLabel: {
      type: String,
      default () {
        return 'Down';
      }
    },
    maxVisibleItems: {
      type: Number,
      default () {
        return 5;
      }
    }
  },

  data () {
    return {
      currentFsItem: this.fsItem || this.fileSystem.root,
      fsItems: [],
      currentIndex: 0
    };
  },

  computed: {

    disableds () {
      return {
        back: !this.currentFsItem.parent,
        up: this.currentIndex - 1 < 0,
        down: this.currentIndex + 1 > this.fsItems.length - this.maxVisibleItems
      };
    },

    currentPath () {
      return this.model[this.name];
    },
    items () {
      const items = this.fsItems.slice(this.currentIndex, this.currentIndex + this.maxVisibleItems).map((fsItem) => {
        return {
          label: fsItem.id,
          value: fsItem.getPath()
        };
      }).concat(Array(Math.max(this.maxVisibleItems - this.fsItems.length, 0)).fill({
        label: '&nbsp;',
        disabled: true
      }));

      if (this.fsItems.length < 1) {
        items[Math.floor(items.length / 2)] = {
          label: 'Empty',
          disabled: true
        };
      }
      return items;
    }
  },

  watch: {
    async currentPath () {
      this.currentFsItem = await this.fileSystem.get(this.model[this.name]);
      if (this.currentFsItem instanceof ItemContainer) {
        this.fsItems = Array.from((await this.currentFsItem.getItems()).values());
        this.currentIndex = 0;
      }
      this.$emit('select', this.currentFsItem);
    }
  },
  async mounted () {
    this.fsItems = Array.from((await this.currentFsItem.getItems()).values());
    this.$nextTick(() => {
      this.$emit('refresh', { reset: true, resize: false, scroll: false });
    });
  },
  methods: {
    onClicBack () {
      if (!(this.currentFsItem instanceof ItemContainer)) {
        this.model[this.name] = this.currentFsItem.parent.parent.getPath();
      } else {
        this.model[this.name] = this.currentFsItem.parent.getPath();
      }
    },
    onClickUp () {
      this.currentIndex = Math.max(this.currentIndex - 1, 0);
    },
    onClickDown () {
      this.currentIndex = Math.min(this.currentIndex + 1, this.fsItems.length - this.maxVisibleItems);
    }
  }
};
</script>

<style lang="postcss">
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
