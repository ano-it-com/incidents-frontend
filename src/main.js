import Vue from 'vue';
import VueMeta from 'vue-meta';
import NoSSR from 'vue-no-ssr';
// import { library } from '@fortawesome/fontawesome-svg-core';
// import * as ICONS from '@fortawesome/free-solid-svg-icons';
// import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';

import IconComponent from '@/components/UI/Icon';
import TooltipComponent from '@/components/UI/Tooltip';

import Application from './Application.vue';
import createRouter from './router';
import createStore from './store';
import { createAuthGuard } from './router/guards';
import * as filters from './plugins/filters';

// Object.values(ICONS).every((icon) => library.add(icon));

Vue.use(VueMeta);
Vue.component('Icon', IconComponent);
Vue.component('TooltipComponent', TooltipComponent);
Vue.component('no-ssr', NoSSR);

Vue.config.productionTip = false;

Object.keys(filters).forEach((key) => {
  Vue.filter(key, filters[key]);
});

export default (context) => {
  const store = createStore();
  const router = createRouter(store);

  router.beforeEach(createAuthGuard({ router, store, context }));

  return new Vue({
    router,
    store,
    render: (createElement) => createElement(Application),
  });
};
