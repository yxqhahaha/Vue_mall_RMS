import Vue from 'vue'
import Router from 'vue-router'
import Login  from "./components/Login.vue";
import Home  from "./components/Home.vue";
import Welcome from "./components/Welcome";
import Users from "./components/user/Users";
import Roles from "./components/power/Roles.vue"
import Rights from "./components/power/Rights.vue"
import Cate from "./components/goods/Cate.vue"
import Params from "./components/goods/Params.vue"
import GoodsList from "./components/goods/List.vue"
import Add from "./components/goods/add.vue"

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
        {path : '/welcome', component : Welcome},
        {path : '/roles', component : Roles},
        {path : '/Rights', component : Rights},
        {path : '/categories', component : Cate},
        {path : '/params', component : Params},
        {path : '/goods', component : GoodsList},
        {path : '/goods/add', component : Add},
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

/**
 * 重写路由的push方法
 */
const routerPush = Router.prototype.push
Router.prototype.push = function push(location) {
  return routerPush.call(this, location).catch(error=> error)
}

export default router