<template>
  <div :class="$options.name">
    <div class="tabs-component__list">
      <a
        v-for="item in tabs"
        :key="item.id"
        :class="{ active: item.id === activeItem }"
        class="tabs-component__list-item"
        @click.prevent="onTabClick(item.id)"
      >
        <h5>{{ item.name }} <sup v-if="item.count !== null" v-text="item.count" /></h5>
      </a>
    </div>

    <div class="tabs-component__item">
      <slot />
    </div>
  </div>
</template>

<script>
export default {
  name: 'tabs-component',
  data: () => ({
    activeItem: null,
    isResolved: false,
    tabs: [],
  }),
  created() {
    this.tabs = this.$children;
  },
  mounted() {
    this.tabs = this.$children;

    if (this.tabs.length) {
      this.activeItem = this.tabs[0].id;
      this.onTabClick(this.activeItem);
    }
  },
  methods: {
    onTabClick(itemId) {
      this.tabs.forEach((component) => {
        // eslint-disable-next-line no-param-reassign
        component.isActive = (component.id === itemId);
      });

      this.activeItem = itemId;
    },
  },
};
</script>

<style lang="scss" scoped>
@import "~@/styles/partials/params";
@import "~@/styles/partials/mixins";

  .tabs-component {
  margin-bottom: ($mm-value * 8) + px;
  &__list {
    display: flex;
    align-items: center;
    border-bottom: 1px solid $gray-blue-border;

    &-item {
      position: relative;
      color: $gray;
      padding:  0 0 ($mm-value * 3) + px;
      margin-right: 24px;
      transition: 0.3s;
      user-select: none;
      cursor: pointer;

      h5 {
        color: inherit;
        margin-bottom: 0;
      }
      &:hover {
       color: $blue;
      }
      &.active {
        color: $darkblue;
        cursor: default;

        &::before {
          opacity: 1;
          transition: .3s;
        }
      }

      &::before {
        content: '';
        position: absolute;
        width: 100%;
        height: 2px;
        background-color: $blue;
        left: 0;
        bottom: -1px;
        opacity: 0;
        transition: 0.3s;
      }
    }
  }

  &__item {
    margin: ($mm-value * 4) + px 0 0;
  }
}
</style>
