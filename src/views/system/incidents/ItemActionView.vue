<template>
   <div :class="$options.name">
     <div class="breadcrumbs-block">
       <div class="breadcrumbs">
         <router-link
           class="breadcrumbs__link link"
           :to="{ name: 'incidents-list' }"
         >
           Список фейков
         </router-link>
         <span>/</span>
         <p class="breadcrumbs__link">Солдат срочник расстрелял трех сослуживцев,
           после чего скрылся с оружием</p>
       </div>

       <a href="#" class="link link__back" @click.prevent="$router.back()">
         <icon name="back-arrow" class="icon" :size="12" />
         Вернуться назад
       </a>
     </div>
     <div class="left-block">
       <div class="info-panel__block">
         <div class="info-panel__id">id {{ singleAction.id }}</div>
         <div class="info-panel__date">{{ singleAction.createdAt | timestampToDate }}</div>
         <a class="info-panel__author link tooltip-show" href="#" @click.prevent>
           {{ singleAction.createdBy.firstName }} {{ singleAction.createdBy.lastName }}

           <tooltip-component
             class="left"
             label="Автор инцидента"
           />
         </a>
       </div>

       <h1 class="title">
         {{ singleAction.type.title }} <span>|</span> {{ singleAction.responsibleGroup.title }}
       </h1>
       <div class="incident-item__parent">
         Инцидент:
         <router-link
           :to="{ name: 'incidents-item-view', params: { id: single.id } }"
           class="link"
           v-text="single.title"
         />
       </div>

       <div class="creation__box">
         <h2 class="title">Рекомендации <sup v-text="singleAction.actionTasks.length" /></h2>
         <button-component
           icon="plus"
           class="is-add"
           inverse
           label="Добавить рекомендацию"
         />
         <recommendation-list
           :list="singleAction.actionTasks"
           @edit-report="$modal.show('action-task-add-report-modal')"
         />
       </div>
     </div>

     <div class="right-block">
       <div class="information__top">
         <router-link
           to=""
           class="information__edit link link__edit"
         >
           <icon name="pencil" class="icon" :size="9" />
           Редактировать действие
         </router-link>
       </div>

       <div class="incident-item__action-buttons">
         <status-actions-resolver
           :incident-id="single.id"
           :action-ids="[singleAction.id]"
           :status="singleAction.status"
           :rights="singleAction.rights"
           class="status-resolver"
           inverse-button
           large
           without-timer
         />
       </div>

       <div class="status-panel">
         <div class="status-panel-text">Статус действия</div>
         <incident-status
           :code="singleAction.status.code"
           :title="singleAction.status.title"
           :time-to-leave="singleAction.status.ttl"
           :created-at="singleAction.status.createdAt"
           class="status-panel__status-block"
           bordered
         />
       </div>

       <tabs-component class="action-tabs">
         <tab-item-component :id="1" name="Комментарии" :count="singleAction.comments.length">
           <commentaries-component :comments="singleAction.comments" :current-user="profile" />
         </tab-item-component>

         <tab-item-component
           v-if="history && history.length"
           :id="2"
           :count="history.length"
           name="История изменений"
         >
           <item-history-component :list="history" />
         </tab-item-component>
       </tabs-component>
     </div>

     <action-task-update-report-modal @save="onTaskReportSave" />
     <action-task-report-viewer-modal />
   </div>
</template>

<script>
import { mapGetters, mapState, mapActions } from 'vuex';
import ButtonComponent from '@/components/UI/Button';
import { TabsComponent, TabItemComponent } from '@/components/UI/Tabs';
import CommentariesComponent from '@/components/Commentaries';
import ItemHistoryComponent from '@/components/ItemHistory';
import ActionTaskUpdateReportModal from '@/components/modals/ActionTaskUpdateReportModal.vue';
import ActionTaskReportViewerModal from '@/components/modals/ActionTaskReportViewerModal.vue';
import TooltipComponent from '@/components/UI/Tooltip';
import RecommendationList from './components/RecommendationList';
import StatusActionsResolver from './components/StatusActionsResolver.vue';
import IncidentStatus from './components/IncidentStatus.vue';

export default {
  name: 'incidents-single-action-item-view',
  components: {
    ButtonComponent,
    TabsComponent,
    TabItemComponent,
    CommentariesComponent,
    ItemHistoryComponent,
    RecommendationList,
    StatusActionsResolver,
    TooltipComponent,
    ActionTaskUpdateReportModal,
    ActionTaskReportViewerModal,
    IncidentStatus,
  },
  async asyncData({ store, route }) {
    const incidentId = +route.params.incidentId;
    const actionId = +route.params.actionId;
    await store.dispatch('incidents/getActionItem', { incidentId, actionId });
    const history = await store.dispatch('incidents/getActionItemHistory', { incidentId, actionId });

    return { history };
  },
  data: () => ({
    history: null,
  }),
  computed: {
    ...mapState('incidents', ['singleAction', 'single']),
    ...mapGetters(['profile']),
  },
  methods: {
    ...mapActions('incidents', ['updateReport', 'updateRecommendationStatus']),

    async onTaskReportSave({ taskId, recommendationStatus, ...data }) {
      await this.updateReport({ taskId, data });

      if (recommendationStatus !== 'empty') {
        await this.updateRecommendationStatus({ taskId, statusCode: recommendationStatus });
      }
    },
  },
};
</script>

<style lang="scss" scoped>
@import "~@/styles/partials/params";
@import "~@/styles/partials/mixins";

.incident-item {
  &__action-buttons .status-resolver {
    margin: 24px 0;
    display: flex;
    justify-content: flex-end;
  }
}

.action-tabs {
  margin-top: 32px;
}
</style>
