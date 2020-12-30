<template>
  <ul v-if="list && list.length" :class="$options.name" class="table-striped table-hover">
    <recommendation-item
      v-for="(item, index) in list"
      :key="item.id"
      v-bind="item"
      :index="index + 1"
      @edit-report="$emit('create-report', $event)"
    />
  </ul>
  <div v-else>
    Рекомендации отсутствуют
  </div>
</template>

<script>
import RecommendationItem from './Item.vue';

export default {
  name: 'recommendation-list',
  components: { RecommendationItem },
  props: {
    list: {
      type: Array,
      default: () => ([]),
    },
  },
};
</script>
