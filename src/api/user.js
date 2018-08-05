import {
  get,
  post,
  put,
  del
} from './helper';

export {
  login,
  logout,
  update,
  getUsers,
  reg
};
const login = post.bind(null, '/api/v1/login');
const reg = post.bind(null, '/api/v1/reg');
const logout = get.bind(null, '/api/v1/logout');
const update = put.bind(null, '/api/v1/user');
const getUsers = get.bind(null, '/api/v1/users');
