<template>
  <h1 style="text-align: center">{{ t('landing-welcome') }}</h1>
  <!--<h2 style="color:red;">
    This is the BETA environment of Requirements Bazaar, not intended for production usage (there might be bugs!), we might delete data here at any time.
    For production usage (even if it's just a test project) please go to the main instance on <a href="https://requirements-bazaar.org">https://requirements-bazaar.org</a> (without the "beta" in the URL).
    <br />
    <br />
    NEXT DATA RESET (current grace period): September 30, 2021
  </h2>-->
  <div class="p-grid">
    <div class="p-col">
      <img src="/reqbaz-responsive.png" style="max-width: 400px;">
    </div>
    <div class="p-col">
      <h2>{{ t('lp-title') }}</h2>
      <div class="description">
        {{ t('lp-desc') }}
      </div>
      <router-link to="/projects">
        <Button :label="t('explore-projects')" />
      </router-link>
    </div>
  </div>

  <h2>{{ t('landing-how-it-works') }}</h2>
  <div class="description">
    <div>{{ t('landing-step-1') }}</div>
    <div>{{ t('landing-step-2') }}</div>
    <div>{{ t('landing-step-3') }}</div>
  </div>

  <h2>{{ t('landing-try-it-out') }}</h2>
  <div class="description">
    <div>{{ t('takeAlook') }}</div>
  </div>

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
  .description {
    font-size: 15pt;
    margin-bottom: 20px;
  }
</style>
