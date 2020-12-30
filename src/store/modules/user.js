import cookies from 'js-cookie';
import * as TYPES from '../types';

const state = {
  access: null,
  profile: null,
};

const getters = {
  isAuth: (state) => !!(state.profile && state.profile.login),
  profile: (state) => state.profile,
};

const actions = {
  async logIn({ commit }, { login, password }) {
    try {
      const response = await this.$http.post('login', { login, password });
      cookies.set('token', response.data.token, { path: '/' });
      commit(TYPES.SET_USER_TOKEN, response.data.token);
    } catch (e) {
      console.log(e);
      throw e;
    }
  },

  async logOut({ commit }) {
    // await users.logOut();
    if (process.client) {
      cookies.set('token', null);
    }

    commit(TYPES.LOG_OUT);
  },

  async ssoAuthentication({ commit }, code) {
    const response = await this.$http.get(`auth/sso?code=${code}`);

    const { token } = response.data;
    commit(TYPES.SET_USER_TOKEN, token);
    return token;
  },

  async userProfile({ commit }) {
    const response = await this.$http.get('user');
    commit(TYPES.SET_USER, response.data);
  },
};

const mutations = {
  [TYPES.LOG_IN](state, { token }) {
    state.access = token;
  },

  [TYPES.LOG_OUT](state) {
    state.access = null;
    state.profile = null;
  },

  [TYPES.SET_USER](state, payload) {
    state.profile = payload;
  },

  [TYPES.SET_USER_TOKEN](state, payload) {
    state.access = payload;
  },
};

export default {
  namespaced: false,
  state,
  getters,
  actions,
  mutations,
};
