<template>
  <div id="app">
    {{#keepAlivePage}}
    <keep-alive>
      <router-view v-if="$route.meta.keepAlive"></router-view>      
    </keep-alive>
    <router-view v-if="!$route.meta.keepAlive"></router-view>
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

{{#isMobile}}
{{#if_eq preCss "less"}}
<style lang="less">
@import "./assets/css/variable.less";

html, body{
  font-size: 26/@fs-flex;
}
</style>
{{/if_eq}}
{{#if_eq preCss "scss"}}
<style lang="scss">
@import "./assets/css/variable.scss";

html, body{
  font-size: 26/$fs-flex;
}
</style>
{{/if_eq}}
{{#if_eq preCss "none"}}
<style>
html, body{
  font-size: 0.346rem;
}
</style>
{{/if_eq}}
{{/isMobile}}