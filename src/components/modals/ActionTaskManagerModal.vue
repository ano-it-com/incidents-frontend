<template>
  <modal
    v-transfer-dom:app
    :name="$options.name"
    width="670px"
    height="auto"
    :click-to-close="false"
    @before-open="beforeOpen"
    @before-close="beforeClose"
  >
    <div class="modal__header">
      {{ isEdit ? 'Редактирование рекомендации' : 'Новая рекомендация' }}

      <icon
        :size="15"
        name="close"
        class="modal__close"
        stroke
        @click="onClose"
      />
    </div>

    <div v-if="taskItem" class="modal__content">
      <div class="form-group">
        <label>Тип рекомендации</label>
        <select-component
          v-model="taskItem.typeId"
          :list="taskTypesList"
          value-field="title"
          id-field="id"
          placeholder="Выберите тип рекомендации"
          small
        />
      </div>

      <div class="form-group">
        <label>Пояснение</label>

        <text-editor v-model="taskItem.inputData.description" containerized />
      </div>

      <div class="form-group">
        <label>Файлы</label>
        <file-manager v-model="taskItem.filesInput" />
      </div>
    </div>

    <div class="modal__footer">
      <button-component label="Отменить" bordered @click="onClose" />
      <button-component label="Сохранить рекомендацию" inverse @click="onRecommendationSave" />
    </div>
  </modal>
</template>

<script>
import get from 'lodash/get';
import SelectComponent from '@/components/UI/Select';
import ButtonComponent from '@/components/UI/Button';
import TextEditor from '@/components/UI/TextEditor';
import FileManager from '@/components/FileManager';

const createDefaultTask = () => ({
  typeId: null,
  inputData: {
    description: null,
  },
  reportData: {
    description: null,
  },
  filesInput: [],
  filesReport: [],
});

export default {
  name: 'action-task-manager-modal',
  components: {
    SelectComponent,
    TextEditor,
    FileManager,
    ButtonComponent,
  },
  data: () => ({
    taskItem: null,
    taskTypesList: [],
    isEdit: false,
    editableIndex: null,
  }),
  methods: {
    onClose() {
      this.$modal.hide(this.$options.name);
    },

    onRecommendationSave() {
      this.$emit('saved', { item: this.taskItem, index: this.editableIndex });
      this.onClose();
    },

    beforeOpen({ params }) {
      if (params.item) {
        this.isEdit = true;
      }

      const taskData = get(params, 'item', createDefaultTask());
      this.taskItem = JSON.parse(JSON.stringify(taskData));
      this.taskTypesList = params.list;
      this.editableIndex = get(params, 'index', null);
    },

    beforeClose() {
      this.taskItem = null;
      this.taskTypesList = [];
      this.isEdit = false;
      this.editableIndex = null;
    },
  },
};
</script>

<style lang="scss" scoped>
</style>
