<template>
  <div class="property-item">
    <div class="property-item__label" v-text="name" />
    <select-component
      v-model="propertyValue"
      :list="preparedValues"
      id-field="id"
      value-field="title"
      small
      @change="onPropertyValueChanged"
    />
  </div>
</template>

<script>
import SelectComponent from '@/components/UI/Select';
import propertyInputMixin from './property-input-mixin';

export default {
  name: 'select-property-input',
  components: { SelectComponent },
  mixins: [propertyInputMixin],
};
</script>

<style lang="scss" src="./styles/property.scss"></style>
