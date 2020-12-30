<template>
  <ul :class="$options.name" class="table-striped table-hover">
    <li
      v-for="item in list"
      :key="item.id"
      class="incident-actions-list__item table-item"
    >
      <div class="incident-actions-list__item-left">
        <div class="incident-actions-list__item-name">
          <router-link
            :to="{ name: 'incidents-item-action-view', params: { incidentId, actionId: item.id } }"
          >
            {{ item.type.title }} <span>|</span> {{ item.responsibleGroup.title }}
          </router-link>
        </div>

        <div class="incident-actions-list__item-row">
          <div class="action__date">{{ item.createdAt | timestampToDate }}</div>
          <a v-if="item.responsibleUser" class="action__responsible" href="#">
            {{ item.responsibleUser.firstName }} {{ item.responsibleUser.lastName }}
          </a>
          <div class="recommendations-count">
            <icon name="recommendation" class="icon" />
            {{ item.actionTasks.length }}
          </div>
        </div>
      </div>

      <div class="incident-actions-list__item-right">
        <status-actions-resolver
          :incident-id="incidentId"
          :action-ids="[item.id]"
          :rights="item.rights"
          :status="item.status"
          column-status
          small
          bordered-button
        />
      </div>
    </li>
  </ul>
</template>

<script>
import StatusActionsResolver from './StatusActionsResolver.vue';

export default {
  name: 'incident-actions-list',
  components: { StatusActionsResolver },
  props: {
    incidentId: {
      type: Number,
      required: true,
    },
    list: {
      type: Array,
      default: () => ([]),
    },
  },
};
</script>

<style lang="scss" scoped>
@import "~@/styles/partials/params";
@import "~@/styles/partials/mixins";

.incident-actions-list {
  position: relative;
  list-style: none;
  margin-top: 12px;

  &__item {
    position: relative;
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-radius: 2px;

    &:nth-child(2n-1) {
      & .operation__item-right.request {
        background-color: $light-gray;

        &::before {
          background: linear-gradient(to right, transparent, $light-gray);
        }
      }
    }

    &-right {
      display: flex;
      flex-direction: column;
      align-items: flex-end;

      &.request {
        position: absolute;
        top: 50%;
        right: 16px;
        transform: translateY(-50%);
        flex-direction: row;
        align-items: center;
        z-index: 3;

        &::before {
          content: '';
          position: absolute;
          left: -30px;
          top: 0;
          height: 100%;
          width: 30px;
          background: linear-gradient(to right, transparent, $white);
        }
      }
    }

    &-name {
      font-size: 12px;
      font-weight: 500;
      line-height: 16px;
      color: $black;

      & span {
        color: $gray;
      }
    }

    &-row {
      display: flex;
      align-items: center;
      margin-top: 3px;
    }

    & .action__date,
    & .action__responsible {
      position: relative;
      line-height: 16px;
      color: $gray;
      margin-right: 24px;
      font-size: 11px;
      letter-spacing: -0.2px;
      white-space: nowrap;
    }

    & .action__responsible {
      color: $blue;
      margin-right: 12px;
    }

    & .recommendations-count {
      display: flex;
      align-items: center;
      font-size: 11px;
      line-height: 16px;
      color: $gray;

      & .icon {
        margin-right: 5px;
      }
    }

    & .action__date {
      &::after {
        content: '';
        background-color: $gray;
        width: 4px;
        height: 4px;
        position: absolute;
        top: 50%;
        right: -12px;
        transform: translate(50%, -50%);
        border-radius: 50%;
      }
    }
  }
}
</style>
