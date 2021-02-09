<template>
  <h1>Projects List</h1>
  <div v-for="project in projects" :key="project.id">
    <div>
      <div><router-link :to="'/projects/' + project.id">{{ project.name }}</router-link></div>
    </div>
  </div>
</template>

<script lang="ts">
import { computed, ref, defineComponent, onMounted } from 'vue';
import { useStore } from 'vuex';
import { ActionTypes } from '../store/actions';

export default defineComponent({
  name: 'Projects',
  props: {
  },
  setup: () => {
    const store = useStore();
    const projects = computed(() => store.getters.projectsList);
    onMounted(() => (store.getters.projectsList.length === 0) ? store.dispatch(ActionTypes.FetchProjects) : null);

    return { projects };
  }
})
</script>

<style scoped>
</style>
