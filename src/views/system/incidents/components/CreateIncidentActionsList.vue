<template>
  <div>
    <ul class="create-incident-actions-list">
      <li
        v-for="(action, index) in list"
        :key="index"
        class="create-incident-actions-list-item"
      >
        <div class="create-incident-actions-list-left">
          <div class="create-incident-actions-list-name">
            {{ getActionTitle(action.typeId) }}
            <span>|</span>
            {{ getGroupName(action.responsibleGroup) }}
          </div>
          <div class="create-incident-actions-list-count">
            <icon name="list" />
            {{ action.tasks.length }}
          </div>
        </div>
        <div class="create-incident-actions-list-right">
          <template v-if="!action.isOld">
            <div v-if="!action.isTemplate" class="edit" @click="$emit('edit', action)">
              <icon name="pencil" />
              Редактировать
            </div>
            <div class="delete" @click="deleteAction(action)">
              <icon name="trash" />
              Удалить
            </div>
          </template>
          <template v-else>
            <span class="locked">Действия ограничены</span>
          </template>
        </div>
      </li>
    </ul>
  </div>
</template>

<script>
import { mapState, mapGetters } from 'vuex';

export default {
  name: 'create-incident-actions-list',
  props: {
    list: {
      type: Array,
      default: () => ([]),
    },
    handlerId: String,
  },
  computed: {
    ...mapGetters('incidents', ['incidentTypes', 'getTypeHandler', 'getTypeActionTypes']),
    ...mapState('incidents', ['creationMeta']),

    getActionTitle() {
      return (typeId) => this.getTypeActionTypes(this.handlerId)
        .find((_) => _.id === typeId).title;
    },
    getGroupName() {
      return (groupId) => this.creationMeta.groups.find((_) => _.id === groupId).title;
    },
  },
  methods: {
  },
};
</script>

<style lang="scss" scoped>
@import "~@/styles/partials/_params.scss";
@import "~@/styles/partials/_mixins.scss";

.create-incident-actions-list {
  &-list{
    list-style: none;
  }
  &-item{
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-radius: 2px;
    padding: 12px 16px;
    &:nth-child(odd){
      background-color: $light-gray;
    }
    &:nth-child(even){
      background-color: $white;
    }
  }
  &-left{
    display: flex;
    align-items: center;
  }
  &-right{
    display: flex;
    align-items: center;
    font-size: 11px;
    font-weight: 500;
    line-height: 22px;
    cursor: pointer;

    .edit {
      color: $blue;
      margin-right: 15px;
    }
    .delete {
      color: $red;
    }

    & .locked {
      color: $gray;
      pointer-events: none;
      cursor: default;
    }
  }
  &-name{
    font-size: 12px;
    font-weight: 500;
    line-height: 16px;
    margin-right: 15px;
    & span{
      color: $gray;
    }
  }
  &-count{
    display: flex;
    align-items: center;
    font-size: 11px;
    line-height: 16px;
    color: $gray;
    svg{
      height: 16px;
      margin-right: 5px;
      fill: $close-color;
    }
  }
}
</style>
