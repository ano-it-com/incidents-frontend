<template>
  <div
    :class="[$options.name, { open: $route.name === 'incidents-list-side-incident-action' }]"
    class="side-view-popup"
    data-width="600"
    ref="popup"
  >
    <div class="resizer" @mousedown.prevent="onResize" />
    <div
      class="side-view-popup__close"
      @click="onClose"
    >
      <icon :size="18" name="close" stroke />
    </div>

    <template v-if="isLoading">
      <div class="loading-content">
        <spinner :size="72" color="#3F6ADA" />
      </div>
    </template>

    <div v-else :class="$options.name">
      <div class="info-panel__block">
        <div class="info-panel__id">id {{ singleAction.id }}</div>
        <div class="info-panel__date">{{ singleAction.createdAt | timestampToDate }}</div>
        <a class="info-panel__author tooltip-show link" href="javascript:void(0);">
          {{ singleAction.createdBy.firstName }} {{ singleAction.createdBy.firstName }}
          <tooltip-component
            class="top"
          label="Автор инцидента"
          />
        </a>
      </div>

      <h2 class="incident-item__title">

        <router-link
          :to="{
            name: 'incidents-item-action-view',
            params: { incidentId: $route.params.incidentId, actionId: $route.params.actionId }
          }"
        >
          {{ singleAction.type.title }} <span>|</span> {{ singleAction.responsibleGroup.title }}
          <icon name="new-window" :size="12" />
        </router-link>
      </h2>

      <div class="incident-item__parent">
        Инцидент:
        <router-link
          :to="{ name: 'incidents-item-view', params: { id: single.id } }"
          v-text="single.title"
          class="link"
        />
      </div>
      <div class="status-panel status-panel__modal">
        <div class="status-panel-text">Статус действия</div>

        <status-actions-resolver
          :incident-id="single.id"
          :action-ids="[singleAction.id]"
          :rights="singleAction.rights"
          :status="singleAction.status"
          inverse-button
          bordered-status
        />
      </div>

      <h5 class="title">Информация о действии</h5>

      <ul class="incident__info-list table-striped">
        <li v-if="singleAction.responsibleUser" class="incident__info-item table-item">
          <div class="incident__info-name">Ответственный</div>
          <div class="incident__info-value"><a href="javascript:void(0);">
            {{ singleAction.responsibleUser.firstName }} {{ singleAction.responsibleUser.lastName }}
          </a></div>
        </li>
        <li class="incident__info-item table-item" >
          <div class="incident__info-name">Тип действия</div>
          <div class="incident__info-value" v-text="singleAction.type.title" />
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex';
import Spinner from '@/components/UI/Spinner';
import TooltipComponent from '@/components/UI/Tooltip';
import StatusActionsResolver from './components/StatusActionsResolver.vue';

export default {
  name: 'list-side-incident-action-item-view',
  components: {
    Spinner,
    StatusActionsResolver,
    TooltipComponent,
  },
  data: () => ({
    isLoading: true,
  }),
  computed: {
    ...mapState('incidents', ['singleAction', 'single']),
  },
  beforeRouteEnter(to, from, next) {
    next(async (context) => {
      await context.getActionItem({
        incidentId: +to.params.incidentId,
        actionId: +to.params.actionId,
      });
      // eslint-disable-next-line no-param-reassign
      context.isLoading = false;
    });
  },
  async beforeRouteUpdate(to, from, next) {
    this.isLoading = true;
    await this.getActionItem({
      incidentId: +to.params.incidentId,
      actionId: +to.params.actionId,
    });
    this.isLoading = false;
    next();
  },
  beforeRouteLeave(to, from, next) {
    // get content element
    const contentElement = document.getElementById('content');
    if (contentElement) {
      contentElement.style.paddingRight = null;
    }

    next();
  },
  methods: {
    ...mapActions('incidents', ['getActionItem']),

    // todo rework
    onResize(event) {
      const popupElement = this.$refs.popup;
      const popupElementStyle = getComputedStyle(popupElement);
      const currentX = event.pageX;
      const currentPopupWidth = parseInt(popupElementStyle.width, 10);
      const popupDefaultWidth = parseInt(popupElement.dataset.width, 10);

      // get content element
      const contentElement = document.getElementById('content');
      if (!contentElement) return;

      const resize = (e) => {
        const newWidth = currentX - e.pageX + currentPopupWidth;
        if (newWidth < popupDefaultWidth) return;

        popupElement.style.width = `${newWidth}px`;
        contentElement.style.paddingRight = `${newWidth}px`;
      };
      const stopResize = () => {
        window.removeEventListener('mousemove', resize);
      };

      window.addEventListener('mousemove', resize);
      window.addEventListener('mouseup', stopResize);
    },

    async onClose() {
      await this.$router.push({ name: 'incidents-list', params: { client: true } });
    },
  },
};
</script>

<style lang="scss" scoped>
@import "~@/styles/partials/mixins";
@import "~@/styles/partials/params";

.list-side-incident-action-item-view {
  .loading-content {
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .resizer {
    position: absolute;
    top: 0;
    left: 0;
    width: 9px;
    height: 100%;
    cursor: col-resize;
  }

  .title {
    font-size: 16px;
  }
}
</style>
