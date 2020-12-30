export default {
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
  },
  computed: {
    getPropertyValue() {
      return (property) => {
        const valueObject = this.values.find((_) => _.id === property);
        return valueObject.value;
      };
    },
  },
};
