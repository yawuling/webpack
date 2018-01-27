import Vue from 'vue'
import Router from 'vue-router'
import Home from '@/pages/home/index'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Home',
      component: Home
      // if you want to set the page keep-alive, use the config:
      // meta: {
      //   keepAlive: true
      // }
    }
  ]
})
