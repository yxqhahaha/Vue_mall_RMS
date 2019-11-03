import Vue from 'vue'
import Router from 'vue-router'
import Login  from "./components/Login.vue";


Vue.use(Router);

const router = new Router({
  routes: [
    { path: '/', redirect: '/login' },
    {path: '/login', component: Login},
    {path: '/home', component: Home},
  ]
});

// 挂载路由导航守卫
router.bedoreEach((to, from, next) => {
  // 将要访问的路径
  // from 代表从哪个路径跳转而来
  // next 是一个函数，表示放行， next() 放行 next('./login) 强制跳转

  // if(to.path)
})

// export default router
