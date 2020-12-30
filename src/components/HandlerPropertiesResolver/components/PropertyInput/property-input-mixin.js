export default {
  model: {
    prop: 'value',
    event: 'change',
  },
  props: {
    id: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    preparedValues: {
      type: Array,
      default: () => ([]),
    },
    type: {
      type: String,
      required: true,
    },
    value: [String, Number],
  },
  data: () => ({
    propertyValue: null,
  }),
  computed: {
    inputType() {
      switch (this.type) {
        case 'int':
          return 'number';
        case 'string':
        default:
          return 'text';
      }
    },
  },
  watch: {
    value: {
      immediate: true,
      handler(newValue) {
        this.propertyValue = newValue;
      },
    },
  },
  methods: {
    onPropertyValueChanged() {
      const intValue = parseInt(this.propertyValue, 10);
      const value = Number.isNaN(intValue) ? this.propertyValue : intValue;
      // this.inputType === 'number' ? parseInt(this.propertyValue, 10) : this.propertyValue;
      this.$emit('change', value);
    },
  },
};
