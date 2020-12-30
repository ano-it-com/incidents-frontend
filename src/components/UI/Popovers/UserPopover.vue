<template>
  <div :class="$options.name">
    <div class="user-popover-component__left">
      <div class="user-popover-component__avatar">
        <img src="~@/assets/man.png" />
      </div>
      <div class="user-popover-component__info">
        <div class="user-popover-component__info-name">
          {{ user.firstName }} {{ user.lastName }}
        </div>
      </div>
    </div>
    <div class="user-popover-component__right"></div>
  </div>
</template>

<script>
export default {
  name: 'user-popover-component',
  props: {
    user: {
      type: Object,
      required: true,
    },
  },
};
</script>

<style lang="scss" scoped>
@import "~@/styles/partials/params";
@import "~@/styles/partials/mixins";

.user-popover-component {
  position: relative;
  display: flex;
  justify-content: space-between;
  width: 210px;
  padding: 2px;
  background-color: $white;
  border-radius: 4px;

  &__left {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  &__avatar {
    position: relative;
    border-radius: 6px 0 0 6px;
    overflow: hidden;
    width: 60px;
    min-width: 60px;
    height: 60px;

    img {
      width: 100%;
    }
  }

  &__info {
    padding: 12px;
    width: calc(100% - 60px);

    &-name {
      font-family: Ruda,sans-serif;
      font-weight: 800;
      font-size: 12px;
      line-height: 16px;
    }
  }
}
</style>
