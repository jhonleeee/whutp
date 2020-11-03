import Vue from 'vue'
import VueRouter from 'vue-router'
import routes from "./router.config.js"
import App from './App.vue'
import vuetify from './plugins/vuetify'
import VueI18n from 'vue-i18n'
import './registerServiceWorker'
//import i18n from './i18n.config.js'

Vue.config.productionTip = false;
Vue.use(VueRouter,VueI18n);
Vue.use(VueI18n);
const router = new VueRouter(routes);
const i18n = new VueI18n({locale: 'zh',messages: {'zh': require('@/assets/i18n/zhs.json'),'en': require('@/assets/i18n/en.json')}
  });
new Vue({
  vuetify,
  router,
  i18n,
  render: h => h(App)
}).$mount('#app')
