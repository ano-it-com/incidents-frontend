<template>
  <div :class="[$options.name, componentClasses]">
    <div :class="{ 'has-icon': !!this.icon }" class="input-content">
      <template v-if="icon">
        <slot name="icon">
          <icon :name="icon" :size="16" class="icon" />
        </slot>
      </template>
      <input
        :class="[]"
        :type="type"
        :placeholder="placeholder"
        :name="name"
        :required="required"
        :value="value"
        autocomplete="off"
        @change="onChange"
        @input="onInput"
        @focusin="isFocused = true"
        @focusout="isFocused = false"
      >
    </div>
    <slot name="suffix" />
  </div>
</template>

<script>
import uniqueId from 'lodash/uniqueId';

export default {
  name: 'input-component',
  model: {
    prop: 'value',
    event: 'input',
  },
  inheritAttrs: false,
  props: {
    value: [String, Number],
    name: {
      type: String,
      default: uniqueId(),
    },
    type: {
      type: String,
      default: 'text',
    },
    required: Boolean,
    placeholder: String,
    fullWidth: Boolean,
    small: Boolean,
    icon: String,
  },
  data: () => ({
    isFocused: false,
  }),
  computed: {
    componentClasses() {
      return {
        'is-focused': this.isFocused,
        'is-full-width': this.fullWidth,
        'is-small': this.small,
      };
    },
  },
  methods: {
    onChange(event) {
      this.$emit('change', event.target.value);
    },
    onInput(event) {
      this.$emit('input', event.target.value);
    },
  },
};
</script>

<style lang="scss" scoped>
@import "~@/styles/partials/mixins";
@import "~@/styles/partials/params";

.input-component {
  position: relative;
  display: flex;
  flex-wrap: nowrap;
  height: 40px;
  width: 120px;
  border-radius: 4px;
  border: 1px solid $gray-blue-border;
  background-color: $light-gray;
  transition: 0.3s;

  & .input-content {
    padding: 10px 12px;
    width: 100%;

    &.has-icon {
      padding: 10px 44px;
    }

    > .icon {
      position: absolute;
      left: 16px;
      color: $blue;
    }
  }

  input {
    height: 100%;
    width: 100%;
    font-size: 14px;
    font-weight: 500;
    outline: none;
    background-color: transparent;
    border: none;

    &::placeholder {
      color: #9F9F9F;
    }
  }

  &.is-focused {
    border: 1px solid $blue;
  }

  &.is-full-width {
    width: 100%;
  }

  &.is-small {
    height: 32px;
    border-radius: 2px;

    .input-content {
      padding: 0 10px;
    }

    input {
      font-size: 12px;
      font-weight: 400;
    }
  }
}
</style>
