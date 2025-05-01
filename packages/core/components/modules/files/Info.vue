<template>
  <div class="wb-module-files-info">
    <table>
      <tr v-for="({ title, value }, index) in items" :key="index">
        <td>{{ title }}:</td>
        <td v-html="value" />
      </tr>
    </table>

    <fieldset>
      <legend>Meta:</legend>
      <table>
        <tr v-for="({ title, value }, index) in meta" :key="index">
          <td>{{ title }}:</td>
          <td v-html="value" />
        </tr>
      </table>
    </fieldset>
  </div>
</template>

<script lang="ts" setup>
import { computed } from 'vue';
import { stripByteString, formatDate } from '../../../utils/string';
import useWindow from '../../../composables/useWindow';
import type Item from '../../../classes/FileSystem/Item';

const $props = defineProps<{
  fsItem?: Item;
}>();

useWindow();

const meta = computed(() => {
  if ($props.fsItem) {
    return Array.from($props.fsItem.meta).map(([name, value]) => {
      if (typeof value === 'object') {
        try {
          value = JSON.stringify(value);
        } catch (error) {
          console.error(error);
        }
      }
      return { title: name, value };
    });
  }
  return [];
});
const items = computed(() => {
  const fsItem = $props.fsItem;
  if (!fsItem) {
    return [];
  }
  return [
    { title: 'Id', value: fsItem.id },
    { title: 'Name', value: fsItem.name },
    { title: 'Type', value: fsItem.type },
    { title: 'Path', value: fsItem.getPath() },
    { title: 'Size', value: stripByteString(fsItem.size) },
    { title: 'Locked', value: fsItem.locked ? 'Yes' : 'No' },
    {
      title: 'Created Date',
      value: `<nobr>${formatDate('H:I:S D.M.Y', fsItem.createdDate)}</nobr>`
    },
    {
      title: 'Modified Date',
      value: `<nobr>${formatDate('H:I:S D.M.Y', fsItem.editedDate)}</nobr>`
    }
  ];
});
</script>

<style lang="postcss" scoped>
.wb-module-files-info {
  padding: 5px;
  padding-right: 20px;
  padding-bottom: 20px;

  & table {
    width: 100%;
    margin: 0 -5px;

    & td {
      padding: 5px 10px;

      &:first-child {
        width: 30%;
        white-space: nowrap;
      }
    }
  }

  & fieldset {
    margin: 5px;
    margin-top: 10px;
  }

  & td + td {
    white-space: nowrap;
  }
}
</style>
