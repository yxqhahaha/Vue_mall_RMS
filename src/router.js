import Vue from 'vue'
import Router from 'vue-router'
import Login  from "./components/Login.vue";
import Home  from "./components/Home.vue";
import Welcome from "./components/Welcome";
import Users from "./components/user/Users";

Vue.use(Router);

const router = new Router({
  routes: [
    { path: '/', redirect: '/login' },
    {path: '/login', component: Login},
    {
      path: '/home',
      component: Home,
      redirect : '/welcome',
      children : [
        {path : '/users', component : Users},
        {path : '/welcome', component : Welcome}
      ]
    },
  ]
});


// 挂载路由导航守卫
router.beforeEach((to, from, next) => {
  // to 将要访问的路径
  // from  v
  // next 是一个函数，表示放行
  //     next()  放行    next('/login')  强制跳转

  if (to.path === '/login') return next();
  // 获取token
  const tokenStr = window.sessionStorage.getItem('token');
  if (!tokenStr) return next('/login');
  next()
});


export default router