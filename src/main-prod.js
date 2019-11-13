import Vue from 'vue';
import App from './App.vue';
// 引入所有
import ElementUI from 'element-ui';
import TreeTable from 'vue-table-with-tree-grid'
// 导入路由
import router from './router.js';
// 导入字体图标
import './assets/fonts/iconfont.css';

// import VueRouter from 'vue-router'
import 'element-ui/lib/theme-chalk/index.css';
import './plugins/element.js';
// 导入富文本编辑器
import VueQuillEditor from 'vue-quill-editor'
// 导入nprogress
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'

// require styles 导入富文本编辑器对应的样式
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'

// 引入全局样式表
import './assets/css/global.css';
import axios from 'axios';
// 配置请求的跟路径
axios.defaults.baseURL = 'http://127.0.0.1:8888/api/private/v1/';
//请求在到达服务器之前，先会调用use中的这个回调函数来添加请求头信息
axios.interceptors.request.use(config=>{
  // 在request拦截器中,展示进度条
  NProgress.start();
  //为请求头对象，添加token验证的Authorization字段
  config.headers.Authorization = window.sessionStorage.getItem("token")
  return config
})
// 在response中隐藏进度条
axios.interceptors.response.use(response => {
  NProgress.done();
  // Do something before response is sent
  return response;
  },error => {
  // Do something with response error
  return Promise.reject(error);
});
Vue.prototype.$http = axios;
Vue.config.productionTip = false;
// 过滤器
Vue.filter('dateFormat', function(originVal){
    const dt = new Date(originVal);
    const y = dt.getFullYear();
    const m = (dt.getMonth() + 1 + '').padStart(2, '0'); // padStart(总长度为多少位, 长度不足用什么来补足)
    const d = (dt.getDate()  + '').padStart(2, '0');

    const hh = (dt.getHours() + '').padStart(2, '0');
    const mm = (dt.getMinutes() + '').padStart(2, '0');
    const ss = (dt.getSeconds() + '').padStart(2, '0');

    return `${y}-${m}-${d} : ${hh}:${mm}:${ss}`;
})
// 将富文本编辑器注册为全局可用
Vue.use(VueQuillEditor, /* { default global options } */)

Vue.use(ElementUI);
// 注册为全局可用的组件
Vue.component('tree-table', TreeTable);

new Vue({
  router,
  render: h => h(App),
}).$mount('#app');