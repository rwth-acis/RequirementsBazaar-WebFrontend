<template>
  <div class="layout-wrapper layout-static layout-static-sidebar-inactive">
    <AppTopbar></AppTopbar>

    <div id="layout">
      <div id="container">
        <div id="content">
          <router-view></router-view>
        </div>
      </div>
      <div id="activityTrackerPlaceholder"></div>
      <ActivityTracker class="activityTracker"></ActivityTracker>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import AppTopbar from './AppTopbar.vue';
import ActivityTracker from './components/ActivityTracker.vue';

export default defineComponent({
  name: 'App',
  components: {
    AppTopbar,
    ActivityTracker
  }
})
</script>

<style scoped>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

#layout {
  display: flex;
  flex-direction: row;
  height: 100vh;
  padding-top: 50px;
}

#container {
  flex: 1;
  display: block;
  margin-left: auto;
  margin-right: auto;
  width: 100%;
  max-width: 980px;
}

#content {
  width: 100%;
}

#activityTrackerPlaceholder {
  width: 250px;
  margin-left: 1rem;
}

.activityTracker {
  position: fixed;
  right: 0;
  width: 250px;
}
</style>