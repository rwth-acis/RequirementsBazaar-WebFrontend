<template>
  <div class="layout-wrapper layout-static layout-static-sidebar-inactive">
    <AppTopbar></AppTopbar>

    <div id="content">
      <router-view></router-view>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import AppTopbar from './AppTopbar.vue';

export default defineComponent({
  name: 'App',
  components: {
    AppTopbar
  }
})
</script>

<style scoped>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

#content {
  margin-top: 50px;
}
</style>