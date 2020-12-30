import http from '../http';

export const logIn = async (login, password) => {
  try {
    const response = await http.post('login', { login, password });
    return response.data;
  } catch (e) {
    console.error(e);
    throw e;
  }
};

export const logOut = async () => {
  try {
    await http.post('logout');
  } catch (e) {
    console.error(e);
    throw e;
  }
};

export const getAuthLink = async () => {
  try {
    const response = await http.get('auth/sso/link');
    return response.data;
  } catch (e) {
    console.error(e);
    throw e;
  }
};

export const getAuthToken = async (code) => {
  try {
    const response = await http.get(`auth/sso?code=${code}`);
    return response.data;
  } catch (e) {
    console.error(e);
    throw e;
  }
};

export const getUserProfile = async () => {
  try {
    const response = await http.get('user');
    return response.data;
  } catch (e) {
    console.error(e);
    throw e;
  }
};
