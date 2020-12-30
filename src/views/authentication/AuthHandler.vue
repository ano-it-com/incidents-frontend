<template>
  <div :class="$options.name">
    <spinner :size="98" color="#3F6ADA" />
  </div>
</template>

<script>
import { mapActions } from 'vuex';
import cookies from 'js-cookie';
import get from 'lodash/get';
import Spinner from '@/components/UI/Spinner';

export default {
  name: 'authentication-handler',
  components: { Spinner },
  async created() {
    const code = get(this.$route, 'query.code');
    const token = await this.ssoAuthentication(code);
    cookies.set('token', token, { path: '/' });
    await this.userProfile();
    await this.$router.push({ name: 'home' });
  },
  methods: {
    ...mapActions(['ssoAuthentication', 'userProfile']),
  },
};
</script>

<style lang="scss" scoped>
@import "~@/styles/partials/params";
@import "~@/styles/partials/mixins";

.authentication-handler {
  display: flex;
  justify-content: center;
  align-items: center;

  width: 100vw;
  height: 100vh;
}
</style>
