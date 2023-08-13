<template>
  <div class="wb-disks-examples-markdown">
    <atom-markdown :content="content" />
  </div>
</template>

<script>
import AtomMarkdown from '@web-workbench/core/components/atoms/Markdown';

export default {
  components: {
    AtomMarkdown
  },
  props: {
    content: {
      type: String,
      default:
        '# Web-Workbench 1.3\n<nobr>Created by Thorn-Welf Walli</nobr><br>Email: lammpee@gmail.com<br>Homepage: lammpee.de<br><br>Version: 0.0.1 ALPHA'
    }
  }
};
</script>

<style lang="postcss" scoped>
.wb-disks-examples-markdown {
  padding: 5px;
}
</style>
