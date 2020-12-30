<template>
  <div :class="$options.name">
    <div
      v-for="(item, index) in list.reverse()"
      :key="index"
      class="item-history-component-box"
    >
      <a class="user online" href="#">
        <div class="user__img">
          <img src="~@/assets/user.jpg">
        </div>
      </a>
      <div class="item-history-component-info">
        <div class="item-history-component-top">
          <a class="item-history-component-name" href="#">
            {{ item.initiatedBy.firstName }} {{ item.initiatedBy.lastName }}
          </a>
          <div class="item-history-component-time">{{ item.initiatedAt | timestampToDate }}</div>
        </div>
        <div class="item-history-component-content">
          Статус изменена на "{{ item.to.title }}"
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'item-history-component',
  props: {
    list: {
      type: Array,
      default: () => ([]),
    },
  },
};
</script>

<style lang="scss" scoped>
@import "~@/styles/partials/params";
@import "~@/styles/partials/mixins";

.item-history-component {
  max-height: calc(32 * 16px);
  overflow: auto;

  &-box {
    position: relative;
    display: flex;
    justify-content: space-between;
    margin-bottom: 12px;
    padding-right: 24px;

    &:last-child {
      margin-bottom: 0;

      &::after {
        display: none;
      }
    }

    &::before {
      content: '';
      position: absolute;
      right: 0;
      top: 5px;
      width: 11px;
      height: 11px;
      background-color: #fff;
      border: 2px solid #b1b8c4;
      border-radius: 50%;
    }

    &::after {
      content: '';
      position: absolute;
      top: 16px;
      right: 5px;
      width: 0;
      height: 100%;
      border-right: 1px dashed #b1b8c4;
    }
  }

  &-info {
    width: calc(100% - 36px);
    margin-top: 5px;
    overflow: hidden;
    transition: all 0.7s ease-out 0s;

    &:hover {
      & .comment-bottom {
        opacity: 1;
        visibility: visible;
        transition: opacity 0.3s;
      }
    }
  }

  &-top {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  &-name {
    font-size: 12px;
    font-weight: 500;
    color: $gray;

    &:hover {
      transition: 0.3s;
      color: $blue;
    }
  }

  &-time {
    font-size: 11px;
    font-weight: 500;
    color: $gray;
  }

  &-content {
    font-size: 13px;
    line-height: 16px;
    border-radius: 0 8px 8px 8px;
    background-color: $light-gray;
    padding: 12px;
    margin-top: 5px;

    & a {
      color: $blue;
    }

    & span {
      display: block;
      text-overflow: ellipsis;
      overflow: hidden;
      white-space: nowrap;
      background-color: $gray-blue-border;
      padding: 2px 12px;
      border-radius: 0 4px 4px 0;
      border-left: 2px solid $blue;
      margin-bottom: 10px;
    }
  }
}
</style>
