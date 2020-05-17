<script>
import IndexPage from './index';

export default {
  extends: IndexPage,
  data () {
    return {
      startCommand: 'execute "Imprint.md"'
    };
  },
  head () {
    return {
      title: 'Imprint'
    };
  }
};
</script>
