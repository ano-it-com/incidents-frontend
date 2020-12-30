<template>
  <div
    :class="[$options.name, { open: $route.name === 'incidents-list-side-incident' }]"
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

    <template v-else-if="single">
      <div class="info-panel__block">
        <div class="info-panel__id" v-text="`id ${single.id}`" />
        <div class="info-panel__date">{{ single.createdAt | timestampToDate }}</div>
        <a
          class="info-panel__author tooltip-show link"
          href="#"
          v-text="`${single.createdBy.firstName} ${single.createdBy.lastName}`"
        ><tooltip-component
          class="top"
          label="Автор инцидента"
        /></a>
      </div>

      <h2 class="incident-item__title">
        <router-link :to="{ name: 'incidents-item-view', params: { id: single.id } }" class="link">
          {{ single.title }}
          <icon name="new-window" :size="12" />
        </router-link>
      </h2>

      <div class="status-panel status-panel__modal">
        <div class="status-panel-text">Статус инцидента</div>
        <incident-status
          :code="single.status.code"
          :title="single.status.title"
          :time-to-leave="single.status.ttl"
          :created-at="single.status.createdAt"
          class="status-panel-block"
          bordered
        />
      </div>

      <tabs-component>
        <tab-item-component :id="1" name="Описание">
          <div class="incident-item__description" v-html="single.description" />

          <incident-files-list :list="single.files" />
        </tab-item-component>

        <tab-item-component v-if="single.info.length" :id="2" name="Информация об инциденте">
          <handler-properties-resolver
            :handler="getTypeHandler(single.type.handler)"
            :values="single.info"
            type="view"
          />
        </tab-item-component>
      </tabs-component>

      <div v-if="single.actions.length" class="incident-item__actions">
        <h5 class="title">Действия <sup v-text="single.actions.length" /></h5>
        <incident-actions-list :incident-id="single.id" :list="single.actions" />
      </div>
    </template>
  </div>
</template>

<script>
// import isEqual from 'lodash/isEqual';
import { mapState, mapActions, mapGetters } from 'vuex';
import Spinner from '@/components/UI/Spinner';
import TooltipComponent from '@/components/UI/Tooltip';
import { TabsComponent, TabItemComponent } from '@/components/UI/Tabs';
import HandlerPropertiesResolver from '@/components/HandlerPropertiesResolver';
import IncidentStatus from './components/IncidentStatus.vue';
import IncidentFilesList from './components/IncidentFilesList.vue';
import IncidentActionsList from './components/IncidentActionsList.vue';

export default {
  name: 'list-side-incident-item-view',
  components: {
    Spinner,
    IncidentStatus,
    TabsComponent,
    TabItemComponent,
    IncidentFilesList,
    IncidentActionsList,
    HandlerPropertiesResolver,
    TooltipComponent,
  },
  // async fetch({ store, route }) {
  //   await store.dispatch('incidents/getItem', route.params.id);
  // },
  data: () => ({
    isLoading: true,
  }),
  // watch: {
  //   single: {
  //     immediate: true,
  //     handler(newVal, oldVal) {
  //       if (oldVal === null && newVal && newVal.id) {
  //         this.isLoading = false;
  //         return;
  //       }
  //
  //       if (!isEqual(newVal, oldVal)) {
  //         this.isLoading = false;
  //       }
  //     },
  //   },
  // },
  computed: {
    ...mapState('incidents', ['single']),
    ...mapGetters('incidents', ['getTypeHandler']),
  },
  beforeRouteEnter(to, from, next) {
    next(async (context) => {
      await context.getItem(to.params.id);
      // eslint-disable-next-line no-param-reassign
      context.isLoading = false;
    });
  },
  async beforeRouteUpdate(to, from, next) {
    this.isLoading = true;
    await this.getItem(to.params.id);
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
    ...mapActions('incidents', ['getItem']),

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

.list-side-incident-item-view {
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
}
</style>
