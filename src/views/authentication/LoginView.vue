<template>
  <div :class="$options.name">
    <div class="content">
      <h4>Система управления<br />инцидентами</h4>

      <div class="content">
        <div v-if="authError" class="authentication-error">
          Не верные логин или пароль. Проверьте введенные данные.
        </div>
        <form name="authentication" @submit.prevent="onSubmit">
          <div class="form-group">
            <input-component
              v-model="formData.username"
              placeholder="Логин"
              full-width
              @input="authError = false"
            />
          </div>

          <div class="form-group">
            <input-component
              v-model="formData.password"
              type="password"
              placeholder="Пароль"
              full-width
              @input="authError = false"
            />
          </div>

          <div class="form-group auth-buttons">
            <button-component
              :disabled="isLoading"
              label="Вход"
              type="submit"
              full-width
              shadow
              inverse
              large
            />

            <button-component
              :disabled="isLoading"
              label="SSO"
              :href="authLink"
              shadow
              inverse
              large
            />
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions } from 'vuex';
import InputComponent from '@/components/UI/Input';
import ButtonComponent from '@/components/UI/Button';
import { getAuthLink } from '@/utils/api/modules/users';

export default {
  name: 'login-view',
  components: { InputComponent, ButtonComponent },
  metaInfo: {
    title: 'Авторизация',
  },
  async asyncData() {
    const { url } = await getAuthLink();
    return {
      authLink: url,
    };
  },
  data: () => ({
    isLoading: false,
    authLink: null,
    formData: {
      username: null,
      password: null,
    },
    authError: false,
  }),
  methods: {
    ...mapActions(['logIn', 'userProfile']),

    async onSubmit() {
      try {
        this.isLoading = true;
        this.authError = false;
        await this.logIn({
          login: this.formData.username,
          password: this.formData.password,
        });
        await this.userProfile();
        this.$router.push({ name: 'incidents-list' });
      } catch (e) {
        this.authError = true;
      } finally {
        this.isLoading = false;
      }
    },
  },
};
</script>

<style lang="scss" scoped>
@import "~@/styles/partials/mixins";
@import "~@/styles/partials/params";

.login-view {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;

  .content {
    background-color: $white;
    border-radius: 4px;
    width: 360px;
    padding: 12px;
  }

  h4 {
    text-align: center;
  }

  .content {
    margin-top: 24px;
  }
}

.authentication-error {
  border-radius: 4px;
  padding: 12px;
  font-size: 14px;
  margin-bottom: 16px;
  border: 1px solid $red;
  background-color: transparentize($red, .9);
  color: $red;
}

.auth-buttons {
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;

  * + * {
    margin-left: 12px;
  }
}
</style>
