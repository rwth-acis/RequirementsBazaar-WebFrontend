<template>
  <h1>{{ t('home-welcome') }}</h1>

  <Dashboard v-if="oidcIsAuthenticated"></Dashboard>

</template>

<script lang="ts">
import { computed, defineComponent } from 'vue';
import { useI18n } from 'vue-i18n';
import { useStore } from 'vuex';

import Dashboard from '../components/DashboardList.vue';

export default defineComponent({
  name: 'Home',
  components: {
    Dashboard,
  },
  props: {
  },
  setup: () => {
    const { t } = useI18n({ useScope: 'global' });
    const store = useStore();
    const oidcIsAuthenticated = computed(() => store.getters['oidcStore/oidcIsAuthenticated']);

    return {
      t,
      oidcIsAuthenticated,
    };
  }
})
</script>

<style scoped>
</style>
