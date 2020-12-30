<template>
  <modal
    v-transfer-dom:app
    :name="$options.name"
    width="670px"
    height="auto"
    :click-to-close="false"
    @before-open="beforeOpen"
  >
    <div class="modal__header">
      Отчет по рекомендации

      <icon
        :size="15"
        name="close"
        class="modal__close"
        stroke
        @click="onClose"
      />
    </div>

    <div class="modal__content">
      <div class="form-group">
        <label>Статус рекомендации</label>
        <div class="recommendation-status-select">
          <div class="recommendation-status-item">
            <input
              v-model="recommendationStatus"
              id="status-done"
              name="status"
              type="radio"
              value="done"
            >
            <label for="status-done">Выполнена</label>
          </div>

          <div class="recommendation-status-item">
            <input
              v-model="recommendationStatus"
              id="status-not-done"
              name="status"
              type="radio"
              value="not_done"
            >
            <label for="status-not-done">Не выполнена</label>
          </div>
        </div>
      </div>
      <div class="form-group">
        <label>Текст</label>
        <text-editor
          v-model="reportData.description"
          placeholder="Введите текст отчета"
          containerized
        />
      </div>

      <div class="form-group">
        <label>Файлы</label>
        <file-manager v-model="filesReport" />
      </div>
    </div>

    <div class="modal__footer">
      <button-component label="Отменить" bordered @click="onClose" />
      <button-component label="Отправить отчет" inverse @click="onTaskSave" />
    </div>
  </modal>
</template>

<script>
import TextEditor from '@/components/UI/TextEditor';
import FileManager from '@/components/FileManager';
import ButtonComponent from '@/components/UI/Button';

const createDefaultReport = () => ({
  description: null,
});

export default {
  name: 'action-task-update-report-modal',
  components: {
    TextEditor,
    FileManager,
    ButtonComponent,
  },
  data: () => ({
    recommendationStatus: 'done',
    reportData: createDefaultReport(),
    filesReport: [],
    alreadyUploaded: [],
  }),
  methods: {
    beforeOpen({ params }) {
      this.taskId = params.taskId;

      if (params.recommendationStatus) {
        this.recommendationStatus = params.recommendationStatus;
      }

      if (params.reportData) {
        this.reportData = { ...this.reportData, ...params.reportData };
      }

      if (params.filesReport && params.filesReport.length) {
        this.alreadyUploaded = [...params.filesReport.length];
      }
    },

    onClose() {
      this.reportData = createDefaultReport();
      this.filesReport = [];
      this.alreadyUploaded = [];
      this.recommendationStatus = 'done';
      this.$modal.hide(this.$options.name);
    },

    onTaskSave() {
      const data = {
        taskId: this.taskId,
        recommendationStatus: this.recommendationStatus,
        reportData: { ...this.reportData },
        filesReport: [...this.filesReport],
      };
      this.$emit('save', { ...data });
      this.onClose();
    },
  },
};
</script>

<style lang="scss" scoped>
@import "~@/styles/partials/params";
@import "~@/styles/partials/mixins";

.recommendation-status {
  &-select {
    display: flex;
    align-items: center;
  }

  &-item {
    margin-right: 32px;
    display: flex;

    label {
      font-weight: 400;
      margin-left: 8px;
      margin-bottom: 0;
      cursor: pointer;
    }
  }
}
</style>
