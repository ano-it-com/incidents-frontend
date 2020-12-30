<template>
  <header class="header">
    <div class="container">
      <a class="header__logo" href="/">
        <img src="@/assets/logo.svg">
      </a>
      <a class="menu__item active" href="#">
        <icon name="list-in" class="icon" :size="18" />
        Инциденты
      </a>

<!--      <a class="menu__item" href="#">-->
<!--        <icon name="home" class="icon" :size="13" />-->
<!--        Домашняя страница-->
<!--      </a>-->
      <button-component
        :to="{ name: 'incidents-create' }"
        class="header-button"
        icon="plus"
        label="Добавить инцидент"
        shadow
      />
      <router-link class="user red" :to="{ name: 'logout' }">
        <div class="user__img">
          <img src="@/assets/user.jpg">
        </div>
      </router-link>
    </div>
  </header>
</template>

<script>
import ButtonComponent from '@/components/UI/Button';

export default {
  name: 'header-layout',
  components: { ButtonComponent },
};
</script>

<style lang="scss" scoped>
@import "~@/styles/partials/params";
@import "~@/styles/partials/mixins";

.header {
  & .header-button {
    width: 184px;
    margin-left: auto;
    margin-right: 30px;
  }

  &__logo {
    position: relative;
    display: flex;
    align-items: center;

    & img {
      width: 24px;
    }
  }

  &__home {
    display: flex;
    justify-content: center;
    align-items: center;
    font-weight: 500;
    color: #b8ccfe;
    transition: 0.3s;
    margin-left: 25px;

    &:hover {
      color: $white;
    }

    ::v-deep .icon {
      margin-top: -4px;
      margin-right: 8px;
    }
  }

  .menu__item {
    position: relative;
    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: 4px;
    color: #b8ccfe;
    height: 32px;
    font-size: 13px;
    font-weight: 500;
    line-height: 14px;
    padding: 0 16px;
    margin-left: 25px;
    cursor: pointer;
    transition: background-color .3s, color .3s;

    .icon {
      margin-right: 5px;
    }

    &:hover, &.active {
      background-color: rgba(48, 78, 157, 0.39);
      color: $white;
    }
  }

  .user {
    position: relative;
    display: flex;

    &__img {
      position: relative;
      width: 24px;
      height: 24px;
      border-radius: 4px;
      overflow: hidden;

      & img {
        position: absolute;
        height: 100%;
        width: 100%;
        object-fit: cover;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
      }
    }
  }
}
</style>
