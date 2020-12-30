/* eslint import/prefer-default-export: 0 */
import get from 'lodash/get';
import cookies from 'js-cookie';

// eslint-disable-next-line consistent-return
export const createAuthGuard = ({ store, router, context }) => async (to, from, next) => {
  const match = to.matched.find((record) => 'requiresAuth' in record.meta);

  if (!match) return next();

  let isAuth = false;
  if (process.client) {
    const cookieToken = cookies.get('token');
    isAuth = cookieToken && cookieToken !== 'null';
  }

  if (process.server) {
    const cookieToken = get(context.req, 'cookies.token', false);
    isAuth = cookieToken && cookieToken !== 'null';
    if (isAuth && store.state.user.profile === null) {
      await store.dispatch('userProfile');
    }
  }

  console.log(isAuth, match.name, from.name);

  if (match.meta.requiresAuth === true) {
    if (isAuth) {
      next();
    } else if (from.name !== null) {
      const params = to.name && { toRoute: to };
      next({ name: 'login', params });
    } else {
      const params = to.name && { toRoute: to };
      next(false);
      router.push({ name: 'login', params });
    }
  }

  if (match.meta.requiresAuth === false) {
    if (isAuth) {
      next({ name: 'incidents-list' }, () => {});
    } else {
      next();
    }
  }
};
