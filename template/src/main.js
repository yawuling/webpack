{{#if_eq build "standalone"}}
// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
{{/if_eq}}
import Vue from 'vue'
import App from './App'
import router from './router'
{{#vuex}}
import store from './store'
{{/vuex}}
import axios from 'axios'
{{#isMobile}}
import './utils/flexible'
{{/isMobile}}

Vue.config.productionTip = false

/* if a POST request's header requires 'application/x-www-form-urlencoded',
 * use this config: axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded', and
 * you should use the npm package -- qs.
 * 
 * if you want to intercept the request or response to do something when the project send a request or
 *  get the response from server, please use axios's Interceptors.
 */
Vue.prototype.$http = axios

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  {{#vuex}}
  store,
  {{/vuex}}
  {{#if_eq build "runtime"}}
  render: h => h(App)
  {{/if_eq}}
  {{#if_eq build "standalone"}}
  components: { App },
  template: '<App/>'
  {{/if_eq}}
})
