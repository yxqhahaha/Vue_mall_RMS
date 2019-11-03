import Vue from 'vue'
import Router from 'vue-router'
import Login  from "./components/Login.vue";


Vue.use(Router);

const router = new Router({
  routes: [
    { path: '/', redirect: '/login' },
    {path: '/login', component: Login}
  ]
});

export default router
