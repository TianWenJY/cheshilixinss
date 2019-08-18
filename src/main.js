// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue';
import App from './App';
import VueResource from 'vue-resource'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import router from './router';
import "@/common/common.css";
import commonJs from '@/utils/utils';
import Base from 'js-base64';
import BabelPolyFill from 'babel-polyfill';
import store from './store/index';
import VueAwesomeSwiper from "vue-awesome-swiper";
import "swiper/dist/css/swiper.css";
import VueQuillEditor from 'vue-quill-editor';


// require styles



Vue.config.productionTip = false;
Vue.use(VueAwesomeSwiper)
Vue.use(VueResource);
Vue.use(ElementUI);
Vue.use(commonJs);
Vue.use(Base);
Vue.use(BabelPolyFill);
Vue.use(VueQuillEditor);

/* eslint-disable no-new */
const myapp = new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>'
});

Vue.http.interceptors.push((request, next) => {
  request.method = 'POST';
  next((response) => {
    if (response.status == 200) {
      return response;
    } else {
      if (response.status >= 500) {
      } else if (response.status === 404) {
        Vue.$router.push({ path: "/404" });
      }
      return response;
    }
  })
})

// router.beforeEach((to, from, next) => {
//   // 登录界面登录成功之后，会把用户信息保存在会话
//   // 存在时间为会话生命周期，页面关闭即失效。
//   let userName = sessionStorage.getItem('__TOKEN__')
//   if (to.path === '/login') {
//     // 如果是访问登录界面，如果用户会话信息存在，代表已登录过，跳转到主页
//          next()
//   } else {
//     if (!userName) {
//       // 如果访问非登录界面，且户会话信息不存在，代表未登录，则跳转到登录界面
//       next({ path: '/login' })
//     } else {
//       // 加载动态菜单和路由
//       // addDynamicMenuAndRoutes(userName, to, from)
//       next()
//     }
//   }
// })
export { myapp };



