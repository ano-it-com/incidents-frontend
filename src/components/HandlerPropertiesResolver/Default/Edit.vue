<template>
  <div :class="$options.name">
    <div
      v-for="(properties, index) in chunkedProperties"
      :key="index"
      class="default-edit-view__row"
    >
      <template v-for="item in properties">
        <property-input
          :key="item.id"
          :id="item.id"
          :name="item.name"
          :type="item.type"
          :value="getPassedValue(item.id)"
          :prepared-values="item.prepared"
          class="default-edit-view__item"
          @change="onPropertyValueChanged(item.id, $event)"
        />
      </template>
    </div>
  </div>
</template>

<script>
import editMixin from './edit-mixin';
import PropertyInput from '../components/PropertyInput';

export default {
  name: 'default-edit-view',
  components: { PropertyInput },
  mixins: [editMixin],
};
</script>

<style lang="scss" scoped>
@import "~@/styles/partials/params";
@import "~@/styles/partials/mixins";

.default-edit-view {
  &__row {
    position: relative;
    display: flex;
    justify-content: flex-start;
    margin-bottom: 20px;
  }

  &__item {
    width: 100%;

    & + .default-edit-view__item {
      margin-left: 36px;
    }
  }
}
</style>
