<template>
  <section :class="$options.name">
    <div class="container">
      <div class="incidents-list-view__up">
        <h1 class="title">Список инцидентов</h1>

        <div class="incidents-list-view__up--toolbox">
          <form name="search" @submit.prevent="">
            <!-- todo make cancelable request for search -->
            <input-component
              v-model="filter.title"
              class="search-input"
              placeholder="Поиск"
              icon="search"
            >
              <div
                :class="{ active: filterIsActive }"
                class="filter-button"
                slot="suffix"
                @click="filterIsActive = !filterIsActive"
              >
                <icon :size="14" name="filter" />
              </div>
            </input-component>
          </form>
        </div>
      </div>

      <!-- todo: make as individual component (Markin) -->
      <div :class="{ active: filterIsActive }" class="list-filters">
        <icon
          v-if="false"
          :size="15"
          name="close"
          class="list-filters__close"
          stroke
          @click="filterIsActive = !filterIsActive"
        />

        <div class="list-filters__caption">Фильтр</div>

        <div class="list-filters__content">
          <div class="list-filters__item">
            <label>Автор</label>
            <select-component
              v-model="filter.created_by_id"
              :list="availableFilters.created_by_id"
              id-field="id"
              value-field="title"
              small
              inverse
            />
          </div>

          <div class="list-filters__item">
            <label>Статус</label>
            <select-component
              v-model="filter.status_code"
              :list="availableFilters.status_code"
              id-field="id"
              value-field="title"
              small
              inverse
            />
          </div>
        </div>
        <div class="list-filters__buttons">
          <button-component
            class="list-filters__buttons-item"
            bordered
            label="Сбросить"
            @click="onFilterResetClick"
          />

          <button-component class="list-filters__buttons-item" inverse label="Применить" />
        </div>
      </div>

      <div class="incidents-list-view__wrapper">
        <table-component
          :columns="tableColumns"
          :list="list"
          :active-route-tracker="[
            { name: 'incidents-list-side-incident', param: 'id' },
            { name: 'incidents-list-side-incident-action', param: 'actionId', itemParam: 'id' },
          ]"
          :class="['incidents-table', { 'is-loading': isLoading }]"
          :is-loading="isLoading"
          :current-sort="sorting"
          no-data-text="По вашему запросу ничего не найдено"
          children-property="actions"
          selectable
          @sort="onSorting"
        >
          <template #item.title="{ item }">
            <router-link
              :to="sideViewRouteWithOptions(item.id)"
              class="name-item__link"
              v-text="item.title"
            />
          </template>

          <template #item.createdAt="{ item }">
            <span>{{ item.createdAt | timestampToDate }}</span>
          </template>

          <template #item.createdBy="{ item }">
            <v-popover trigger="hover" placement="top">
              <a href="#" class="link">
                {{ item.createdBy.firstName }} {{ item.createdBy.lastName }}
              </a>

              <user-popover :user="item.createdBy" slot="popover" />
            </v-popover>
          </template>

          <template #item.status="{ item }">
            <incident-status
              name="Новый"
              :code="item.status.code"
              :title="item.status.title"
              :time-to-leave="item.status.ttl"
              :created-at="item.status.createdAt"
            />
          </template>

          <template #children.title="{ item, parent }">
            <router-link
              :to="sideActionViewRouteWithOptions(parent.id, item.id)"
              class="name-item__link"
              v-text="item.type.title"
            />
          </template>

          <template #children.createdAt="{ item }">
            <span>{{ item.createdAt | timestampToDate }}</span>
          </template>

          <template #children.createdBy="{ item }">
            <a href="#" class="link">
              {{ item.createdBy.firstName }} {{ item.createdBy.lastName }}
            </a>
          </template>

          <template #children.status="{ item, parent }">
            <status-actions-resolver
              :incident-id="parent.id"
              :action-ids="[item.id]"
              :status="item.status"
              :rights="item.rights"
              :update-callback-func="statusChangedCallback(parent.id)"
              bordered-button
              large
            />
          </template>

          <template #children.responsibleGroup="{ item }">
            <div class="responsible-text">
              {{ item.responsibleGroup.title }}
              <span v-if="item.responsibleUser">/</span>
              <a v-if="item.responsibleUser" href="#" class="link">
                {{ item.responsibleUser.firstName }} {{ item.responsibleUser.lastName }}
              </a>
            </div>
          </template>
        </table-component>
      </div>

      <div v-if="list && list.length && paginationMeta" class="incidents-list-view__down">
        <pagination-component
          :page="paginationMeta.currentPage"
          :per-page="paginationMeta.perPage"
          :total="paginationMeta.total"
          :pages-count="paginationMeta.pagesCount"
          @change="pageSettings.page = $event"
        />

        <div class="shown" v-text="ItemInViewCountText" />

        <div class="per-page__select">
          <div class="per-page__select-text">Показывать по</div>
          <select-component
            :value="pageSettings.perPage"
            :list="itemsOnPageList"
            small
            @change="onPerPageSelected"
          />
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import { mapState, mapActions, mapGetters } from 'vuex';
import moment from 'moment';
import qs from 'qs';
import debounce from 'lodash/debounce';
import InputComponent from '@/components/UI/Input';
import ButtonComponent from '@/components/UI/Button';
import TableComponent from '@/components/UI/Table';
import PaginationComponent from '@/components/UI/Pagination';
import SelectComponent from '@/components/UI/Select';
import UserPopover from '@/components/UI/Popovers/UserPopover.vue';
import IncidentStatus from './components/IncidentStatus.vue';
import StatusActionsResolver from './components/StatusActionsResolver.vue';

