<template>
  <div
    class="tooltip-component"
    :class="[position]"
  >
    {{ label }}
  </div>
</template>

<script>
export default {
  name: 'tooltip-component',
  props: {
    position: {
      type: String,
      validator: (value) => ['top', 'left', 'right', 'bottom'].includes(value),
    },
    label: String,
  },
};
</script>

<style lang="scss">
@import "~@/styles/partials/params";
@import "~@/styles/partials/mixins";

.tooltip-show {
  position: relative;
  &:hover {
    .tooltip-component {
      opacity: 1;
      visibility: visible;
    }
  }
}

.tooltip-component {
  position: absolute;
  display: block;
  font-size: 12px;
  line-height: 1.2;
  letter-spacing: .2px;
  font-weight: 400;
  font-style: normal;
  width: 275px;
  color: $white;
  padding: ($mm-value * 2) + px ($mm-value * 2) + px;
  border-radius: 6px;
  background-color: rgba($darkblue, 0.9);
  text-align: left;
  z-index: 10;
  opacity: 0;
  visibility: hidden;
  pointer-events: none;
  transition: 0.5s;
  &:after {
    content: '';
    position: absolute;
    width: 0;
    height: 0;
    border: 6px solid transparent;
    border-right: 6px solid rgba($darkblue, 0.9);
  }

  &.left {
    top: 50%;
    left: calc(100% + 8px);
    transform: translateY(-50%);
    width: auto;
    max-width: 275px;
    min-width: 130px;
    &:after{
      top: 50%;
      transform: translateY(-50%);
      left: -12px;
    }
  }

  &.right {
    &:after{
      top: 50%;
      transform: translateY(-50%);
      left: -12px;
    }
  }

  &.top {
    bottom: calc(100% + #{($mm-value * 2) + px});
    left: 0;
    width: auto;
    max-width: 275px;
    min-width: 130px;
    &:after{
      bottom: -12px;
      transform: translateX(-50%) rotate(-90deg);
      left: 20px;

    }
  }

  &.bottom {
    &:after{
      top: 50%;
      transform: translateY(-50%);
      left: -12px;
    }
  }
}
</style>
