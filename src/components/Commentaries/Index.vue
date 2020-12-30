<template>
  <div :class="$options.name">
    <commentaries-list
      v-if="comments && comments.length"
      :list="comments"
      :current-user-login="currentUser.login"
    />
    <div v-else class="commentaries-component__empty">Комментариев нет</div>
  </div>
</template>

<script>
import CommentariesList from './List.vue';

export default {
  name: 'commentaries-component',
  components: { CommentariesList },
  props: {
    comments: {
      type: Array,
      default: () => ([]),
    },
    currentUser: {
      type: Object,
      required: true,
    },
  },
};
</script>

<style lang="scss" scoped>
@import "~@/styles/partials/params";
@import "~@/styles/partials/mixins";

.commentaries-component {
  &__empty {
    display: flex;
    margin-top: 12px;
    font-size: 12px;
    color: $gray;
  }
}
</style>
