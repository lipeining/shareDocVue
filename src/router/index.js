import Vue from 'vue'
import Router from 'vue-router'
import HelloWorld from '@/components/HelloWorld'
import login from '../views/login'
import store from "../vuex/user"

Vue.use(Router)


let routes = [{
    path: '/',
    name: 'HelloWorld',
    component: HelloWorld,
    meta: {
      requiresAuth: true
    }
  },
  {
    path: '/login',
    name: 'login',
    component: login,
    meta: {
      requiresNotAuth: true
    }
  }
];


const router = new Router({
  routes: routes
});

// 登录中间验证，页面需要登录,而没有登录的情况直接跳转登录
router.beforeEach((to, from, next) => {
  if (to.matched.some(record => record.meta.requiresAuth)) {
    if (store.getters.isLogin) {
      next();
    } else {
      next({
        path: '/login',
        query: {
          redirect: to.fullPath
        }
      });
    }
  } else if (to.matched.some(record => record.meta.requiresNotAuth)) {
    if (store.getters.isLogin) {
      next({
        path: '/'
      });
    } else {
      next();
    }
  } else {
    next();
  }
});

export default router;
