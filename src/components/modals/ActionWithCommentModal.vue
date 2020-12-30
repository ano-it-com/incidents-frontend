<template>
  <modal
    v-transfer-dom:app
    :name="$options.name"
    :click-to-close="false"
    width="670px"
    height="auto"
    @before-open="beforeOpen"
  >
    <template v-if="action">
      <div class="modal__header">
        {{ action.title }}

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
          <label>Комментарий</label>
          <text-editor
            v-model="form.comment"
            placeholder="Введите текст комментария"
            containerized
          />
        </div>

        <div class="form-group">
          <label>Файлы</label>
          <file-manager v-model="form.fileIds" />
        </div>
      </div>

      <div class="modal__footer">
        <button-component
          :disabled="isLoading"
          label="Отмена"
          bordered
          @click="onClose"
        />
        <button-component
          :disabled="isLoading"
          :is-loading="isLoading"
          label="Отправить"
          inverse
          @click="onSend"
        />
      </div>
    </template>
  </modal>
</template>

<script>
import { mapActions } from 'vuex';
import FileManager from '@/components/FileManager';
import TextEditor from '@/components/UI/TextEditor';
import ButtonComponent from '@/components/UI/Button';

const createDefaultForm = () => ({
  comment: null,
  fileIds: [],
});

export default {
  name: 'action-with-comment-modal',
  components: { FileManager, TextEditor, ButtonComponent },
  data: () => ({
    form: createDefaultForm(),
    action: null,
    incidentId: null,
    actionIds: null,
    isLoading: false,
  }),
  methods: {
    ...mapActions('incidents', ['passAction', 'getItemWithListUpdate']),

    beforeOpen({ params }) {
      if (!params.action) {
        throw new Error('No action in modal');
      }

      this.form = createDefaultForm();
      this.action = params.action;
      this.incidentId = params.incidentId;
      this.actionIds = params.actionIds;
    },

    onClose() {
      this.$modal.hide(this.$options.name);
    },

    async onSend() {
      this.isLoading = true;
      try {
        await this.passAction({
          methodName: this.action.methodName,
          incidentId: this.incidentId,
          actionIds: this.actionIds,
          comment: this.form.comment,
          fileIds: this.form.fileIds,
        });
        await this.getItemWithListUpdate(this.incidentId);
      } catch (e) {
        console.error(e);
      } finally {
        this.isLoading = false;
        this.onClose();
      }
    },
  },
};
</script>
