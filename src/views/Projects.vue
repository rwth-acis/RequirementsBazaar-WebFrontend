<template>
  <h1>Projects List</h1>
  <span class="p-input-icon-left">
    <i class="pi pi-search" />
    <InputText type="text" v-model="searchQuery" placeholder="Search" />
  </span>
  <div v-for="project in projects" :key="project.id">
    <div>
      <div><router-link :to="'/projects/' + project.id">{{ project.name }}</router-link></div>
    </div>
  </div>
</template>

<script lang="ts">
import { computed, ref, watch, defineComponent, onMounted } from 'vue';
import { useStore } from 'vuex';
import { ActionTypes } from '../store/actions';

export default defineComponent({
  name: 'Projects',
  props: {
  },
  setup: () => {
    const store = useStore();
    
    const searchQuery = ref('');

    const parameters = computed(() => {return { per_page: 20, sort: '-name', search: searchQuery.value }});
    const projects = computed(() => store.getters.projectsList(parameters.value));

    onMounted(() => store.dispatch(ActionTypes.FetchProjects, parameters.value));

    watch(searchQuery, () => store.dispatch(ActionTypes.FetchProjects, parameters.value));

    return {
      projects,
      searchQuery
    };
  }
})
</script>

<style scoped>
</style>
