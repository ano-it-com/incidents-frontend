<template>
  <div :class="$options.name">
    <div class="table-component__topic">
      <div
        v-for="(item, index) in preparedColumns"
        :key="`table-column-${index}`"
        :style="{ width: getColumnWidth(item) }"
        class="table-component__topic-item"
        @click="onColumnClick(item)"
      >
        {{ getColumnName(item) }}
        <div
          v-if="item.sortable"
          :class="[`${item.sort || ''}`]"
          class="column-sorting"
        >
          <icon
            v-if="currentSort.field === (item.sortProperty || item.value)
              && currentSort.dir === 'asc'"
            :size="10"
            name="sort-asc"
          />
          <icon
            v-else-if="currentSort.field === (item.sortProperty || item.value)
             && currentSort.dir === 'desc'"
            :size="10"
            name="sort-desc"
          />
          <icon v-else name="sort" :size="10" />
        </div>
      </div>
    </div>
    <ul v-if="list && list.length" class="table-component__list">
      <li
        v-for="rowLine in list.length"
        :key="`row-item-${rowLine}`"
        :class="getRowItemClass(rowLine)"
        class="table-component__item"
      >
        <div class="table-component__item-box table-row">
          <div
            v-for="(key, index) in columnValues"
            :key="`${rowLine}-${key}`"
            :style="{
              width: getColumnWidthByValue(key),
              justifyContent: getColumnAlignByValue(key),
            }"
            class="table-component__item-col"
          >
            <template v-if="index === 0">
              <label v-if="selectable" class="checkbox">
                <input type="checkbox" name="fake">
                <div class="checkbox__box" />
              </label>
              <div
                :class="{
                  open: openedItems.includes(rowLine),
                  disabled: !itemHasChildren(list[rowLine - 1]),
                }"
                class="table-component__item-folder folder"
                @click="onFolderClick(rowLine)"
              />
            </template>
            <slot :name="`item.${key}`" :item="list[rowLine - 1]">
              {{ getListValue(rowLine, key) }}
            </slot>
          </div>
        </div>

        <div
          v-if="itemHasChildren(list[rowLine - 1])"
          class="table-component__item-children"
        >
          <div
            v-for="childrenRowLine in list[rowLine - 1][childrenProperty].length"
            :key="`${rowLine}-${childrenRowLine}-children`"
            :class="getChildrenRowItemClass(rowLine, childrenRowLine)"
            class="table-component__item-box"
          >
            <div
              v-for="(key, index) in columnValues"
              :key="`${rowLine}-${key}`"
              :style="{
                width: getColumnWidthByValue(key),
                justifyContent: getColumnAlignByValue(key)
              }"
              class="table-component__item-col"
            >
              <template v-if="index === 0">
                <label v-if="selectable" class="checkbox">
                  <input type="checkbox" name="fake">
                  <div class="checkbox__box" />
                </label>
                <div class="table-component__item-folder subfolder" />
              </template>
              <slot
                :name="`children.${key}`"
                :item="list[rowLine - 1][childrenProperty][childrenRowLine - 1]"
                :parent="list[rowLine - 1]"
              >
                {{ getChildrenValue(rowLine, childrenRowLine, key) }}
              </slot>
            </div>
          </div>
        </div>
      </li>
    </ul>
    <div v-else class="no-data">
      <template v-if="isLoading">
        <spinner :size="56" color="#2A3F64" />
      </template>
      <template v-else>{{ noDataText || 'Список пуст' }}</template>
    </div>
  </div>
</template>

<script>
import get from 'lodash/get';
import Spinner from '@/components/UI/Spinner';

/**
 * Every item in array required value field
 * @param columns Array
 */
const columnPropertyValidation = (columns) => !!columns
  .map((_) => Object.prototype.hasOwnProperty.call(_, 'value'))
  .filter(Boolean).length;

