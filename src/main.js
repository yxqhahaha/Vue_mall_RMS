import Vue from 'vue'
import App from './App.vue'
import ElementUI from 'element-ui';
// 导入路由
import router from './router.js'
// import VueRouter from 'vue-router'
import 'element-ui/lib/theme-chalk/index.css';
import './plugins/element.js'
// 引入全局样式表
import './assets/css/global.css'

Vue.config.productionTip = false

/* 
new Vue({
  render: h => h(App),
}).$mount('#app')
 */
Vue.use(ElementUI);

new Vue({
  router,
  render: h => h(App),
}).$mount('#app');