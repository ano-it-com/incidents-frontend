<template>
  <modal
    v-transfer-dom:app
    :name="$options.name"
    width="670px"
    height="auto"
    @before-open="beforeOpen"
  >
    <div class="modal__header">
      Отчет по рекомендации

      <icon
        :size="15"
        name="close"
        class="modal__close"
        stroke
        @click="$modal.hide($options.name)"
      />
    </div>

    <div class="modal__content">
      <div class="form-group">
        <div v-if="recommendationStatus === 'done'" class="recommendation-status completed">
          <i> <icon name="check" class="icon" :size="14" /></i>
          Рекомендация выполнена
        </div>
        <div v-else-if="recommendationStatus === 'not_done'" class="recommendation-status error">
          <i> <icon name="cross" class="icon" :size="14" /></i>
          Рекомендация не выполнена
        </div>
      </div>

      <div v-if="reportData && reportData.description" class="form-group">
        <div v-html="reportData.description" />
      </div>

      <div v-if="filesReport.length" class="form-group">
        <file-manager :already-uploaded="filesReport" read-only />
      </div>
    </div>
  </modal>
</template>

<script>
import FileManager from '@/components/FileManager';

export default {
  name: 'action-task-report-viewer-modal',
  components: { FileManager },
  data: () => ({
    recommendationStatus: null,
    reportData: null,
    filesReport: [],
  }),
  methods: {
    beforeOpen({ params }) {
      this.recommendationStatus = params.recommendationStatus;
      this.reportData = { ...params.reportData };
      this.filesReport = [...params.filesReport];
    },
  },
};
</script>
