<template>
  <div class="property-view">
    {{ propertyValue }}
  </div>
</template>

<script>
export default {
  name: 'property-view',
  props: {
    value: [String, Number],
    preparedValues: {
      type: Array,
      default: () => ([]),
    },
  },
  computed: {
    propertyValue() {
      if (Array.isArray(this.preparedValues) && this.preparedValues.length) {
        if (typeof this.preparedValues[0] === 'object' && Object.keys(this.preparedValues[0]).includes('id')) {
          const needle = this.preparedValues.find((_) => _.id === this.value);
          if (!needle) return '-';

          return needle.title;
        }
      }

      return this.value;
    },
  },
};
</script>
