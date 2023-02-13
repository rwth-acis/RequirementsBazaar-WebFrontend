<template>
    <h1>{{t('recentActivities')}}</h1>
    <ActivityTracker />
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { useI18n } from 'vue-i18n';

import ActivityTracker from '@/components/ActivityTracker.vue';

export default defineComponent({
  components: {
    ActivityTracker
  },
  name: 'ActivityTrackerView',
  setup() {
    const { t } = useI18n({ useScope: 'global' });
    return {
        t,
    };
  },
})
</script>
