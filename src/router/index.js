import Vue from 'vue';
import VueRouter from 'vue-router';
// import get from 'lodash/get';
// import cookies from 'js-cookie';

Vue.use(VueRouter);

export default (store) => {
  const router = new VueRouter({
    mode: 'history',
    base: process.env.BASE_URL,
    scrollBehavior(to, from, savedPosition) {
      if (savedPosition) {
        return savedPosition;
      }

      if (to.hash) {
        return {
          selector: to.hash,
        };
      }

      if (to.name === 'incidents-list-side-incident') return null;
      if (to.name === 'incidents-list-side-incident-action') return null;
      if (from.name === 'incidents-list-side-incident' && to.name === 'incidents-list') return null;

      return { x: 0, y: 0 };
    },
    routes: [
      {
        path: '/',
        name: 'home',
        meta: { requiresAuth: true },
        redirect: { name: 'incidents-list' },
      },
      {
        path: '/auth',
        name: 'auth',
        component: { render: (createElement) => createElement('router-view') },
        children: [
          {
            path: 'login',
            name: 'login',
            meta: { requiresAuth: false },
            component: () => import(/* webpackChunkName: "auth" */'@/views/authentication/LoginView.vue'),
          },
          {
            path: 'logout',
            name: 'logout',
            meta: { requiresAuth: true },
            // eslint-disable-next-line
            async beforeEnter(to, from, next) {
              await store.dispatch('logOut');
              next(false);

              const isRequiresAuth = from.matched.find((_) => _.meta.requiresAuth);

              if (isRequiresAuth || [null, 'logout'].includes(from.name)) {
                await router.replace({ name: 'login' });
              }
            },
          },
          {
            path: 'sso',
            name: 'sso-handler',
            component: () => import(/* webpackChunkName: "auth" */'@/views/authentication/AuthHandler.vue'),
            // meta: { requiresAuth: false },
          },
        ],
      },
      {
        path: '/incidents',
        // name: 'incidents',
        meta: { requiresAuth: true },
        component: () => import(/* webpackChunkName: "incidents" */'@/views/system/incidents/IndexView.vue'),
        children: [
          {
            path: '',
            name: 'incidents-list',
            component: () => import(/* webpackChunkName: "incidents" */'@/views/system/incidents/ListView.vue'),
          },
          {
            path: ':id(\\d+)/preview',
            name: 'incidents-list-side-incident',
            components: {
              default: () => import(/* webpackChunkName: "incidents" */'@/views/system/incidents/ListView.vue'),
              'side-view': () => import(/* webpackChunkName: "incidents" */'@/views/system/incidents/ListSideIncidentView.vue'),
            },
          },
          {
            path: ':incidentId(\\d+)/action/:actionId(\\d+)/preview',
            name: 'incidents-list-side-incident-action',
            components: {
              default: () => import(/* webpackChunkName: "incidents" */'@/views/system/incidents/ListView.vue'),
              'side-view': () => import(/* webpackChunkName: "incidents" */'@/views/system/incidents/ListSideIncidentActionView.vue'),
            },
          },
          {
            path: ':id(\\d+)',
            name: 'incidents-item-view',
            meta: { layout: 'layout-3' },
            component: () => import(/* webpackChunkName: "incidents" */'@/views/system/incidents/ItemView.vue'),
          },
          {
            path: ':incidentId(\\d+)/action/:actionId(\\d+)',
            name: 'incidents-item-action-view',
            meta: { layout: 'layout-3' },
            component: () => import(/* webpackChunkName: "incidents" */'@/views/system/incidents/ItemActionView.vue'),
          },
          {
            path: 'create',
            name: 'incidents-create',
            meta: { layout: 'layout-2' },
            component: () => import(/* webpackChunkName: "incidents" */'@/views/system/incidents/CreateView.vue'),
          },
          {
            path: ':id(\\d+)/edit',
            name: 'incidents-edit',
            meta: { layout: 'layout-2' },
            component: () => import(/* webpackChunkName: "incidents" */'@/views/system/incidents/CreateView.vue'),
          },
        ],
      },
    ],
  });

  return router;
};
