<template>
  <h1>{{ t('landing-welcome') }}</h1>
  <h2 style="color:red;">
    This is the BETA environment of Requirements Bazaar, not intended for production usage, we might delete data here at any time.
    For production usage (even if it's just a test project) please go to the main instance.
  </h2>
  <router-link to="/projects">{{ t('explore-projects') }}</router-link>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { useI18n } from 'vue-i18n';

export default defineComponent({
  name: 'Landing',
  props: {
  },
  setup: () => {
    const { t } = useI18n({ useScope: 'global' });
    return { t }
  }
})
</script>

<style scoped>
</style>
