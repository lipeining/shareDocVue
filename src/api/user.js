import {
  get,
  post,
  put,
  del
} from './helper';

export {
  login,
  logout,
  test
};
const login = get.bind(null, '/api/v1/login');
const logout = get.bind(null, '/api/v1/logout');
const test = get.bind(null, '/api/v1/test');