<template>
  <div v-if="Object.keys(availableActions).length" class="status-action-buttons">
    <button-component
      v-for="(action, permission) in availableActions"
      :key="permission"
      :label="action.title"
      :large="large"
      :small="small"
      :disabled="isLoading"
      :is-loading="isLoading && actionInLoading === action.methodName"
      :bordered="borderedButton"
      :inverse="inverseButton"
      class="status-action-buttons__item"
      @click="onClick(action)"
    />
  </div>
  <incident-status
    v-else-if="!withoutTimer"
    :code="status.code"
    :title="status.title"
    :time-to-leave="status.ttl"
    :created-at="status.createdAt"
    :column="columnStatus"
    :bordered="borderedStatus"
  />
  <span v-else-if="noActionText" v-text="noActionText" />
</template>

<script>
import { mapActions } from 'vuex';
import ButtonComponent from '@/components/UI/Button';
import IncidentStatus from './IncidentStatus.vue';

const actionsMatrix = {
  canChangeActionToConfirmation: {
    methodName: 'to-confirmation',
    withComment: false,
    title: 'Отправить на подтверждение',
    onlyTop: false,
  },
  canChangeActionToWork: {
    methodName: 'work',
    withComment: false,
    title: 'В работу',
    onlyTop: false,
  },
  canChangeActionToConfirm: {
    methodName: 'confirm',
    withComment: false,
    title: 'Подтвердить',
    onlyTop: false,
  },
  canChangeActionToReject: {
    methodName: 'reject',
    withComment: false,
    title: 'Отклонить',
    onlyTop: false,
  },
  canChangeActionToClose: {
    methodName: 'close',
    withComment: false,
    title: 'Закрыть',
    onlyTop: false,
  },
  canChangeActionToTakeInWork: {
    methodName: 'take-in-work',
    withComment: false,
    title: 'Взять в работу',
    onlyTop: false,
  },
  canActionToClarificationUserAction: {
    methodName: 'clarification',
    withComment: true,
    title: 'Запросить уточнение',
    onlyTop: false,
  },
  canChangeActionToApproving: {
    methodName: 'approving',
    withComment: false,
    title: 'Отправить на проверку',
    onlyTop: false,
  },
  canChangeActionToCorrection: {
    methodName: 'correction',
    withComment: true,
    title: 'Вернуть на доработку',
    onlyTop: true,
  },
  canChangeActionToBackFromClarification: {
    methodName: 'back-from-clarification',
    withComment: true,
    title: 'Уточнить и вернуть',
    onlyTop: true,
  },
  canCloseIncident: {
    methodName: 'close',
    forIncident: true,
    title: 'Закрыть',
    onlyTop: false,
  },
};

export default {
  name: 'status-actions-resolver',
  components: { ButtonComponent, IncidentStatus },
  props: {
    incidentId: Number,
    actionIds: {
      type: Array,
      required: true,
    },
    noActionText: String,
    status: Object,
    rights: Object,
    small: Boolean,
    large: Boolean,
    withoutTimer: Boolean,
    updateCallbackFunc: Function,
    top: Boolean,
    columnStatus: Boolean,
    borderedStatus: Boolean,
    borderedButton: Boolean,
    inverseButton: Boolean,
  },
  data: () => ({
    isLoading: false,
    actionInLoading: null,
  }),
  computed: {
    availableActions() {
      // .filter(
      // (matrixItem, permission) => this.rights[permission] && this.rights[permission] === true)
      return Object
        .keys(this.actionsMatrix)
        .filter((permission) => this.rights[permission] && this.rights[permission] === true)
        // .filter((permission) => {
        //   if (this.top) { return permission; }
        //   return this.actionsMatrix[permission].onlyTop !== true;
        // })
        .reduce((result, permission) => {
          // eslint-disable-next-line no-param-reassign
          result[permission] = this.actionsMatrix[permission];
          return result;
        }, {});
    },
  },
  created() {
    this.actionsMatrix = actionsMatrix;
  },
  methods: {
    ...mapActions('incidents', ['getItemForce', 'passAction']),

    async onClick(action) {
      if (action.withComment) {
        this.$modal.show('action-with-comment-modal', {
          action,
          incidentId: this.incidentId,
          actionIds: this.actionIds,
        });
        // do someting
        return;
      }

      try {
        this.isLoading = true;
        this.actionInLoading = action.methodName;

        const data = {
          incidentId: this.incidentId,
          actionIds: this.actionIds,
          methodName: action.methodName,
        };

        await this.passAction(data);
        if (typeof this.updateCallbackFunc === 'function') {
          await this.updateCallbackFunc(action);
        } else {
          await this.getItemForce(this.incidentId);
        }
      } catch (e) {
        // todo do something
      } finally {
        this.isLoading = false;
        this.actionInLoading = null;
      }
    },
  },
};
</script>

<style lang="scss" scoped>
@import "~@/styles/partials/params";
@import "~@/styles/partials/mixins";

.status-action-buttons {
  display: flex;
  flex-wrap: nowrap;

  &__item + &__item {
    margin-left: 3px;
  }
}
</style>