const getQueryStringFromRouteObject = (route) => {
  const data = route.fullPath.split('?');
  if (data.length === 1) return '';
  return data.pop();
};

// eslint-disable-next-line no-unused-vars
const getQueryObjectFromRoute = (route) => {
  const queryString = decodeURI(getQueryStringFromRouteObject(route));
  return qs.parse(queryString, {
    decoder: (val) => {
      const value = parseInt(val, 10);
      if (!Number.isNaN(value)) return value;
      return val;
    },
  });
};

const createDefaultFilter = () => ({
  created_by_id: null,
  locations: [],
  categories: [],
  status_code: null,
  importance: null,
  title: null,
});

const createDefaultSorting = () => ({
  field: 'date',
  dir: 'desc',
});

const createDefaultPageSettings = () => ({
  perPage: 15,
  page: 1,
});

export default {
  name: 'incidents-list-view',
  async prefetch() {
    if (this.$route.params && this.$route.params.client) return;

    const queryData = getQueryObjectFromRoute(this.$route);
    await this.reloadListData(queryData);
    // await store.dispatch('incidents/getMeta');
  },
  metaInfo: {
    title: 'Список инцидентов',
  },
  components: {
    InputComponent,
    ButtonComponent,
    TableComponent,
    PaginationComponent,
    SelectComponent,
    IncidentStatus,
    StatusActionsResolver,
    UserPopover,
  },
  data: () => ({
    tableColumns: [
      {
        value: 'title',
        name: 'Название',
        sortable: true,
        width: 31.25,
      },
      {
        value: 'importance',
        name: 'Критич.',
        align: 'center',
        width: 8.33,
      },
      {
        value: 'createdAt',
        name: 'Создана',
        sortable: true,
        sortProperty: 'date',
        width: 8.75,
      },
      {
        value: 'createdBy',
        name: 'Автор',
        sortable: false,
        width: 10.83,
      },
      {
        value: 'responsibleGroup',
        name: 'Ответств. направ.',
        sortable: false,
        width: 22.29,
      },
      {
        value: 'status',
        name: 'Статус',
        sortable: true,
        sortProperty: 'status_code',
        align: 'flex-end',
        width: 18.54,
      },
    ],
    tableChildrenLink: [
      { to: 'title', value: 'title' },
      { to: 'status', value: 'status' },
      { to: 'createdAt', value: 'createdAt' },
      { to: 'createdBy', value: 'createdBy' },
      { to: 'responsibleGroup', value: 'responsibleGroup' },
      { to: 'responsibleUser', value: 'responsibleUser' },
      { to: 'itemActions', value: 'itemActions' },
    ],
    itemsOnPageList: [5, 15, 30, 50, 100],
    pageSettings: createDefaultPageSettings(),
    filter: createDefaultFilter(),
    sorting: createDefaultSorting(),
    isLoading: false,
    filterIsActive: false,
  }),
  watch: {
    pageSettings: {
      deep: true,
      handler: 'reloadListData',
    },
    currentFilters: {
      deep: true,
      handler() {
        this.debouncedReloadListData();
      },
    },
  },
  computed: {
    ...mapState('incidents', ['list', 'paginationMeta']),
    ...mapGetters('incidents', ['availableFilters']),

    formatDate() {
      return (object) => moment.unix(object).format('DD.MM.YYYY H:m:s');
    },

    ItemInViewCountText() {
      const totalInView = this.paginationMeta.perPage <= this.paginationMeta.total
        ? this.paginationMeta.perPage : this.paginationMeta.total;

      return `Всего показано ${totalInView} из ${this.paginationMeta.total}`;
    },

    sideViewRouteWithOptions() {
      return (id) => ({ name: 'incidents-list-side-incident', params: { id, client: true } });
    },

    sideActionViewRouteWithOptions() {
      return (incidentId, actionId) => ({
        name: 'incidents-list-side-incident-action',
        params: { incidentId, actionId, client: true },
      });
    },

    currentFilters() {
      return {
        filter: this.filter,
        sort: this.sorting,
        page: this.pageSettings.page,
        perPage: this.pageSettings.perPage,
      };
    },
  },
  created() {
    const reloadListData = debounce(this.reloadListData, 400);
    this.debouncedReloadListData = (...args) => {
      this.isLoading = true;
      reloadListData(...args);
    };
  },
  methods: {
    ...mapActions('incidents', ['getList', 'getItemWithListUpdate']),

    async reloadListData(additional = {}) {
      console.log(this.currentFilters.filters);
      try {
        this.isLoading = true;
        await this.getList({ ...this.currentFilters, ...additional });
      } finally {
        this.isLoading = false;
      }
    },

    onSorting(sort) {
      this.sorting = sort;
    },

    onPerPageSelected(itemsCount) {
      this.pageSettings.perPage = itemsCount;
      this.pageSettings.page = 1;
    },

    onFilterResetClick() {
      this.filter = createDefaultFilter();
      this.filterIsActive = false;
    },

    statusChangedCallback(itemId) {
      // eslint-disable-next-line no-return-await
      return async () => await this.getItemWithListUpdate(itemId);
    },
  },
};
</script>