export default {
  name: 'table-component',
  components: { Spinner },
  props: {
    list: {
      type: Array,
      default: () => ([]),
    },
    columns: {
      type: Array,
      required: true,
      validator: columnPropertyValidation,
    },
    childrenColumns: {
      type: Array,
      default: () => ([]),
    },
    childrenProperty: String,
    selectable: Boolean,
    isLoading: Boolean,
    activeRouteTracker: {
      type: Array,
      default: () => ([]),
    },
    noDataText: String,
    currentSort: {
      type: Object,
      default: () => ({}),
    },
  },
  data: () => ({
    preparedColumns: [],
    openedItems: [],
  }),
  computed: {
    getRowItemClass() {
      return (line) => ({
        open: this.openedItems.includes(line),
        'active-route': this.currentActiveRouteParamId
          && this.currentActiveRouteParamId
          === this.getListValue(line, get(this.activeRouteTrackerNow, 'param')),
      });
    },

    getChildrenRowItemClass() {
      return (rowLine, childrenRowLine) => ({
        'active-route': this.currentActiveRouteParamId
          && this.currentActiveRouteParamId
          === this.getChildrenValue(
            rowLine,
            childrenRowLine,
            get(this.activeRouteTrackerNow, this.activeRouteTrackerNow.paramGetter),
          ),
      });
    },

    getColumnName() {
      return (column) => {
        const item = this.getItemFromColumns(column);
        return get(item, 'name', item.value);
      };
    },

    getColumnWidth() {
      return (column) => {
        const item = this.getItemFromColumns(column);
        // todo sum for every width value of another columns
        return `${get(item, 'width', 100 / this.columns.length)}%`;
      };
    },

    getColumnWidthByValue() {
      return (value) => {
        const column = this.columns.find((_) => _.value === value);
        if (!column) return null;
        return this.getColumnWidth(column);
      };
    },

    getColumnAlign() {
      return (column) => {
        const item = this.getItemFromColumns(column);
        return get(item, 'align', 'flex-start');
      };
    },

    getColumnAlignByValue() {
      return (value) => {
        const column = this.columns.find((_) => _.value === value);
        if (!column) return null;
        return this.getColumnAlign(column);
      };
    },

    getItemFromColumns() {
      return (item) => {
        const needle = this.columns.find((_) => _.value === item.value);
        if (needle) return needle;

        throw Error(`Columns property doesnt have item with '${item.value}' value`);
      };
    },

    itemHasChildren() {
      return (item) => Object.prototype.hasOwnProperty.call(item, this.childrenProperty)
        && item[this.childrenProperty].length;
    },

    getListValue() {
      return (index, valueKey) => get(this.list[index - 1], valueKey, null);
    },

    getChildrenValue() {
      return (index, childrenIndex, valueKey) => get(
        this.list[index - 1][this.childrenProperty][childrenIndex - 1],
        valueKey,
        null,
      );
    },

    columnValues() {
      return this.preparedColumns.map((_) => _.value);
    },

    childrenColumnValues() {
      return this.childrenColumns.map((_) => _.value);
    },

    hasActiveRouteTracking() {
      return Array.isArray(this.activeRouteTracker) && this.activeRouteTracker.length;
    },

    activeRouteTrackerNow() {
      if (!this.hasActiveRouteTracking) return null;
      const active = this.activeRouteTracker.find((_) => _.name === this.$route.name);
      if (!active) return null;

      return {
        ...active,
        paramGetter: Object.keys(active).includes('itemParam') ? 'itemParam' : 'item',
      };
    },

    currentActiveRouteParamId() {
      const active = this.activeRouteTrackerNow;
      if (!active) return null;

      const param = get(this.$route.params, active.param, null);
      return param !== null ? parseInt(param, 10) : null;
    },
  },
  watch: {
    columns: {
      immediate: true,
      handler(columns) {
        this.preparedColumns = columns
          .map((item) => ({ sort: null, ...item }));
      },
    },
  },
  methods: {
    onFolderClick(index) {
      if (!this.itemHasChildren(this.list[index - 1])) return;

      const needleIndex = this.openedItems.findIndex((_) => _ === index);
      if (needleIndex === -1) {
        this.openedItems.push(index);
        return;
      }

      this.openedItems.splice(needleIndex, 1);
      this.openedItems = this.openedItems.filter(Boolean);
    },

    onColumnClick(item) {
      if (!item.sortable) return;

      const currentSort = { ...this.currentSort };

      const sortProperty = get(item, 'sortProperty', item.value);

      if (currentSort.field !== sortProperty) {
        currentSort.dir = null;
      }

      currentSort.field = sortProperty;

      switch (currentSort.dir) {
        case null:
          currentSort.dir = 'asc';
          break;
        case 'asc':
          currentSort.dir = 'desc';
          break;
        case 'desc':
        default:
          currentSort.field = null;
          currentSort.dir = null;
          break;
      }

      this.$emit('sort', { ...currentSort });
    },
  },
};
</script>

