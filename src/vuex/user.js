import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

const userStore = new Vuex.Store({
  state    : {
    userInfo: {},
    isLogin : 0
  },
  getters  : {
    userInfo(state) {
      return state.userInfo;
    },
    isLogin(state) {
      if (!state.isLogin) {
        state.isLogin  = parseInt(localStorage.getItem('isLogin')) || 0;
        state.userInfo = JSON.parse(localStorage.getItem('userInfo')) || {};
      }
      return state.isLogin;
    },
    isAdmin(state) {
      if (!state.isLogin) {
        state.isLogin  = parseInt(localStorage.getItem('isLogin')) || 0;
        state.userInfo = JSON.parse(localStorage.getItem('userInfo')) || {};
      }
      let permission = state.userInfo.permission || 0;
      return state.isLogin && permission === 90;
    },
  },
  mutations: {
    setUserInfo(state, userInfo) {
      state.userInfo = userInfo;
      state.isLogin  = 1;
      localStorage.setItem('userInfo', JSON.stringify(userInfo));
      localStorage.setItem('isLogin', state.isLogin);
    },
    delUserInfo(state) {
      state.userInfo = {};
      state.isLogin  = 0;
      localStorage.removeItem('userInfo');
      localStorage.removeItem('isLogin');
    }
  },
  actions  : {
    setUserInfo({commit}, user) {
      commit('setUserInfo', user);
    },
    delUserInfo({commit}) {
      commit('delUserInfo');
    }
  }
});

export default userStore;