<style lang="scss" scoped>
@import "~@/styles/partials/mixins";
@import "~@/styles/partials/params";

.incidents-list-view {
  position: relative;
  padding: 0 0 ($mm-value * 10) + px;
  margin-top: ($mm-value * 4) + px;

  &__up,
  &__up--toolbox,
  &__down{
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  &__down {
    .shown {
      position: relative;
      font-weight: 500;
      font-size: 12px;
    }

    .per-page__select {
      position: relative;
      display: flex;
      align-items: center;

      &-text {
        font-size: 12px;
        font-weight: 500;
        margin-right: 12px;
      }
    }
  }

  .filter-button {
    position: absolute;
    right: 0;
    top: -1;
    border-top-right-radius: 4px;
    border-bottom-right-radius: 4px;
    width: 38px;
    height: 38px;
    background-color: transparent;
    display: flex;
    justify-content: center;
    align-items: center;
    color: $darkblue;
    transition: background-color .3s, color .3s;
    cursor: pointer;

    &.active {
      color: $white;
      background-color: $blue;
    }

    &:hover:not(.active) {
      background-color: $gray-blue-border;
    }
  }

  .list-filters {
    position: relative;
    display: flex;
    flex-direction: column;
    width: 100%;
    background-color: $light-gray;
    border-radius: 4px;
    z-index: 2;
    opacity: 0;
    overflow: hidden;
    margin-top: 0;
    padding: 0 16px;
    height: 0;
    border: 1px solid transparent;
    transition: height .3s ease-in,
      padding .3s ease-in,
      opacity .3s ease-in,
      margin .3s ease-in;

    &::after {
      content: '';
      position: absolute;
      top: 1px;
      right: 19px;
      width: 19px;
      height: 19px;
      background-color: $light-gray;
      transform: translate(50%,-50%) rotate(45deg);
    }

    &::before {
      content: '';
      position: absolute;
      top: 0;
      right: 19px;
      width: 20px;
      height: 20px;
      background-color: $light-gray;
      border: 1px solid $gray-blue-border;
      z-index: -1;
      transform: translate(50%,-50%) rotate(45deg);
    }

    &.active {
      border-color: $gray-blue-border;
      padding: 16px;
      height: 175px;
      opacity: 1;
      overflow: visible;
      margin-top: 25px;
    }

    &__close {
      position: absolute;
      top: 22px;
      right: 16px;
      cursor: pointer;
      color: $close-color;

      &:hover {
        color: $blue;
      }
    }

    &__caption {
      font-family: Ruda,sans-serif;
      font-weight: 800;
      font-size: 16px;
      line-height: 28px;
    }

    &__content {
      position: relative;
      display: flex;
      justify-content: flex-start;
      margin-top: 12px;
    }

    &__item {
      width: calc(20% - 19px);
      margin-right: 19px;

      label {
        display: inline-flex;
        font-size: 12px;
        line-height: 14px;
        font-weight: 500;
        letter-spacing: .29px;
        margin-bottom: 7px;
      }
    }

    &__buttons {
      display: flex;
      align-self: flex-end;
      justify-content: flex-end;
      width: 100%;
      align-items: center;
      margin-top: 16px;

      &-item + .list-filters__buttons-item {
        margin-left: 16px;
      }
    }

  }

  &__wrapper {
    position: relative;
    overflow: hidden;
    margin: ($mm-value * 4) + px 0;
  }

  &__up--toolbox {
    .search-input {
      min-width: 295px;
    }

    .display {
      position: relative;
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 1px;
      background-color: $light-gray;
      border: 1px solid $gray-blue-border;
      border-radius: 4px;
      overflow: hidden;

      &__type {
        display: flex;
        justify-content: center;
        align-items: center;
        width: 36px;
        height: 36px;
        background-color: transparent;
        transition: 0.3s;

        &.active{
          background-color: $white;
          border-radius: 4px;
          box-shadow: 0 3px 5px rgba(20,20,20, 0.15);
          transition: 0.3s;
        }

        & img {
          width: 14px;
        }
      }
    }
  }
}

.incidents-table {
  transition: opacity .3s;
  opacity: 1;

  &.is-loading {
    opacity: .4;
  }
}

::v-deep .incidents-table {
  .active-route .table-row, .table-component__item-box.active-route {
    .name-item__link {
      font-weight: 500;
    }
  }
}

.name-item__link {
  max-height: 48px;
  color: #000;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  transition: color .3s;

  &.router-link-active {
    pointer-events: none;
  }

  &:hover {
    color: $blue;
  }
}

.responsible-text {
  font-weight: 500;

  span {
    font-weight: 400;
    color: $gray;
  }
}
</style>
