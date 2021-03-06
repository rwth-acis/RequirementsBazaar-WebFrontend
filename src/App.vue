<template>
  <div class="layout-wrapper layout-static layout-static-sidebar-inactive">
    <AppTopbar></AppTopbar>

    <div id="layout">
      <div id="container">
        <div id="content">
          <router-view></router-view>
        </div>
        <footer>
          <router-link to="/about">About</router-link> <router-link to="/developer">Developer</router-link> <router-link to="/privacy">Privacy</router-link>
        </footer>
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
  margin-left: 1rem;
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

footer {
  margin-top: 3rem;
  padding-bottom: 4rem;
  width: 100%;
}
</style>