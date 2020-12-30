<template>
  <ul :class="[$options.name, { 'is-full-width': fullWidth }]">
    <li
      v-for="item in list"
      :key="item.id"
      class="incident-files-list__item"
    >
      <img src="@/assets/icon-pdf.png">
      <div class="incident-files-list__item-name" v-text="item.originalName" />
      <a :href="item.path" target="_blank" />
    </li>
  </ul>
</template>

<script>
export default {
  name: 'incident-files-list',
  props: {
    list: {
      type: Array,
      default: () => ([]),
    },
    fullWidth: Boolean,
  },
};
</script>

<style lang="scss" scoped>
@import "~@/styles/partials/params";
@import "~@/styles/partials/mixins";

.incident-files-list {
  position: relative;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  flex-wrap: wrap;
  list-style: none;
  margin-top: 25px;
  max-width: 600px;

  &.is-full-width {
    max-width: 100%;
  }

  &__item {
    position: relative;
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: calc(50% - 12px);
    transition: 0.3s;
    margin-bottom: 15px;

    &:nth-last-child(1),
    &:nth-last-child(2) {
      margin-bottom: 0;
    }

    &:hover {
      & .incident-files-list__item-name {
        color: $blue;
        transition: 0.3s;
      }
    }

    & img {
      width: 53px;
      min-width: 53px;
    }

    &-name {
      font-size: 11px;
      font-weight: 500;
      line-height: 16px;
      width: calc(100% - 60px);
      overflow: hidden;
      text-overflow: ellipsis;
      display: -webkit-box;
      -webkit-line-clamp: 3;
      -webkit-box-orient: vertical;
    }

    & a {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      z-index: 2;
    }
  }
}
</style>
