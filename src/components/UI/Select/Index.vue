<template>
  <div
    v-clickaway="onClickAway"
    :class="{ 'is-small': small, 'is-large': large, 'is-inverse': inverse }"
    class="select-component"
  >
    <div
      :class="{ active: isActive }"
      class="select-component-selected"
      @click="isActive = !isActive"
    >
      <template v-if="value">
        <template v-if="!multiselect">
          {{ selectedText }}
        </template>
      </template>
      <template v-else-if="!withoutPlaceholder">
        <span class="select-component-placeholder" v-text="placeholder" />
      </template>
    </div>
    <ul :class="{ active: isActive }" class="select-component-list">
      <template v-if="!list || !list.length">
        <li class="select-component-item disabled">Список пуст</li>
      </template>
      <li
        v-for="(item, index) in list"
        :key="`select-item-${index}`"
        :class="{ selected: item === value }"
        class="select-component-item"
        @click="onItemClick(item)"
      >
        {{ item[valueField] || item }}
      </li>
    </ul>
  </div>
</template>

<script>
import { directive as clickaway } from 'vue-clickaway';

export default {
  name: 'select-component',
  directives: { clickaway },
  model: {
    event: 'change',
    prop: 'value',
  },
  props: {
    list: {
      type: Array,
      default: () => ([]),
    },
    placeholder: {
      type: String,
      default: 'Выберите из списка',
    },
    value: [Number, String, Object, Array],
    idField: String,
    valueField: String,
    multiselect: Boolean,
    withoutPlaceholder: Boolean,
    small: Boolean,
    inverse: Boolean,
    large: Boolean,
    returnObject: Boolean,
  },
  data: () => ({
    isActive: false,
  }),
  computed: {
    selectedText() {
      if (Array.isArray(this.value)) {
        return this.value.map((_) => _[this.valueField] || _.value).join(', ');
      }

      if (typeof this.value === 'object' && this.value !== null) {
        return this.value[this.valueField] || this.value.value;
      }

      const reference = this.list.find((_) => _[this.idField] === this.value);
      if (reference) return reference[this.valueField];

      return this.value;
    },
  },
  methods: {
    onItemClick(item) {
      const readyValue = this.getSelectedValue(item);
      this.$emit('change', readyValue);
      this.isActive = false;
    },

    getSelectedValue(item) {
      if (this.returnObject && typeof item === 'object') return item;

      if (typeof item === 'object') {
        return item[this.idField] || item.id;
      }

      return item;
    },

    onClickAway() {
      this.isActive = false;
    },
  },
};
</script>

<style lang="scss" scoped>
@import "~@/styles/partials/mixins";
@import "~@/styles/partials/params";

.select-component {
  position: relative;
  width: auto;
  height: 40px;
  font-size: 14px;

  &.is-small {
    height: 32px;
    font-size: 12px;

    .select-component-item,
    .select-component-selected {
      height: 32px;
    }
  }

  &-item,
  &-selected {
    position: relative;
    display: flex;
    align-items: center;
    width: 100%;
    height: 40px;
    font-weight: 500;
    background-color: $white;
    padding: 0 36px 0 8px;
    cursor: pointer;
  }

  &-placeholder {
    font-weight: 300;
    color: #9F9F9F;
  }

  &-selected {
    border-radius: 2px;
    border: 1px solid $gray-blue-border;
    background-color: $light-gray;
    overflow: hidden;
    color: $blue;
    font-weight: 400;
    font-size: 12px;

    &::before {
      content: "";
      position: absolute;
      width: 1px;
      height: 100%;
      background-color: $gray-blue-border;
      right: 28px;
      top: 0;
    }

    &::after {
      content: "";
      background: url("~@/assets/icon-arrow.svg") no-repeat center;
      background-size: contain;
      width: 6px;
      height: 11px;
      position: absolute;
      transform: translate(-50%, -50%) rotate(90deg);
      top: 50%;
      right: 8px;
      transition: 0.3s;
    }

    &.active {
      border-radius: 2px 2px 0 0;
      &::after {
        transform: translate(-50%, -50%) rotate(270deg);
        transition: 0.3s;
      }
    }
  }

  &.is-inverse {
    .select-component-selected {
      background-color: white;
    }
  }

  &-item {
    &:hover {
      background-color: $gray-blue-border;
    }

    &.selected {
      background-color: $gray-blue-border;
      pointer-events: none;
    }

    &.disabled {
      pointer-events: none;
      color: #9F9F9F;
    }
  }

  &-list {
    position: absolute;
    width: 100%;
    background-color: $white;
    border: 1px solid $gray-blue-border;
    box-shadow: 0 2px 2px rgba(100,100,100, 0.15);
    max-height: 112px;
    overflow-x: hidden;
    overflow-y: scroll;
    border-radius: 0 0 0 2px;
    pointer-events: none;
    visibility: hidden;
    opacity: 0;
    z-index: 1;

    &.active {
      visibility: visible;
      opacity: 1;
      pointer-events: auto;
    }

    &::-webkit-scrollbar {
      -webkit-appearance: none;
      height: 4px;
      width: 4px;
      cursor: pointer;
    }

    &::-webkit-scrollbar-track {
      -webkit-box-shadow: inset 0 0 4px #f7f7f7;
    }

    &::-webkit-scrollbar-thumb {
      background-color: $gray-blue-border;
      border-radius: 2px;
      outline: none;
      background-clip: border-box;
      cursor: pointer;
    }
  }
}
</style>
