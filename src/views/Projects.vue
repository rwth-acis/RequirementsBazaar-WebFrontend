<template>
  <h1>Projects List</h1>
  <span class="p-input-icon-left">
    <i class="pi pi-search" />
    <InputText type="text" v-model="searchQuery" placeholder="Search" />
  </span>
  <div id="grid">
    <div v-for="project in projects" :key="project.id" class="projectCard">
      <router-link :to="'/projects/' + project.id">
        <ProjectCard
          :id="project.id"
          :name="project.name"
          :description="project.description"
          :numberOfCategories="project.numberOfCategories"
          :numberOfFollowers="project.numberOfFollowers"
          :numberOfRequirements="project.numberOfRequirements">
        </ProjectCard>
      </router-link>
    </div>
  </div>
</template>

<script lang="ts">
import { computed, ref, watch, defineComponent, onMounted } from 'vue';
import { useStore } from 'vuex';
import { ActionTypes } from '../store/actions';

import ProjectCard from '../components/ProjectCard.vue';

export default defineComponent({
  name: 'Projects',
  components: { ProjectCard },
  props: {
  },
  setup: () => {
    const store = useStore();
    
    const searchQuery = ref('');

    const parameters = computed(() => {return {per_page: 20, sort: '-name', search: searchQuery.value}});
    const projects = computed(() => store.getters.projectsList(parameters.value));

    store.dispatch(ActionTypes.FetchProjects, {query: parameters.value});

    watch(searchQuery, () => store.dispatch(ActionTypes.FetchProjects, parameters.value));

    return {
      projects,
      searchQuery
    };
  }
})
</script>

<style scoped>
  #grid {
    display: flex;
    width: 100%;
    justify-content: center;
    flex-flow: wrap;
  }

  .projectCard {
    width: 300px;
    margin: 10px;
  }
</style>
