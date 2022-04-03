<template>
  <div class="layout-wrapper layout-static layout-static-sidebar-inactive" :class="{'dir-rtl': isRtl}">
    <AppTopbar></AppTopbar>
    <div id="layout" :class="{ 'p-mr-3': !activityTrackerVisible }">
      <div id="container">
        <div id="content">
          <GlobalErrorMessage></GlobalErrorMessage>
          <router-view></router-view>
          <ConfirmDialog group="dialog"></ConfirmDialog>
          <ConfirmPopup group="popup"></ConfirmPopup>
        </div>
        <footer>
          <router-link to="/about">{{ t('about') }}</router-link> &middot; <router-link to="/developer">{{ t('developer') }}</router-link> &middot; <a href="https://rwth-aachen.de/disclaimer" target="_blank">{{ t('privacyPolicy') }}</a>
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
import GlobalErrorMessage from './components/GlobalErrorMessage.vue';
import { useI18n } from 'vue-i18n';

export default defineComponent({
  name: 'App',
  components: {
    AppTopbar,
    ActivityTracker,
    GlobalErrorMessage
  },
  setup: () => {
    const { t, locale } = useI18n({ useScope: 'global' });
    const isRtl = ref(false);
    watch(locale, (newLocale) => {
      isRtl.value = (newLocale === 'fa') ? true : false;
		});

    const activityTrackerVisible = ref(false);

    return { t, activityTrackerVisible, isRtl };
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
