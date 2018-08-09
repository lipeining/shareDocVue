import Vue from 'vue'
import Router from 'vue-router'
import index from '@/components/index'
import login from '@/views/login'
import profile from '@/views/profile'
import reg from '@/views/reg'
import store from '@/vuex/user'
import timeslider from '@/views/timeslider'
import doc from '@/views/doc'

Vue.use(Router)


let routes = [{
    path: '/',
    name: 'index',
    component: index,
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
  },  
  {
    path: '/reg',
    name: 'reg',
    component: reg,
    meta: {
      requiresNotAuth: true
    }
  },
  {
    path: '/profile',
    name: 'profile',
    component: profile,
    meta: {
      requiresAuth: true
    }
  },
  {
    path: '/timeslider',
    name: 'timeslider',
    component: timeslider,
    meta: {
      requiresAuth: true
    }
  },
  {
    path: '/doc',
    name: 'doc',
    component: doc,
    meta: {
      requiresAuth: true
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
