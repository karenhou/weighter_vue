import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import VCharts from 'v-charts'
import VueChartkick from 'vue-chartkick'
import Chart from 'chart.js'
import Vuelidate from 'vuelidate'

Vue.config.productionTip = false;
Vue.use(VCharts);
Vue.use(VueChartkick, {adapter: Chart})
Vue.use(Vuelidate)

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
