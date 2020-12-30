<template>
  <div
    :class="$options.name"
    class="side-view-popup"
    data-width="600"
    ref="popup"
  >
    <div
      class="side-view-popup__close"
      @click="onClose"
    >
      <icon :size="18" name="close" stroke />
    </div>

    <div class="incident-creation-action-manager__title">
      {{ isEdit ? 'Изменение действия' : 'Новое действие' }}
    </div>

    <div class="incident-creation-action-manager__item">
      <div class="incident-creation-action-manager__item-name">Тип действия</div>
      <select-component
        v-model="action.typeId"
        :list="actionTypes"
        id-field="id"
        value-field="title"
        small
      />
    </div>

    <div class="incident-creation-action-manager__item">
      <div class="incident-creation-action-manager__item-name">Ответственное направление</div>
      <select-component
        v-model="action.responsibleGroup"
        :list="responsibleGroups"
        id-field="id"
        value-field="title"
        small
      />
    </div>

    <div class="incident-creation-action-manager__recommendations">
      <div class="incident-creation-action-manager__title">
        Рекомендации <sup v-text="action.tasks.length" />
      </div>

      <button-component
        :disabled="!action.typeId"
        label="Добавить рекомендацию"
        icon="plus"
        inverse
        @click="onRecommendationAddClick"
      />
    </div>

    <div
      v-if="!action.tasks.length"
      class="incident-creation-action-manager__recommendations-empty"
    >
      Добавьте рекомендацию, чтобы сохранить действие.
    </div>
    <ul v-else class="incident-creation-action-manager__recommendations-list">
      <li
        v-for="(item, index) in action.tasks"
        :key="index"
        class="incident-creation-action-manager__recommendations-item"
      >
        <div class="change-items">
          <div class="edit" @click="onRecommendationItemEdit(item, index)">
            <icon :size="9" name="pencil" class="icon" />
            Редактировать
          </div>

          <div class="delete" @click="onRecommendationItemDelete(index)">
            <icon :size="9" name="trash" class="icon" />
            Удалить
          </div>
        </div>
        <div class="incident-creation-action-manager__recommendations-number" v-text="index + 1" />
        <div class="incident-creation-action-manager__recommendations-info">
          <div
            class="incident-creation-action-manager__recommendations-caption"
            v-text="getTaskTypeTitle(item.typeId)"
          />
          <div
            class="incident-creation-action-manager__recommendations-description"
            v-html="item.inputData.description"
          />
        </div>
      </li>
    </ul>

    <div class="incident-creation-action-manager__buttons">
      <button-component label="Отменить" bordered @click="onClose" />
      <button-component
        :disabled="!saveIsAvailable"
        label="Сохранить действие"
        inverse
        @click="onActionSaveClick"
      />
    </div>

    <action-task-manager-modal @saved="onRecommendationSaved" />
  </div>
</template>

<script>
import isEmpty from 'lodash/isEmpty';
import get from 'lodash/get';
import ButtonComponent from '@/components/UI/Button';
import SelectComponent from '@/components/UI/Select';
import ActionTaskManagerModal from '@/components/modals/ActionTaskManagerModal.vue';

const createDefaultAction = () => ({
  typeId: null,
  responsibleGroup: null,
  tasks: [],
});

