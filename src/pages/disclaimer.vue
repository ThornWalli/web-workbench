<script>
import IndexPage from './index';

export default {
  extends: IndexPage,
  data () {
    return {
      startCommand: 'execute "Disclaimer.md"'
    };
  },
  head () {
    return {
      title: 'Disclaimer'
    };
  }
};
</script>
