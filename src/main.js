import Vue from 'vue'
import Vuex from 'vuex'
import App from './App.vue'
import axios from 'axios'
import VueCookies from 'vue-cookies'
import VueRouter from './router'
import router from './router/index'
import _ from 'lodash'
import Progress from 'vue-multiple-progress'
import Toasted from 'vue-toasted'
import store from './store/store'
import Vue2Editor from "vue2-editor";
// Main JS (in UMD format)
import VueTimepicker from 'vue2-timepicker'
// CSS
import 'vue2-timepicker/dist/VueTimepicker.css'
import * as VueGoogleMaps from "vue2-google-maps" // Import package
Vue.use(VueGoogleMaps, {
  load: {
    key: "KEY",
    libraries: "places"
  }
});
Vue.config.productionTip = false
Vue.component('VmProgress', Progress)
Vue.use(Vuex)
Vue.use(axios)
Vue.prototype.$axios = axios
Vue.use(VueCookies)
Vue.use(VueRouter)

Object.defineProperty(Vue.prototype, '$_', { value: _ })
Vue.use(require('vue-moment'));
Vue.use(Vue2Editor);
Vue.use(VueTimepicker);



let Options = {
  position : 'bottom-right',
  duration : 3000,
  keepOnHover : true
}
Vue.use(Toasted, Options)
String.prototype.capitalize = function() {
  return this.charAt(0).toUpperCase() + this.slice(1);
}

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
