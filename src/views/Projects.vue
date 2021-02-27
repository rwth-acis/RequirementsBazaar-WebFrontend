<template>
  <h1>Explore Projects</h1>
  Take a look at the public projects on Requirements Bazaar.
  <h2>Featured Projects</h2>

  Contact us to get featured!
  <h2>All Projects</h2>
  <FilterPanel
    v-model:searchQuery="searchQuery"
    :sortOptions="sortOptions"
    v-model:selectedSort="selectedSort"
    v-model:sortAscending="sortAscending">
  </FilterPanel>
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

import FilterPanel from '../components/FilterPanel.vue';
import ProjectCard from '../components/ProjectCard.vue';

export default defineComponent({
  name: 'Projects',
  components: { FilterPanel, ProjectCard },
  props: {
  },
  setup: () => {
    const store = useStore();
    
    const searchQuery = ref('');
    const selectedSort = ref('name');
    const sortOptions = [
      {name: 'Alphabetically', value: 'name'},
      {name: 'Activity', value: 'last_activity'},
      {name: 'Creation Date', value: 'date'},
      {name: 'Number of Requirements', value: 'requirement'},
      {name: 'Number of Followers', value: 'follower'},
    ];
    const sortAscending = ref(true);

    const sort = computed(() => `${sortAscending.value ? '+' : '-'}${selectedSort.value}`);
    const parameters = computed(() => {return {per_page: 20, sort: sort.value, search: searchQuery.value}});
    const projects = computed(() => store.getters.projectsList(parameters.value));

    store.dispatch(ActionTypes.FetchProjects, {query: parameters.value});

    watch(parameters, () => store.dispatch(ActionTypes.FetchProjects, {query: parameters.value}));

    return {
      projects,
      searchQuery,
      selectedSort,
      sortOptions,
      sortAscending,
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
