<template>
    <Message v-for="error in uncoughtErrors" :key="error.timestamp" severity="error" :closable="true">
      <div>
        <div>{{error.message}}</div>
        <div style="font-size: 0.8rem"><i>Source: {{error.source}}</i></div>
      </div>
    </Message>
</template>

<script lang="ts">
import { computed, defineComponent } from 'vue';
import { useStore } from 'vuex';
import { useI18n } from 'vue-i18n';

export default defineComponent({
  name: 'GlobalErrorMessage',
  setup: () => {
    const { locale, t } = useI18n({ useScope: 'global' });
    const store = useStore();

    const uncoughtErrors = computed(() => store.getters.unhandledErrors());

    return {
      uncoughtErrors
    };
  },
})
</script>
