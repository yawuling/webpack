<template>
  <div class="page">
    {{#keepAlivePage}}
    <p>This page uses 'keep-alive' tag.It can save it's state when you jump to other page.</p>
    {{/keepAlivePage}}
    <img :src="msg.logo">    
    <p>{{ msg.message }}</p>
    <hello-world />
  </div>
</template>

<script>
{{#vuex}}
import { createNamespacedHelpers } from 'vuex'
const { mapState, mapActions } = createNamespacedHelpers('home')
{{else}}
import api from '../../api'
{{/vuex}}
import HelloWorld from '../../components/HelloWorld'

const REQUEST_SUCCESS = 1

export default {
  {{#vuex}}
  computed: {
    ...mapState([
      'msg'
    ])
  },
  {{else}}
  data() {
    return {
      msg: {}
    }
  },
  {{/vuex}}  
  components: {
    HelloWorld
  },
  methods: {
    {{#vuex}}
    ...mapActions([
      'getMsg'
    ])
    {{else}}
    getMsg() {
      {{#if_eq requestNpm "axios"}}
      return axios.get(api.home.example).then(res => {
        if (res.data.code === REQUEST_SUCCESS) {
          this.msg = res.data.data
        }
      })
      {{/if_eq}}
      {{#if_eq requestNpm "jsonp"}}
      return fetchJsonp(api.home.example).then(res => {
        return res.json()
      }).then(res => {
        if (res.code === REQUEST_SUCCESS) {
          this.msg = res.data
        }
      })
      {{/if_eq}}
      {{#if_eq requestNpm "two"}}
      return axios.get(api.home.example).then(res => {
        if (res.data.code === REQUEST_SUCCESS) {
          this.msg = res.data.data
        }
      })
      {{/if_eq}}
    }
    {{/vuex}}
  },
  created() {
    this.getMsg()
  }
}
</script>

<style>
.page{
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
