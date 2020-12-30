/* eslint no-param-reassign:0 */
import get from 'lodash/get';

/**
 * Helper for set the header with the auth token
 */
const createSetAuthInterceptor = ({ store }) => (config) => {
  const state = store.state.user;

  if (state.access) {
    // eslint-disable-next-line no-param-reassign
    config.headers['X-AUTH-TOKEN'] = state.access;
  } else {
    delete config.headers['X-AUTH-TOKEN'];
  }
  return config;
};

// eslint-disable-next-line no-shadow
const createHandleAuthError = ({ axiosInstance, router }) => (error) => {
  const code = get(error, 'response.status');

  if ([401].includes(code)) {
    router.push({ name: 'logout' });
    return Promise.reject(error);
  }

  if ([403].includes(code)) {
    return Promise.reject(error);
  }

  return axiosInstance(error.config);
};

// eslint-disable-next-line no-shadow
export default function createHttpPlugin(axiosInstance, store, router) {
  const setAuthCb = createSetAuthInterceptor({ axiosInstance, store, router });
  axiosInstance.interceptors.request.use(setAuthCb);

  const handleAuthError = createHandleAuthError({ axiosInstance, store, router });
  axiosInstance.interceptors.response.use(null, handleAuthError);
}
