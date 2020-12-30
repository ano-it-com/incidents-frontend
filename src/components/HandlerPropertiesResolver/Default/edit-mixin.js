import chunk from 'lodash/chunk';
import get from 'lodash/get';

export default {
  inheritAttrs: false,
  model: {
    prop: 'value',
    event: 'change',
  },
  props: {
    id: String,
    properties: {
      type: Array,
      required: true,
    },
    values: {
      type: Array,
      default: () => ([]),
    },
    value: {
      type: Array,
      default: () => ([]),
    },
  },
  computed: {
    chunkedProperties() {
      return chunk(this.properties, 3);
    },

    getPassedValue() {
      return (id) => {
        const valueObject = this.values.find((_) => _.id === id);
        if (!valueObject) return null;

        return valueObject.value;
      };
    },
  },
  created() {
    this.$emit(
      'change',
      this.properties
        .map((_) => ({
          id: _.id,
          value: get(this.value.find((item) => item.id === _.id), 'value', null),
        })),
    );
  },
  methods: {
    onPropertyValueChanged(id, value) {
      // todo govno
      const currentModel = [...this.value];
      const property = currentModel.find((item) => item.id === id);
      property.value = value;

      this.$emit('change', currentModel);
    },
  },
};
