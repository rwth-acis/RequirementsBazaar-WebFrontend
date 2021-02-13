<template>
  <h1>This is a project</h1>
  <div>{{ project?.name }}</div>
  <div v-for="category in categories" :key="category.id">
    <div>
      <div><router-link :to="'/projects/' + project.id + '/categories/' + category.id">{{ category.name }}</router-link></div>
    </div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, onMounted } from 'vue';
import { useStore } from 'vuex';
import { useRoute } from 'vue-router'
import { ActionTypes } from '../store/actions';

export default defineComponent({
  name: 'Project',
  props: {
  },
  setup: (props) => {
    const store = useStore();
    const route = useRoute();
    
    const projectId = Number.parseInt(route.params.projectId.toString(), 10);

    const project = computed(() => store.getters.getProjectById(projectId));
    store.dispatch(ActionTypes.FetchProject, projectId)

    const parameters = computed(() => {return {query: {per_page: 20, sort: '-name', search: ''}}});
    const categories = computed(() => store.getters.categoriesList(projectId, parameters.value));
    store.dispatch(ActionTypes.FetchCategoriesOfProject, {projectId: projectId, query: parameters.value})

    return { project, id: route.params.projectId, categories }
  }
})
</script>

<style scoped>
</style>
