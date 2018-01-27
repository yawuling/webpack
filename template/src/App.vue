<template>
  <div id="app">
    {{#keepAlivePage}}
    <keep-alive v-if="$route.meta.keepAlive">
      <router-view/>      
    </keep-alive>
    <router-view v-else></router-view>
    {{else}}
    <router-view></router-view>
    {{/keepAlivePage}}
  </div>
</template>

<script>
export default {
  name: 'App'
}
</script>

