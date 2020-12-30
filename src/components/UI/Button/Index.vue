<template>
  <router-link v-if="!!to" :to="to" :tag="tag" :class="classObject">
    <slot>
      <template>
        <icon v-if="icon" :name="icon" class="icon" />
        <span v-if="label" class="label">{{ label }}</span>
        <span v-if="!icon && !label">Submit</span>
      </template>
    </slot>
  </router-link>
  <a v-else-if="!!href" :href="href" :class="classObject">
    <slot>
      <template>
        <icon v-if="icon" :name="icon" class="icon" />
        <span v-if="label" class="label">{{ label }}</span>
        <span v-if="!icon && !label">Submit</span>
      </template>
    </slot>
  </a>
  <button
    v-else
    :class="classObject"
    :type="type"
    @click.stop="$emit('click', $event)"
  >
    <slot>
      <template>
        <icon v-if="icon" :name="icon" class="icon" />
        <span v-if="label" class="label">{{ label }}</span>
        <span v-if="!icon && !label">Submit</span>
      </template>
      <div v-if="isLoading" class="button-loader">
        <spinner :color="inverse ? '#FFFFFF' : '#3F6ADA'" />
      </div>
    </slot>
  </button>
</template>

<script>
import Spinner from '@/components/UI/Spinner';

export default {
  name: 'btn-component',
  components: { Spinner },
  inheritAttrs: false,
  props: {
    isLoading: Boolean,
    icon: String,
    label: String,
    large: Boolean,
    disabled: Boolean,
    small: Boolean,
    shadow: Boolean,
    inverse: Boolean,
    to: [Object, String],
    href: String,
    tag: {
      type: String,
      default: 'a',
    },
    type: {
      type: String,
      default: 'button',
    },
    fullWidth: Boolean,
    bordered: Boolean,
  },
  computed: {
    classObject() {
      return {
        [this.$options.name]: true,
        'is-shadow': this.shadow,
        'is-full-width': this.fullWidth,
        'is-inverse': this.inverse,
        'is-large': this.large,
        'is-bordered': this.bordered,
        'is-loading': this.isLoading,
        disabled: this.disabled,
      };
    },
  },
};
</script>

<style lang="scss" scoped>
@import "~@/styles/partials/params";
@import "~@/styles/partials/mixins";

.btn-component {
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 13px;
  font-weight: 500;
  color: $blue;
  background-color: $white;
  height: 36px;
  border-radius: 4px;
  border: none;
  outline: none;
  cursor: pointer;
  padding: 0 ($mm-value * 4) + px;

  &.is-loading {
    .icon, span {
      opacity: 0;
    }
  }

  &.is-full-width {
    width: 100%;
  }

  &.is-shadow {
    box-shadow: 0 2px 2px rgba(20,20,20, 0.15);
  }

  &.is-inverse {
    background-color: $blue;
    transition: .3s;
    background-image: linear-gradient(
        180deg,
        rgba(152, 210, 255, 0.3) 0%,
        rgba(255, 255, 255, 0) 100%
    );
    color: $white;
    &:hover {
      background-image: linear-gradient(
          180deg,
          rgba($blue, 0.3) 0%,
          rgba($blue, 0) 100%
      );
    }
  }

  &.is-large {
    font-size: 14px;
    height: 40px;
  }

  & .icon {
    margin-right: 8px;
  }

  &.is-bordered {
    border: 1px solid $gray-blue-border;
    transition: border-color .2s, color .2s, background-color .2s;
  }

  &.is-bordered:hover {
    background-color: $blue;
    background-image: linear-gradient(
        180deg,
        rgba(152, 210, 255, 0.3) 0%,
        rgba(255, 255, 255, 0) 100%
    );
    color: $white;
  }

  &.disabled {
    opacity: .5;
    background-image: none;
    pointer-events: none;
  }

  &.disabled:not(.is-inverse) {
    border: 1px solid #fff;
  }

  &.is-add {
    position: absolute;
    top: 0;
    right: 0;
    margin-right: 0;
    min-width: 207px;
  }

  & .button-loader {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
  }
}
</style>
