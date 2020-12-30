<template>
  <li :class="[$options.name, { 'full-content': isFullContent }]" class="table-item">
    <div class="newAct__box-change">
      <template v-if="rights.canEditTask">
        <div class="recommendation__comment-edit link link__edit">
          <icon name="pencil" class="icon" :size="11" />
          Редактировать
        </div>
        <div class="recommendation__comment-delete link link__delete">
          <icon name="trash" class="icon" :size="11" />
          Удалить
        </div>
      </template>
      <div
        v-if="!resizeLocked"
        class="recommendation__comment-show link link__pseudo"
        @click="onFullContentClick"
      >
        {{ isFullContent ? 'Свернуть' : 'Развернуть' }}
      </div>
    </div>
    <div class="recommendation-number">{{ index || id }}</div>
    <div class="recommendation-info">
      <h4 class="recommendation-caption" v-text="type.title" />
      <div
        class="recommendation-description"
        ref="description"
        v-html="inputData.description || 'Описание отсутствует'"
      />
    </div>

    <div class="recommendation-more">
      <!-- reportData if empty come from backend as array. todo ref -->
      <template v-if="Array.isArray(reportData) && !reportData.length">
        <button-component
          :disabled="!rights.canEditActionTaskReport"
          inverse
          label="Отправить отчет"
          @click="$modal.show('action-task-add-report-modal', { taskId: id })"
        />

        <i v-if="!rights.canEditActionTaskReport" class="recommendation-lock tooltip-show">
          <icon name="lock" class="icon" :size="12" />
          <tooltip-component
            class="left"
            label="Текущий статус действия не позволяет добавить отчет для рекомендации"
          />
        </i>
      </template>
      <template v-else-if="reportData && reportData.description">
        <button-component
          v-if="rights.canEditActionTaskReport"
          inverse
          label="Редактировать отчет"
          @click="onRecommendationReportEdit"
        />
        <button-component
          v-else
          label="Просмотреть отчет"
          bordered
          @click="onRecommendationReportView"
        />

        <i v-if="!rights.canEditActionTaskReport" class="recommendation-lock tooltip-show">
          <icon name="lock" class="icon" :size="12" />
          <tooltip-component
            class="left"
            label="Редактирование не доступно, так как действие находится на уточнении"
          />
        </i>
      </template>

      <template v-if="status.code !== 'empty'">
        <div v-if="status.code === 'done'" class="recommendation-status completed">
          <i> <icon name="check" class="icon" :size="14" /></i>
          Рекомендация выполнена
        </div>
        <div v-else-if="status.code === 'not_done'" class="recommendation-status error">
          <i> <icon name="cross" class="icon" :size="14" /></i>
          Рекомендация не выполнена
        </div>
      </template>
    </div>
  </li>
</template>

<script>
import ButtonComponent from '@/components/UI/Button';

export default {
  name: 'recommendation-item',
  inheritAttrs: false,
  components: { ButtonComponent },
  props: {
    id: Number,
    rights: {
      type: Object,
      required: true,
    },
    type: {
      type: Object,
      required: true,
    },
    inputData: {
      type: Object,
      default: () => ({}),
    },
    reportData: {
      type: Object,
      default: () => ({}),
    },
    status: {
      type: Object,
      required: true,
    },
    files: {
      type: Array,
      default: () => ([]),
    },
    index: Number,
  },
  data: () => ({
    contentHeight: null,
    isFullContent: false,
    resizeLocked: false,
  }),
  mounted() {
    this.contentHeight = this.$refs.description.scrollHeight;
    if (this.contentHeight <= 50) {
      this.isFullContent = true;
      this.resizeLocked = true;
    }
  },
  methods: {
    onFullContentClick() {
      if (this.resizeLocked) return;

      this.isFullContent = !this.isFullContent;

      if (this.isFullContent) {
        this.$refs.description.style.height = `${this.contentHeight}px`;
      } else {
        this.$refs.description.style.height = null;
      }
    },

    onRecommendationReportEdit() {
      this.$modal.show('action-task-update-report-modal', {
        taskId: this.id,
        recommendationStatus: this.status.code,
        reportData: this.reportData,
        filesReport: this.filesReport,
      });
    },

    onRecommendationReportView() {
      this.$modal.show('action-task-report-viewer-modal', {
        recommendationStatus: this.status.code,
        reportData: this.reportData,
        filesReport: this.filesReport,
      });
    },
  },
};
</script>

<style lang="scss" scoped>

.recommendation-item {
  &.full-content {
    .recommendation-more::before {
      display: none;
    }
  }
}
</style>
