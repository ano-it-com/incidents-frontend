const MUTATION_TYPES = {
  CHANGE_LAYOUT_STATE: 'CHANGE_LAYOUT_STATE',
};

const state = {
  layoutIsOpen: false,
};

const actions = {
  setOpenedLayoutState({ commit }) {
    commit(MUTATION_TYPES.CHANGE_LAYOUT_STATE, true);
  },

  setClosedLayoutState({ commit }) {
    commit(MUTATION_TYPES.CHANGE_LAYOUT_STATE, false);
  },
};

const mutations = {
  [MUTATION_TYPES.CHANGE_LAYOUT_STATE](state, layoutState) {
    state.layoutIsOpen = layoutState;
  },
};

export default {
  namespaced: true,
  state,
  actions,
  mutations,
};
