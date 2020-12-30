import get from 'lodash/get';
import buildUrlParams from '@/utils/build-url-params';
import * as TYPES from '../types';

const state = () => ({
  list: null,
  listFilters: {
    perPage: 15,
  },
  single: null,
  singleAction: null,
  creationMeta: null,
  filterOptions: null,
  paginationMeta: {
    currentPage: null,
    perPage: null,
    total: null,
    pagesCount: null,
  },
  currentUrlParams: null,
  actionsInPending: {},
});

const getters = {
  incidentTypes: (state) => get(state, 'creationMeta.types', []),
  availableFilters: (state) => get(state, 'creationMeta.filters', null),
  getTypeHandler: (state) => (type) => get(state.creationMeta, `handlers.${type}`),
  getTypeActionTypes: (state) => (type) => {
    const typeItem = state.creationMeta.types.find((_) => _.handler === type);
    if (!typeItem) return [];

    return typeItem.action_types;
  },
};

const actions = {
  async getList(
    { commit, state },
    {
      filter = {},
      sort = {},
      page = 1,
      perPage = null,
    } = {},
  ) {
    const requiredPage = page || get(state, 'paginationMeta.currentPage', 1);
    const stringParams = buildUrlParams({
      filter,
      sort,
      page: requiredPage,
      perPage: perPage || state.listFilters.perPage,
    });

    const response = await this.$http.get(`incident?${stringParams}`);
    commit(TYPES.SET_LIST, response.data);
  },

  async getMeta({ commit, state }, force = false) {
    if (state.creationMeta !== null && !force) return;

    const response = await this.$http.get('incident/options');
    commit(TYPES.SET_META, response.data);
  },

  async getItem({ commit, state }, id) {
    if (state.single && state.single.id === id) return state.single;

    const response = await this.$http.get(`incident/${id}`);
    commit(TYPES.SET_SINGLE, response.data);
    return response.data;
  },

  async getItemForce({ commit }, id) {
    const response = await this.$http.get(`incident/${id}`);
    commit(TYPES.SET_SINGLE, response.data);
    return response.data;
  },

  async getItemWithListUpdate({ dispatch, commit }, id) {
    const item = await dispatch('getItemForce', id);
    commit(TYPES.UPDATE_SINGLE_IN_LIST, item);
    return item;
  },

  async createItem(store, params) {
    const response = await this.$http.post('incident', params);
    return response.data;
  },

  async updateItem({ state }, params) {
    await this.$http.put(`incident/${state.single.id}`, params);
  },

  async getActionItem({ commit, state, dispatch }, { incidentId, actionId }) {
    let currentIncident = state.single;

    if (!currentIncident || currentIncident.id !== incidentId) {
      currentIncident = await dispatch('getItem', incidentId);
    }

    const actionItem = currentIncident.actions.find((_) => _.id === actionId);
    if (!actionItem) throw Error('Cant find action in incident item');

    commit(TYPES.SET_SINGLE_ACTION, actionItem);
  },

  async getActionItemForce({ commit, dispatch, state }, actionId) {
    const incident = await dispatch('getItemForce', state.single.id);

    const actionItem = incident.actions.find((_) => _.id === actionId);
    if (!actionItem) throw Error('Cant find action in incident item');

    commit(TYPES.SET_SINGLE_ACTION, actionItem);
  },

  async getIncidentItemHistory(store, incidentId) {
    const response = await this.$http.get(`/incident/${incidentId}/history`);
    return response.data;
  },

  async getActionItemHistory(store, { incidentId, actionId }) {
    const response = await this.$http.get(`/incident/${incidentId}/action/${actionId}/history`);
    return response.data;
  },

  async passAction(store, {
    methodName,
    incidentId,
    actionIds,
    comment = null,
    fileIds = [],
  }) {
    try {
      const url = comment ? `incident/${incidentId}/action/${actionIds[0]}` : `incident/${incidentId}/actions`;
      const data = comment ? { comment, fileIds } : { actionIds };
      const response = await this.$http.post(`${url}/${methodName}`, data);
      return response.data;
    } catch (e) {
      console.error(e);
      throw e;
    }
  },

  async updateReport({ state }, { taskId, data }) {
    try {
      await this.$http.put(`incident/${state.single.id}/action/${state.singleAction.id}/task/${taskId}/report`, data);
      // await dispatch('getActionItemForce', state.singleAction.id);
    } catch (e) {
      console.error(e);
      throw e;
    }
  },

  async updateRecommendationStatus({ dispatch, state }, { taskId, statusCode }) {
    try {
      await this.$http.post(`incident/${state.single.id}/action/${state.singleAction.id}/task/${taskId}/status/${statusCode}`);
      await dispatch('getActionItemForce', state.singleAction.id);
    } catch (e) {
      console.error(e);
      throw e;
    }
  },

  async uploadFile(store, file) {
    const formData = new FormData();
    formData.append('file', file, file.name);

    try {
      const response = await this.$http.post('file/upload', formData);
      return get(response.data, 'id', null);
    } catch (e) {
      console.error(e);
      throw e;
    }
  },
};

const mutations = {
  [TYPES.SET_LIST](state, payload) {
    state.list = payload.rows;

    if (!state.filterOptions) {
      state.filterOptions = get(payload, 'meta.filterOptions');
    }

    state.paginationMeta.currentPage = payload.page;
    state.paginationMeta.perPage = payload.perPage;
    state.paginationMeta.pagesCount = Math.ceil(payload.total / payload.perPage);
    state.paginationMeta.total = payload.total;
  },

  [TYPES.SET_META](state, payload) {
    state.creationMeta = payload;
  },

  [TYPES.SET_SINGLE](state, payload) {
    state.single = payload;
  },

  [TYPES.SET_SINGLE_ACTION](state, payload) {
    state.singleAction = payload;
  },

  [TYPES.UPDATE_SINGLE_IN_LIST](state, payload) {
    const existingIndex = state.list.findIndex((_) => _.id === payload.id);

    if (existingIndex !== -1) {
      const newArray = [
        ...state.list.slice(0, existingIndex),
        payload,
        ...state.list.slice(existingIndex + 1),
      ];

      state.list = JSON.parse(JSON.stringify(newArray));
    }
  },
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
};
