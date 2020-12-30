<template>
  <div :class="$options.name">
    <div
      v-for="item in items"
      :key="item.id"
      :class="{ selected: value === item.id }"
      class="incident-type-selector__item"
      @click="onTypeSelect(item)"
    >
      <span class="incident-type-selector__item-title" v-text="item.title" />
      <span class="incident-type-selector__item-description" v-text="item.description" />
    </div>
  </div>
</template>

<script>
export default {
  name: 'incident-type-selector',
  model: {
    prop: 'value',
    event: 'input',
  },
  props: {
    items: {
      type: Array,
      required: true,
    },
    value: Number,
  },
  methods: {
    onTypeSelect(item) {
      this.$emit('input', item.id);
      this.$emit('change', item);
    },
  },
};
</script>

<style lang="scss" scoped>
@import "~@/styles/partials/params";
@import "~@/styles/partials/mixins";

.incident-type-selector {
  display: flex;
  flex-wrap: nowrap;
  justify-content: flex-start;

  &__item {
    display: flex;
    flex-direction: column;
    padding: 10px;
    background-color: transparent;
    border: 1px solid $blue;
    border-radius: 4px;
    box-shadow: 0 2px 2px rgba(20,20,20, 0.15);
    color: $blue;
    cursor: pointer;
    transition: background-color .3s, color .3s;

    &:hover {
      background-color: transparentize($blue, .90);
    }

    &.selected {
      color: $white;
      background-color: $blue;
      background-image: linear-gradient(
          180deg,
          rgba(152, 210, 255, 0.3) 0%,
          rgba(255, 255, 255, 0) 100%
      );
    }

    & + & {
      margin-left: 12px;
    }

    &-title {
      font-size: 14px;
      font-weight: 500;
    }

    &-description {
      font-size: 12px;
    }
  }
}
</style>
