import Vue from 'vue';
import App from './App.vue';
// 引入所有
import ElementUI from 'element-ui';

// 导入路由
import router from './router.js';
// 导入字体图标
import './assets/fonts/iconfont.css';

// import VueRouter from 'vue-router'
import 'element-ui/lib/theme-chalk/index.css';
import './plugins/element.js';
// 引入全局样式表
import './assets/css/global.css';
import axios from 'axios';
// 配置请求的跟路径
axios.defaults.baseURL = 'http://127.0.0.1:8888/api/private/v1/';
//请求在到达服务器之前，先会调用use中的这个回调函数来添加请求头信息
axios.interceptors.request.use(config=>{
  //为请求头对象，添加token验证的Authorization字段
  config.headers.Authorization = window.sessionStorage.getItem("token")
  return config
})
Vue.prototype.$http = axios;
Vue.config.productionTip = false;

Vue.use(ElementUI);

new Vue({
  router,
  render: h => h(App),
}).$mount('#app');