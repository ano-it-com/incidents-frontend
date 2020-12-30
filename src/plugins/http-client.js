import axios from 'axios';
import cookies from 'js-cookie';
import get from 'lodash/get';

export default {
  beforeCreate(context, inject) {
    const {
      error,
      req,
      router,
      store,
    } = context;

    const axiosInstance = axios.create({
      baseURL: process.env.VUE_APP_API_URL,
    });

    const createSetAuthInterceptor = (config) => {
      let token = null;

      if (process.server) {
        token = req.cookies.token;
      } else {
        token = cookies.get('token');
      }

      // try to get it from store
      if (!token) {
        token = get(store.state, 'user.access', null);
      }

      if (token) {
        // eslint-disable-next-line no-param-reassign
        config.headers.Authorization = token;
      }

      return config;
    };

    const createHandleAuthError = (err) => {
      const code = get(err, 'response.status');

      if ([401].includes(code)) {
        router.push({ name: 'logout' });
        return Promise.reject(error);
      }

      if ([403].includes(code)) {
        return Promise.reject(error);
      }

      if (err.response) {
        const { data } = err.response;
        return error(data.error || 'Упс!', err.response.status);
      }

      return Promise.reject(error);
    };

    axiosInstance.interceptors.request.use(createSetAuthInterceptor);
    axiosInstance.interceptors.response.use((response) => response, createHandleAuthError);

    inject('http', axiosInstance);
  },
};
