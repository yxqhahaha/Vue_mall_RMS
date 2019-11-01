import Vue from 'vue'
import App from './App.vue'
import ElementUI from 'element-ui';
// import VueRouter from 'vue-router'
import 'element-ui/lib/theme-chalk/index.css';
import './plugins/element.js'
Vue.config.productionTip = false
/* 
new Vue({
  render: h => h(App),
}).$mount('#app')
 */
Vue.use(ElementUI);

new Vue({
  el: '#app',
  render: h => h(App)
});