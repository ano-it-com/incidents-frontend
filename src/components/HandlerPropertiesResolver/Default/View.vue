<template>
  <ul :class="$options.name" class="table-striped__invert">
    <li
      v-for="item in properties"
      :key="item.id"
      class="default-view__item table-item"
    >
      <div class="default-view__item-name" v-text="item.name" />
      <div class="default-view__item-value">
        <property-view
          :value="getPropertyValue(item.id)"
          :prepared-values="item.prepared"
        />
      </div>
    </li>
  </ul>
</template>

<script>
import PropertyView from '../components/PropertyView';
import viewMixin from './view-mixin';

export default {
  name: 'default-view',
  mixins: [viewMixin],
  components: { PropertyView },
};
</script>

<style lang="scss" scoped>
@import "~@/styles/partials/mixins";
@import "~@/styles/partials/params";

.default-view {
  list-style: none;
  margin-bottom: ($mm-value * 8) + px;

  &__item {
    display: flex;
    justify-content: space-between;
    align-items: center;

    &-name {
      font-size: 12px;
      font-weight: 500;
      line-height: 16px;
      width: 120px;
    }

    &-value {
      font-size: 12px;
      line-height: 16px;
      width: calc(100% - 135px);

      & a {
        color: $blue;
      }
    }
  }
}
</style>
