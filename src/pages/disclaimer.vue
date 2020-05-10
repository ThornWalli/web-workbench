<script>
import IndexPage from './index';

export default {
  extends: IndexPage,
  data () {
    return {
      startCommand: 'openPreview "Disclaimer.md"'
    };
  },
  head () {
    return {
      title: 'Disclaimer'
    };
  }
};
</script>
