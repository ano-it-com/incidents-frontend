<template>
  <div class="dropdown-button-component">
    <div class="dropdown-button-component-main">
      <slot></slot>
    </div>
    <ul class="dropdown-button-component-list">
      <template v-if="list !== null">
        <li
          v-for="(item, index) in list"
          :key="index"
          @click="$emit('selected', item)"
        >
          {{ item.title }}
        </li>
      </template>
      <slot v-else name="list"></slot>
    </ul>
  </div>
</template>

<script>
export default {
  name: 'dropdown-button-component',
  props: {
    list: {
      type: Array,
      default: null,
    },
  },
};
</script>

<style lang="scss" scoped>
@import "~@/styles/partials/params";
@import "~@/styles/partials/mixins";

.dropdown-button-component {
  display: inline-block;
  position: relative;
  height: 32px;
  z-index: 2;
  &:hover{
    & .dropdown-button-component-main{
      &:after{
        transform: translate(-50%, -50%) rotate(270deg);
        transition: 0.3s;
      }
    }
    & .dropdown-button-component-list{
      visibility: visible;
      opacity: 1;
      pointer-events: auto;
      transition: opacity 0.5s ease-out;
    }
  }
  &-main{
    position: relative;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 12px;
    font-weight: 500;
    width: 100%;
    height: 32px;
    color: $white;
    border-radius: 4px;
    background-color: $blue;
    background-image: linear-gradient(
        180deg,
        rgba(152, 210, 255, 0.3) 0%,
        rgba(255, 255, 255, 0) 100%
    );
    padding: 0 47px 0 15px;
    overflow: hidden;
    cursor: pointer;
    &:before{
      content: "";
      position: absolute;
      width: 32px;
      height: 32px;
      background-color: transparentize(#fff, .90);
      right: 0;
      top: 0;
    }
    &:after{
      content: "";
      background: url("~@/assets/icon-arrow-white.svg") no-repeat;
      background-position: center;
      background-size: contain;
      width: 6px;
      height: 11px;
      position: absolute;
      transform: translate(-50%, -50%) rotate(90deg);
      top: 50%;
      right: 10px;
      transition: 0.3s;
    }
    & i{
      margin-right: 6px;
      line-height: 12px;
    }
    & svg{
      width: 12px;
      height: 12px;
      fill: $white;
    }
  }
  &-list{
    position: absolute;
    top: 32px;
    left: 0;
    width: 100%;
    list-style: none;
    background-color: $white;
    border-radius: 4px;
    overflow: hidden;
    box-shadow: 0 11px 29px rgba(11, 66, 136, 0.2), 0 -1px 9px rgba(11, 66, 136, 0.07);
    transition: opacity 0.5s ease-in;
    pointer-events: none;
    visibility: hidden;
    opacity: 0;
  }
  li:not(.list-header){
    font-size: 12px;
    line-height: 16px;
    padding: 8px 16px;
    cursor: pointer;
    //border-top: 1px solid $gray-blue-border;
    //&:first-child{
    //  border-top: none;
    //}
    &:hover{
      background-color: $gray-blue-border;
    }
  }
  li.list-header{
    font-size: 11px;
    font-weight: 500;
    line-height: 16px;
    padding: 8px 16px;
    cursor: default;
    border-top: 1px solid $gray-blue-border;
  }
}
</style>
