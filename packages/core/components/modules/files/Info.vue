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

<script>
import { stripByteString, formatDate } from '../../../utils/string';
import useWindow from '@web-workbench/core/composables/useWindow';

export default {
  components: {},

  props: {
    fsItem: {
      type: Object,
      default() {
        return null;
      }
    }
  },

  setup() {
    return useWindow();
  },
  computed: {
    meta() {
      return Array.from(this.fsItem.meta).map(([name, value]) => {
        if (typeof value === 'object') {
          try {
            value = JSON.stringify(value);
          } catch (error) {
            console.error(error);
          }
        }
        return { title: name, value };
      });
    },
    items() {
      return [
        { title: 'Id', value: this.fsItem.id },
        { title: 'Name', value: this.fsItem.name },
        { title: 'Type', value: this.fsItem.constructor.NAME },
        { title: 'Path', value: this.fsItem.getPath() },
        { title: 'Size', value: stripByteString(this.fsItem.size) },
        { title: 'Locked', value: this.fsItem.locked ? 'Yes' : 'No' },
        {
          title: 'Created Date',
          value: `<nobr>${formatDate(
            'H:I:S D.M.Y',
            this.fsItem.createdDate
          )}</nobr>`
        },
        {
          title: 'Modified Date',
          value: `<nobr>${formatDate(
            'H:I:S D.M.Y',
            this.fsItem.editedDate
          )}</nobr>`
        }
      ];
    }
  }
};
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
