<script>
import IndexPage from './index';

export default {
  extends: IndexPage,
  data () {
    return {
      startCommand: 'execute "DF2:MoonCity.app"'
    };
  },
  head () {
    return {
      title: 'Moon City'
    };
  }
};
</script>
