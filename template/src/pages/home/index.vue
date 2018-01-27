<template>
  <div class="page">
    {{#keepAlivePage}}
    <p>This page uses 'keep-alive' tag.It can save it's state when you jump to other page.</p>
    {{/keepAlivePage}}
    <img :src="mockData.logo">    
    <p>{{ mockData.message }}</p>
    <hello-world />
  </div>
</template>

<script>
import api from '../../api'
import HelloWorld from '../../components/HelloWorld'

const REQUEST_SUCCESS = 1

export default {
  data() {
    return {
      mockData: {}
    }
  },
  components: {
    HelloWorld
  },
  methods: {
    getMockData() {
      this.$http.get(api.home.example).then(res => {
        if (res.data.code === REQUEST_SUCCESS) {
          this.mockData = res.data.data
        }
      })
    }
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
