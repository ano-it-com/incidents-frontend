<template>
  <div :class="$options.name">
    <div
      v-for="item in list"
      :key="`comment-${item.id}`"
      :class="{ mine: currentUserLogin === item.createdBy.login }"
      class="comment-box"
    >
      <a class="user online" href="#">
        <div class="user__img">
          <img src="~@/assets/user.jpg">
        </div>
      </a>
      <div class="comment-info">
        <div class="comment-top">
          <a class="comment-name" href="#">
            {{ item.createdBy.firstName }} {{ item.createdBy.lastName }}
          </a>
          <div class="comment-time">{{ item.createdAt | timestampToDate }}</div>
        </div>

        <div class="comment-content" v-html="item.text" />

        <div class="comment-bottom">
          <div class="comment-reply">
            <icon :size="9" name="reply" class="icon" />
            Ответить
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'commentaries-list-component',
  props: {
    list: {
      type: Array,
      default: () => ([]),
    },
    currentUserLogin: String,
  },
};
</script>

<style lang="scss" scoped>
@import "~@/styles/partials/params";
@import "~@/styles/partials/mixins";

.comment {
  &-box {
    position: relative;
    display: flex;
    justify-content: space-between;
    margin-bottom: 12px;

    &:last-child {
      margin-bottom: 0;
    }

    &.mine{
      & .user,
      & .comment-name {
        order: 2;
      }
      & .comment-content {
        color: $white;
        background-color: $blue;
        border-radius: 8px 0 8px 8px;

        ::v-deep p {
          color: currentColor;
        }

        & a {
          color: $yellow;
        }

        & span {
          background-color: $blue2;
          border-left: 2px solid $white;
        }
      }
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

  &-bottom {
    display: flex;
    justify-content: space-between;
    align-items: center;
    opacity: 0;
    visibility: hidden;
    transition: opacity 0.3s;
  }

  &-reply,
  &-edit,
  &-delete {
    font-size: 11px;
    font-weight: 500;
    line-height: 22px;
    cursor: pointer;

    & .icon {
      margin-right: 2px;
    }
  }

  &-reply,
  &-edit {
    color: $blue;
  }

  &-edit {
    margin: 0 15px 0 auto;
  }

  &-delete {
    color: $red;
  }

  &-show {
    font-size: 11px;
    font-weight: 500;
    line-height: 21px;
    color: $blue;
    cursor: pointer;
    margin-left: 15px;
    border-bottom: 1px dashed $blue;
  }

  &-new {
    margin-top: 30px;
  }

  &-title {
    font-size: 12px;
    font-weight: 500;
    line-height: 14px;
    margin-bottom: 15px;
  }

  &-more {
    margin-top: 15px;
    display: flex;justify-content: space-between;
    align-items: center;

    & .btn-submit {
      min-width: 168px;

      &[disabled] {
        opacity: 0.5;
        cursor: default;
      }
    }
  }

  &-text {
    position: relative;
    font-size: 12px;
    line-height: 16px;
    padding-left: 25px;
    width: 100%;

    & span {
      color: $blue;
    }

    &:before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      width: 16px;
      height: 16px;
      background: url("~@/assets/icon-comment-info.svg") no-repeat center;
      background-size: contain;
    }
  }
}
</style>
