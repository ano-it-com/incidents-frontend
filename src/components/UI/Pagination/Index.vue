<template>
  <nav :class="$options.name">
    <a
      v-if="false"
      :class="{ disabled: page === 1 }"
      class="pagination-component__item start"
      @click.prevent="$emit('change', 1)"
    >
      <icon :size="10" name="arrow-double" />
    </a>
    <a
      v-if="false"
      :class="{ disabled: page === 1 }"
      class="pagination-component__item prev"
      @click.prevent="$emit('change', page - 1)"
    >
      <icon :size="10" name="arrow" />
    </a>
    <a
      v-for="pageItem in paginationItems"
      :key="pageItem"
      :class="{ active: pageItem === page, disabled: pageItem === '...' }"
      class="pagination-component__item"
      href="#"
      v-text="pageItem"
      @click="$emit('change', pageItem)"
    />
    <a
      :class="{ disabled: page + 1 > pagesCount }"
      class="pagination-component__item next"
      @click.prevent="$emit('change', page + 1)"
    >
      <icon :size="10" name="arrow" />
    </a>
    <a
      :class="{ disabled: page === pagesCount }"
      class="pagination-component__item end"
      @click.prevent="$emit('change', pagesCount)"
    >
      <icon :size="10" name="arrow-double" />
    </a>
  </nav>
</template>

<script>
export default {
  name: 'pagination-component',
  props: {
    page: Number,
    perPage: Number,
    total: Number,
    pagesCount: Number,
  },
  computed: {
    paginationItems() {
      const delta = 3;
      const left = this.page - delta;
      const right = this.page + delta + 1;

      const result = Array.from({ length: this.pagesCount }, ((v, k) => k + 1))
        .filter((i) => i && i >= left && i < right);

      if (result.length > 1) {
        if (result[0] > 1) {
          if (result[0] > 2) {
            result.unshift('...');
          }
          result.unshift(1);
        }

        if (result[result.length - 1] < this.pagesCount) {
          if (result[result.length - 1] !== this.pagesCount - 1) {
            result.push('...');
          }
          result.push(this.pagesCount);
        }
      }

      return result;
    },
  },
};
</script>

<style lang="scss" scoped>
@import "~@/styles/partials/params";
@import "~@/styles/partials/mixins";

.pagination-component {
  display: flex;
  align-items: center;

  &__item {
    position: relative;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 12px;
    font-weight: 500;
    background-color: $white;
    border: 1px solid $gray-blue-border;
    border-left: none;
    width: 32px;
    height: 32px;
    transition: background-color 0.3s;

    &:first-child {
      border-left: 1px solid $gray-blue-border;
    }

    &.active {
      background-color: $light-gray;
      pointer-events: none;
    }

    &.disabled {
      pointer-events: none;
      color: darken($white, 10);
    }

    &:hover {
      background-color: $gray-blue-hover;
      color: $blue;
    }

    &.start,
    &.prev {
      ::v-deep .icon {
        transform: rotate(180deg);
      }
    }
  }
}
</style>
