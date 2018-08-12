import axios from 'axios';
import store from '../vuex/user';
import router from '../router';

export {get, post, put, del};

function handleResponse(res) {
  // console.log(JSON.stringify(res));
  if (res.data.code === 3) {
    store.dispatch('delUserInfo');
    router.push({name: 'login'});
  } else if (res.data.code === 5) {
    router.push({name: 'HelloWord'});
  } else if (res.data.code === 4) {
    return Promise.reject(res.data.Message.err);
  } else {
    return res.data.Message;
  }
}

function handleError(err) {
  return Promise.reject(err);
}

function get(url, query) {
  return axios
    .get(url, {params: query})
    .then(function (res) {
      return handleResponse(res);
    });
}

function post(url, body) {
  return axios
    .post(url, body)
    .then(function (res) {
      return handleResponse(res);
    });
}

function put(url, body) {
  return axios
    .put(url, body)
    .then(function (res) {
      return handleResponse(res);
    });
}

function del(url, body) {
  return axios({
    method: 'delete',
    url   : url,
    data  : body
  }).then(function (res) {
    return handleResponse(res);
  });
}
