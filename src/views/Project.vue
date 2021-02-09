<template>
  <h1>This is a project</h1>
  <div>{{ project.name }}</div>
</template>

<script lang="ts">
import { computed, defineComponent } from 'vue';
import { useStore } from 'vuex';
import { useRoute } from 'vue-router'

export default defineComponent({
  name: 'Project',
  props: {
    id: { type: Number },
  },
  setup: (props) => {
    const store = useStore();
    const route = useRoute();
    const project = computed(() => store.getters.getProjectById(route.params.projectId));

    return { project, id: route.params.projectId }
  }
})
</script>

<style scoped>
</style>