export default {
  name: 'incident-creation-action-manager',
  components: {
    SelectComponent,
    ButtonComponent,
    ActionTaskManagerModal,
  },
  props: {
    actionTypes: {
      type: Array,
      required: true,
    },
    responsibleGroups: {
      type: Array,
      required: true,
    },
    currentAction: Object,
  },
  data: () => ({
    action: createDefaultAction(),
  }),
  computed: {
    saveIsAvailable() {
      return this.action.typeId && this.action.responsibleGroup && this.action.tasks.length;
    },

    currentActionTaskTypes() {
      const taskTypes = this.actionTypes.find((_) => _.id === this.action.typeId);
      if (!taskTypes) return [];

      return taskTypes.task_types;
    },

    getTaskTypeTitle() {
      return (typeId) => get(this.currentActionTaskTypes.find((_) => _.id === typeId), 'title', null);
    },

    isEdit() {
      return !isEmpty(this.currentAction) && this.currentAction.typeId;
    },
  },
  watch: {
    currentAction: {
      immediate: true,
      deep: true,
      handler(action) {
        this.action = { ...createDefaultAction(), ...action };
      },
    },
  },
  methods: {
    onActionSaveClick() {
      if (this.isEdit) {
        this.$emit('updated', { updated: this.action, old: this.currentAction });
      } else {
        this.$emit('saved', this.action);
      }

      this.onClose();
    },

    onRecommendationAddClick() {
      this.$modal.show('action-task-manager-modal', { list: this.currentActionTaskTypes });
    },

    onRecommendationSaved({ item, index }) {
      console.log(index);
      if (index !== null) {
        // this.action.tasks[index] = { ...this.action.tasks[index], ...item };
        this.$set(this.action.tasks, index, { ...this.action.tasks[index], ...item });
        return;
      }

      this.action.tasks.push(item);
    },

    onRecommendationItemEdit(item, index) {
      this.$modal.show('action-task-manager-modal', {
        list: this.currentActionTaskTypes,
        item,
        index,
      });
    },

    onRecommendationItemDelete(index) {
      this.action.tasks.splice(index, 1);
      this.action.tasks = this.action.tasks.filter(Boolean);
    },

    onClose() {
      this.$emit('close');
      this.$nextTick(() => { this.action = createDefaultAction(); });
    },
  },
};
</script>

<style lang="scss" scoped>
@import "~@/styles/partials/mixins";
@import "~@/styles/partials/params";

.incident-creation-action-manager {
  &__title {
    font-family: Ruda,sans-serif;
    font-size: 21px;
    font-weight: 800;
    line-height: 32px;
    margin-top: 12px;
  }

  &__item {
    position: relative;
    margin-top: 20px;

    &-name {
      font-size: 12px;
      font-weight: 500;
      line-height: 14px;
      margin-bottom: 7px;
    }
  }

  &__recommendations {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: 30px;

    .incident-creation-action-manager__title {
      margin-top: 0;
      font-size: 14px;

      sup {
        color: $gray;
      }
    }

    &-list {
      margin: 20px 0 40px;
      list-style: none;
    }

    &-empty {
      display: flex;
      justify-content: center;
      align-items: center;
      color: $gray;
      font-weight: 300;
      font-size: 12px;
      margin: 40px 0;
    }

    &-item {
      position: relative;
      display: flex;
      flex-direction: column;
      border-radius: 2px;
      padding: 12px 16px;

      &:hover {
        & .change-items {
          opacity: 1;
          visibility: visible;
          transition: opacity 0.3s;
        }
      }

      &:nth-last-child(odd) {
        background-color: $light-gray;

        & .incident-creation-action-manager__recommendations-more {
          background-color: $light-gray;

          &::before{
            background: linear-gradient(to bottom, transparent, $light-gray);
          }
        }
      }
      &:nth-last-child(even) {
        background-color: $white;

        & .incident-creation-action-manager__recommendations-more {
          background-color: $white;

          &::before {
            background: linear-gradient(to bottom, transparent, $white);
          }
        }
      }

      .change-items {
        display: flex;
        position: absolute;
        top: 12px;
        right: 16px;
        z-index: 2;
        opacity: 0;
        visibility: hidden;
        transition: opacity .3s;

        & .edit {
          color: $blue;
          margin-right: 12px;
        }

        & .delete {
          color: $red;
        }
        & .edit, & .delete {
          font-size: 11px;
          font-weight: 500;
          line-height: 22px;
          cursor: pointer;

          .icon {
            margin-top: 2px;
            margin-right: 4px;
          }
        }
      }
    }

    &-number {
      display: flex;
      justify-content: center;
      align-items: center;
      font-size: 12px;
      font-weight: 500;
      width: 22px;
      min-width: 22px;
      height: 22px;
      background-color: $white;
      border: 1px solid $gray-blue-border;
      border-radius: 2px;
    }

    &-info {
      width: 100%;
      margin-top: 12px;
    }

    &-caption {
      font-size: 15px;
      font-weight: 500;
      line-height: 24px;
    }

    &-description {
      font-size: 14px;
      line-height: 24px;
    }
  }

  &__buttons {
    display: flex;
    justify-content: space-between;
    border-top: 1px solid #e0e8f0;
    padding-top: 20px;
  }
}
</style>
