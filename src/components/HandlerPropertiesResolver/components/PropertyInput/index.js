import TextInput from './TextInput.vue';
import SelectInput from './SelectInput.vue';

export default {
  name: 'property-input',
  props: {
    id: {
      type: String,
      required: true,
    },
    type: {
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
    value: [Number, String],
  },
  computed: {
    isSelect() {
      return Array.isArray(this.preparedValues) && this.preparedValues.length;
    },
  },
  render(createElement) {
    const self = this;
    const componentProperties = {
      props: this.$props,
      on: {
        change(event) {
          self.$emit('change', event);
        },
      },
    };

    if (this.isSelect) {
      return createElement(SelectInput, componentProperties);
    }

    return createElement(TextInput, componentProperties);
  },
};
