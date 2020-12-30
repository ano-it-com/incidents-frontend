import getRenderer from './renderer';

export default {
  name: 'handler-properties-resolver',
  model: {
    prop: 'value',
    event: 'change',
  },
  props: {
    type: {
      type: String,
      validator: (value) => ['edit', 'view'].includes(value),
    },
    handler: {
      type: Object,
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
  render(createElement) {
    const props = {
      id: this.handler.id,
      properties: this.handler.properties,
      values: this.values,
      value: this.value,
    };

    const self = this;

    return createElement(
      getRenderer(this.type, this.handler.id),
      {
        props,
        on: {
          change(event) {
            self.$emit('change', event);
          },
        },
      },
    );
  },
};
