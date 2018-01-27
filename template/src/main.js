{{#if_eq build "standalone"}}
// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
{{/if_eq}}
import Vue from 'vue'
import App from './App'
import router from './router'
import axios from 'axios'
import { REQUEST_HOST } from './config'

Vue.config.productionTip = false

// set the request's common path
axios.defaults.baseUrl = REQUEST_HOST
/* if a POST request's header requires 'application/x-www-form-urlencoded',
 * use this config: axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded', and
 * you should use the npm package -- qs.
 * 
 * if you want to intercept the request or response to do something when the project send a request or
 *  get the response from server, please use axios's Interceptors.
 */

/* eslint-disable no-new */
new Vue({
  el: '#app',
  {{#router}}
  router,
  {{/router}}
  {{#if_eq build "runtime"}}
  render: h => h(App)
  {{/if_eq}}
  {{#if_eq build "standalone"}}
  components: { App },
  template: '<App/>'
  {{/if_eq}}
})
