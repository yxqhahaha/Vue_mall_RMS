import Vue from 'vue'
import Router from 'vue-router'
const Login = () => import(/* webpackChunkName:"login_home_welcome" */ './components/Login.vue')
const Home = () => import(/* webpackChunkName:"login_home_welcome" */ './components/Home.vue')
const Welcome = () => import(/* webpackChunkName:"login_home_welcome" */ './components/Welcome.vue')
// import Login  from "./components/Login.vue";
// import Home  from "./components/Home.vue";
// import Welcome from "./components/Welcome.vue";

const Users = () => import(/* webpackChunkName:"users_roles_rights" */ './components/user/Users.vue')
const Roles = () => import(/* webpackChunkName:"users_roles_rights" */ './components/power/Roles.vue')
const Rights = () => import(/* webpackChunkName:"users_roles_rights" */ './components/power/Rights.vue')
// import Users from "./components/user/Users.vue";
// import Roles from "./components/power/Roles.vue"
// import Rights from "./components/power/Rights.vue"

const Cate = () => import(/* webpackChunkName:"cate_params_goodList" */ './components/goods/Cate.vue')
const Params = () => import(/* webpackChunkName:"cate_params_goodList" */ './components/goods/Params.vue')
const GoodsList = () => import(/* webpackChunkName:"cate_params_goodList" */ './components/goods/List.vue')
const Add = () => import(/* webpackChunkName:"cate_params_goodList" */ './components/goods/Add.vue')
// import Cate from "./components/goods/Cate.vue"
// import Params from "./components/goods/Params.vue"
// import GoodsList from "./components/goods/List.vue"
// import Add from "./components/goods/add.vue"


const Order = () => import(/* webpackChunkName:"order" */ './components/order/Order.vue')
// import Order from "./components/order/Order.vue"
const Report = () => import(/* webpackChunkName:"report" */ './components/report/Report.vue')
// import Report from "./components/report/Report.vue"

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
        {path : '/orders', component : Order},
        {path : '/reports', component : Report},
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