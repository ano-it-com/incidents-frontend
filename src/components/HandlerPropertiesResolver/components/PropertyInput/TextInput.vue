<template>
  <div class="property-item">
    <div class="property-item__label" v-text="name" />
    <input-component
      v-model="propertyValue"
      :type="inputType"
      placeholder="Введите значение"
      small
      full-width
      @input="onPropertyValueChanged"
    />
  </div>
</template>

<script>
import InputComponent from '@/components/UI/Input';
import propertyInputMixin from './property-input-mixin';

export default {
  name: 'text-property-input',
  mixins: [propertyInputMixin],
  components: { InputComponent },
};
</script>

<style lang="scss" src="./styles/property.scss"></style>
