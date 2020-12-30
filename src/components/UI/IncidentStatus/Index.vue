<template>
  <div :class="[$options.name, code, { 'without-timer': timeToLeave === 0 }]">
    <div v-if="timeToLeave" class="incident-status-component-time">23:00:43</div>
    <div class="incident-status-component-type" v-text="title" />
  </div>
</template>

<script>
export default {
  name: 'incident-status-component',
  props: {
    code: String,
    title: String,
    createdAt: Number,
    timeToLeave: Number,
  },
};
</script>

<style lang="scss" scoped>
@import "~@/styles/partials/params";
@import "~@/styles/partials/mixins";

.incident-status-component {
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 26px;
  max-width: 100%;
  padding: 1px 10px 1px 90px;
  border-radius: 2px;
  background-color: $gray-blue-border;

  &.without-timer {
    padding-left: 10px;
  }

  &.in_work {
    background-color: $yellow;
  }

  &-time {
    position: absolute;
    display: flex;
    align-items: center;
    font-size: 11px;
    font-weight: 500;
    background-color: $white;
    color: $black;
    height: 24px;
    width: 71px;
    padding: 2px 0 0 22px;
    border-radius: 2px 0 0 2px;
    left: 1px;
    top: 1px;

    &::before {
      content: '';
      position: absolute;
      left: 5px;
      top: 50%;
      transform: translateY(-50%) rotate(-90deg);
      width: 12px;
      height: 12px;
      background: url("~@/assets/icon-time-black.svg") no-repeat center;
      background-size: contain;
    }

    &::after {
      content: '';
      position: absolute;
      right: -16px;
      top: 50%;
      transform: translateY(-50%);
      width: 0;
      height: 0;
      border-top: 12px solid transparent;
      border-right: 8px solid transparent;
      border-bottom: 12px solid transparent;
      border-left: 8px solid $white;
    }

    &.red {
      background-color: $red;
      color: $white;

      &::before {
        background: url("~@/assets/icon-time-white.svg") no-repeat center;
        background-size: contain;
      }

      &::after {
        border-left: 8px solid $red;
      }
    }
  }

  &-type {
    font-size: 11px;
    text-align: center;
  }
}
</style>
