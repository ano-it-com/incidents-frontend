<template>
  <div :class="$options.name">
    <div class="incident-item__top">
      <div class="incident-item__id" v-text="`id ${id}`" />
      <div class="incident-item__date">{{ createdAt | timestampToDate }}</div>
      <a
        class="incident-item__author link tooltip-show"
        href="#"
        v-text="`${createdBy.firstName} ${createdBy.lastName}`"
      ><tooltip-component
        class="top"
        label="Автор инцидента"
      /></a>
    </div>

    <h2 class="incident-item__title">
      <router-link :to="{ name: 'incidents-item-view', params: { id: id } }">
        {{ title }}
        <icon name="new-window" :size="12" />
      </router-link>
    </h2>

    <div class="incident-item__status">
      <div class="incident-item__status-text">Статус инцидента</div>
      <incident-status
        :code="status.code"
        :title="status.title"
        :time-to-leave="status.ttl"
        class="incident-item__status-block"
        bordered
      />
    </div>

    <tabs-component>
      <template #tab="{ item }">
        {{ item.name }} <sup v-text="single.comments.length" />
      </template>

      <tab-item-component :id="1" name="Описание">
        <div class="incident-item__description" v-html="description" />

        <incident-files-list :list="files" />
      </tab-item-component>
    </tabs-component>

    <div class="incident-item__actions">
      <h5 class="title">Действия <sup>3</sup></h5>
      <incident-actions-list :list="actions" />
    </div>
  </div>
</template>

<script>
import { TabsComponent, TabItemComponent } from '@/components/UI/Tabs';
import TooltipComponent from '@/components/UI/Tooltip';
import IncidentStatus from '../components/IncidentStatus.vue';
import IncidentFilesList from '../components/IncidentFilesList.vue';
import IncidentActionsList from '../components/IncidentActionsList.vue';

export default {
  name: 'incident-item',
  components: {
    IncidentStatus,
    TabsComponent,
    TabItemComponent,
    TooltipComponent,
    IncidentFilesList,
    IncidentActionsList,
  },
  inheritAttrs: false,
  props: {
    id: Number,
    title: String,
    description: String,
    createdBy: Object,
    createdAt: Number,
    status: Object,
    files: {
      type: Array,
      default: () => ([]),
    },
    actions: {
      type: Array,
      default: () => ([]),
    },
  },
};
</script>

<style lang="scss" scoped>
</style>