<style lang="scss" scoped>
@import "~@/styles/partials/params";
@import "~@/styles/partials/mixins";

.table-component {
  &__topic {
    position: relative;
    display: flex;
    background-color: $light-gray;
    border: 1px solid $gray-blue-border;
    border-radius: 4px;
    z-index: 2;

    &-item {
      position: relative;
      display: flex;
      align-items: center;
      font-size: 11px;
      font-weight: 500;
      letter-spacing: -0.1px;
      height: 36px;
      border-left: 1px solid $gray-blue-border;
      padding: 0 10px;
      cursor: pointer;
      justify-content: space-between;

      &:first-child {
        border-left: 0;
      }
    }
  }

  &__list {
    position: relative;
    list-style: none;
    z-index: 2;
  }

  &__item {
    position: relative;
    /*overflow: hidden;*/
    border: 1px solid transparent;
    border-radius: 4px;
    transition: border-color .3s;
    &::after {
      content: '';
    }

    &:nth-child(odd) {
      & > .table-component__item-box {
        background-color: $white;
        // border: 1px solid transparent;
      }
    }

    &:nth-child(even) {
      & > .table-component__item-box {
        background-color: $gray-blue-hover;
        // border: 1px solid $gray-blue-border;
      }
    }
    &:hover {

      & > .table-component__item-box {
        background-color: rgba(234,242,255,0.77);
        box-shadow: inset 0 0 0 1px #D5DFF1;
      }
    }

    & > .table-component__item-box {
      border-radius: 1px;

      & .table-component__item-folder.folder {
        position: relative;

        &::before {
          content: '';
          position: absolute;
          width: 1px;
          height: 66px;
          background-color: #98BCE1;
          top: calc(100% + 5px);
          left: 7px;
          overflow: hidden;
          opacity: 0;
          transition: opacity 0.5s ease-out;
        }
      }
    }

    & .table-component__item-children {
      & .table-component__item-box {
        & .table-component__item-folder {
          &::before {
            content: '';
            position: absolute;
            width: 1px;
            height: calc(100% + 2px);
            background-color: #98BCE1;
            top: -1px;
            left: 40px;
            opacity: 0;
            transition: opacity 0.3s;
          }

          &::after {
            content: '';
            position: absolute;
            width: 10px;
            height: 1px;
            background-color: #98BCE1;
            top: calc(50% - 1px);
            left: 40px;
            opacity: 0;
            transition: opacity 0.3s;
          }
        }
        &:last-child {
          & .table-component__item-folder {
            &::before {
              height: calc(50% + 1px);
            }
          }
        }
      }
    }

    &.open {
      box-shadow: 0 3px 7px rgba(103, 149, 176, 0.21);
      /*overflow: hidden;*/
      border: 1px solid $gray-blue-border;
      z-index: 2;

      & > .table-component__item-box {
        border-bottom-left-radius: 0;
        border-bottom-right-radius: 0;

        & .table-component__item-folder.folder {
          &::before {
            opacity: 1;
            overflow: visible;
            transition: opacity 0.5s ease-in;
          }
        }
      }

      & .table-component__item-children {
        max-height: 500px;
        overflow: visible;
        transition: max-height 0.5s ease-in;

        & .table-component__item-box {
          opacity: 1;
          overflow: visible;
          transition: opacity 0.5s ease-in;

          & .table-component__item-folder {
            &::before {
              opacity: 1;
              transition: opacity 0.3s;
            }

            &::after {
              opacity: 1;
              transition: opacity 0.3s;
            }
          }

          &:last-child {
            border-bottom-left-radius: 4px;
            border-bottom-right-radius: 4px;

            & .table-component__item-folder {
              &::before {
                height: calc(50% + 1px);
              }
            }
          }
        }
      }
    }

    &.active-route {
      border: 1px solid transparentize($blue, .77);

      &::after {
        position: absolute;
        top: 0;
        right: -1px;
        width: 4px;
        height: 100%;
        background-color: $blue;
        border-top-right-radius: 1px;
        border-bottom-right-radius: 1px;
      }
    }

    &-box{
      position: relative;
      display: flex;
      align-items: center;
      min-height: 66px;
    }

    &-col {
      display: flex;
      align-items: center;
      padding: 8px;
      font-size: 12px;
      line-height: 16px;
    }

    &-folder {
      min-width: 15px;
      width: 15px;
      height: 13px;
      margin-right: 8px;

      &.folder {
        background: url("~@/assets/icon-folder-closed.svg") no-repeat center;
        background-size: contain;
        cursor: pointer;
        transition: 0.3s;

        &.open {
          background: url("~@/assets/icon-folder-open.svg") no-repeat center;
          background-size: contain;
          transition: 0.3s;
        }

        &.disabled {
          pointer-events: none;
          opacity: .5;
        }
      }

      &.subfolder {
        background: url("~@/assets/icon-subfolder.svg") no-repeat;
        background-position: center;
        background-size: contain;
        cursor: default;
        margin-left: 23px;
      }
    }

    &-name {
      font-size: 12px;
      line-height: 16px;
      max-height: 48px;
      color: $black;
      overflow: hidden;
      text-overflow: ellipsis;
      display: -webkit-box;
      -webkit-line-clamp: 3;
      -webkit-box-orient: vertical;
      transition: 0.3s;

      &:hover {
        color: $blue;
        transition: 0.3s;
      }
    }

    &-importance {
      display: flex;
      justify-content: center;
      align-items: center;
      font-size: 12px;
      width: 26px;
      height: 26px;
      border-radius: 50%;
      border: 2px solid $white;

      &.none{
        display: none;
      }

      &.one {
        background-color: $green;
      }

      &.two {
        background-color: $yellow;
      }
    }

    &-created,
    &-author{
      display: flex;
      justify-content: center;
      align-items: center;
      font-size: 12px;
      line-height: 16px;
    }
    &-responsible{
      font-size: 12px;
      line-height: 16px;
      & span{
        font-weight: 500;
        margin-right: 4px;
      }
    }
    &-status{
      position: relative;
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 26px;
      max-width: 100%;
      padding: 1px 10px 1px 90px;
      border-radius: 2px;
      &.new{
        background-color: $gray-blue-border;
      }
      &.work{
        background-color: $yellow;
      }
    }
    &-time{
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
      &::before{
        content: '';
        position: absolute;
        left: 5px;
        top: 50%;
        transform: translateY(-50%) rotate(-90deg);
        width: 12px;
        height: 12px;
        background: url("~@/assets/icon-time-black.svg") no-repeat;
        background-position: center;
        background-size: contain;
      }
      &::after{
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
      &.red{
        background-color: $red;
        color: $white;
        &::before{
          background: url("~@/assets/icon-time-white.svg") no-repeat;
          background-position: center;
          background-size: contain;
        }
        &::after{
          border-left: 8px solid $red;
        }
      }
    }
    &-type{
      font-size: 11px;
      text-align: center;
    }
    &-children{
      position: relative;
      overflow: hidden;
      transition: max-height 0.5s ease-out;
      max-height: 0;

      & .table-component__item-box {
        min-height: 50px;
        background-color: $white;
        border-top: 1px solid $gray-blue-border;
        overflow: hidden;
        opacity: 0;
        transition: opacity 0.5s ease-out;
        /*border: 1px solid transparent;*/

        &::after {
          content: '';
        }

        &.active-route {
          &::after {
            position: absolute;
            top: 0;
            right: 0;
            width: 3px;
            height: 100%;
            background-color: $blue;
          }
        }
      }
    }
  }

  & .no-data {
    height: 120px;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 14px;
    color: $gray;
  }
}
</style>
