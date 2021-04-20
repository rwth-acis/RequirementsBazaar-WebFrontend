<template>
  <div class="layout-wrapper layout-static layout-static-sidebar-inactive" :class="{'dir-rtl': isRtl}">
    <AppTopbar></AppTopbar>
    <div id="layout" :class="{ 'p-mr-3': !activityTrackerVisible }">
      <div id="container">
        <div id="content">
          <router-view></router-view>
          <ConfirmDialog group="dialog"></ConfirmDialog>
          <ConfirmPopup group="popup"></ConfirmPopup>
        </div>
        <footer>
          <router-link to="/about">About</router-link> <router-link to="/developer">Developer</router-link> <router-link to="/privacy">Privacy</router-link>
        </footer>
      </div>
      <div id="activityTrackerPlaceholder" v-if="activityTrackerVisible"></div>
      <ActivityTracker class="activityTracker" v-if="activityTrackerVisible"></ActivityTracker>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, watch } from 'vue'
import AppTopbar from './components/AppTopbar.vue';
import ActivityTracker from './components/ActivityTracker.vue';
import { useI18n } from 'vue-i18n';

export default defineComponent({
  name: 'App',
  components: {
    AppTopbar,
    ActivityTracker
  },
  setup: () => {
    const { locale } = useI18n({ useScope: 'global' });
    const isRtl = ref(false);
    watch(locale, (newLocale) => {
      isRtl.value = (newLocale === 'fa') ? true : false;
		});

    const activityTrackerVisible = ref(false);

    return { activityTrackerVisible, isRtl };
  }
})
</script>

<style scoped>
.dir-rtl {
  direction: rtl !important;
}

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