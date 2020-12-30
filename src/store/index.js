import Vue from 'vue';
import Vuex from 'vuex';
import createPersistedState from 'vuex-persistedstate';
import * as modules from './modules';

Vue.use(Vuex);

const persistOptions = {
  key: `ims-${process.env.NODE_ENV || 'dev'}`,
  paths: ['user'],
};

const plugins = [];

if (process.client) {
  plugins.unshift(createPersistedState(persistOptions));
}

export default () => new Vuex.Store({
  strict: process.env.NODE_ENV !== 'production',
  modules,
  plugins,
});
