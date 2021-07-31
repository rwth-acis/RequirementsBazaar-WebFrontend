<template>
  <h1>{{ t('landing-welcome') }}</h1>
  <h2 style="color:red;">
    This is the BETA environment of Requirements Bazaar, not intended for production usage (there might be bugs!), we might delete data here at any time.
    For production usage (even if it's just a test project) please go to the main instance on <a href="https://requirements-bazaar.org">https://requirements-bazaar.org</a> (without the "beta" in the URL).
    <br />
    <br />
    NEXT DATA RESET (current grace period): August 31, 2021
  </h2>
  <router-link to="/projects">
    <Button :label="t('explore-projects')" />
  </router-link>
</template>

<script lang="ts">
import { defineComponent, computed, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import { useStore } from 'vuex';
import { useRouter } from 'vue-router'

export default defineComponent({
  name: 'Landing',
  props: {
  },
  setup: () => {
    const { t } = useI18n({ useScope: 'global' });
    const store = useStore();
    const router = useRouter()

    const oidcIsAuthenticated = computed(() => store.getters['oidcStore/oidcIsAuthenticated']);
    watch(oidcIsAuthenticated, (newValue) => {
      if (newValue) {
        router.push('/home');
      }
    });

    return {
      t,
    };
  }
})
</script>

<style scoped>
</style>
