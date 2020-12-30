<template>
  <div :class="$options.name">
    <div class="breadcrumbs-block">
      <div class="breadcrumbs">
        <router-link class="breadcrumbs__link link" :to="{ name: 'incidents-list' }">
          Список инцидентов
        </router-link>
        <span>/</span>
        <p class="breadcrumbs__link" v-text="single.title" />
      </div>
      <a href="" class="link link__back">
        <icon name="back-arrow" class="icon" :size="12" />
        Вернуться назад
      </a>
    </div>
    <div class="left-block">
      <div class="info-panel__block">
        <div class="info-panel__id">{{ `id ${single.id}` }}</div>
        <div class="info-panel__date">{{ single.createdAt | timestampToDate }}</div>
        <a class="info-panel__author link tooltip-show " href="#">
          {{ single.createdBy.firstName }} {{ single.createdBy.lastName }}
          <tooltip-component
            class="left"
            label="Автор инцидента"
          />
        </a>
      </div>

      <h1 class="title" v-text="single.title" />

      <div class="page__description" v-html="single.description" />

      <div v-if="single.actions && single.actions.length" class="creation__box">
        <h2 class="title">Действия <sup v-text="single.actions.length" /></h2>

        <incident-actions-list
          :incident-id="single.id"
          :list="single.actions"
          class="actions-list"
        />
      </div>
    </div>

    <div class="right-block">
      <div v-if="single.rights.canEditIncident" class="information__top">
        <router-link
          :to="{ name: 'incidents-edit', params: { id: single.id } }"
          class="information__edit link link__edit"
        >
          <icon name="pencil" class="icon" :size="9" />
          Редактировать инцидент
        </router-link>
      </div>

      <div class="status-panel">
        <div class="status-panel-text">Статус инцидента</div>
        <incident-status
          :code="single.status.code"
          :title="single.status.title"
          :time-to-leave="single.status.ttl"
          class="status-panel-block"
          bordered
        />
      </div>

      <handler-properties-resolver
        :handler="getTypeHandler(single.type.handler)"
        :values="single.info"
        type="view"
      />

      <template v-if="single.files.length">
        <div class="information__top information__files">
          <div class="title">Файлы <sup v-text="single.files.length" /></div>
        </div>

        <incident-files-list :list="single.files" full-width />
      </template>

      <tabs-component class="information__additional-info">
        <tab-item-component :id="1" name="Комментарии" :count="single.comments.length">
          <commentaries-component :comments="single.comments" :current-user="profile" />
        </tab-item-component>

        <tab-item-component
          v-if="history && history.length"
          :id="2"
          name="История изменений"
          :count="history.length"
        >
          <item-history-component :list="history" />
        </tab-item-component>
      </tabs-component>
    </div>
  </div>
</template>

<script>
import { mapState, mapGetters } from 'vuex';
import { TabsComponent, TabItemComponent } from '@/components/UI/Tabs';
import TooltipComponent from '@/components/UI/Tooltip';
import CommentariesComponent from '@/components/Commentaries';
import ItemHistoryComponent from '@/components/ItemHistory';
import HandlerPropertiesResolver from '@/components/HandlerPropertiesResolver';
import IncidentActionsList from './components/IncidentActionsList.vue';
import IncidentStatus from './components/IncidentStatus.vue';
import IncidentFilesList from './components/IncidentFilesList.vue';

export default {
  name: 'incidents-single-item-view',
  components: {
    IncidentActionsList,
    IncidentStatus,
    IncidentFilesList,
    TabsComponent,
    TabItemComponent,
    CommentariesComponent,
    ItemHistoryComponent,
    HandlerPropertiesResolver,
    TooltipComponent,
  },
  async asyncData({ store, route }) {
    const id = +route.params.id;
    await store.dispatch('incidents/getItem', id);
    const history = await store.dispatch('incidents/getIncidentItemHistory', id);

    return { history };
  },
  data: () => ({
    history: null,
  }),
  computed: {
    ...mapState('incidents', ['single']),
    ...mapGetters(['profile']),
    ...mapGetters('incidents', ['getTypeHandler']),
  },
};
</script>

<style lang="scss" scoped>
@import "~@/styles/partials/mixins";
@import "~@/styles/partials/params";
.detail {

  & .container {
    margin: 0;
  }

  & .incident-item__top {
    margin-bottom: 20px;
  }

  & .incident-item__description {
    font-size: 16px;
    line-height: 28px;
    margin-top: 16px;
  }

  & .creation__box {
    margin-top: 40px;
    position: relative;
    margin-bottom: 40px;

    &-top {
      display: flex;
      justify-content: space-between;
      align-items: center;

      & .title {
        font-size: 21px;
        line-height: 32px;
        margin-bottom: 20px;
      }
    }
  }

  &__list {
    position: relative;
    list-style: none;
  }

  &__item {
    position: relative;
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-radius: 2px;
    padding: 12px 16px;

    &:nth-child(odd) {
      background-color: $light-gray;

      & .operation__item-right.request {
        background-color: $light-gray;

        &:before {
          background: linear-gradient(to right, transparent, $light-gray);
        }
      }
    }

    &:nth-child(even) {
      background-color: $white;

      & .operation__item-right.request {
        background-color: $white;
      }
    }

    & .incident__author {
      margin-right: 10px;
    }

    & .fake__item-time {
      margin-left: 10px;
    }

    & .operation__item-right {
      min-height: 32px;
    }

    & .fake__item-delete {
      margin-left: 20px;
    }
  }
}

.incident-item__status {
  max-width: 100%;
  margin: 12px 0 0;
}
</style>
