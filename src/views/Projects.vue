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
  <masonry-layout maxcolwidth="400" gap="15" cols="auto">
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
  </masonry-layout>
  <div id="sentinel"></div>
</template>

<script lang="ts">
import { computed, ref, watch, defineComponent, onMounted } from 'vue';
import { useStore } from 'vuex';
import { ActionTypes } from '../store/actions';

import '@appnest/masonry-layout';
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
      {name: 'Last Activity', value: 'last_activity'},
      {name: 'Creation Date', value: 'date'},
      {name: 'Number of Requirements', value: 'requirement'},
      {name: 'Number of Followers', value: 'follower'},
    ];
    const sortAscending = ref(true);
    const page = ref(0);
    const perPage = ref(20);

    let firstLoadComplete = false;
    onMounted(() => {
      const sentinel = document.getElementById('sentinel');
      if (sentinel) {
        const observer = new IntersectionObserver((intersections) => {
          const intersection = intersections[0];
          //const isSentinelVisible = intersection.isIntersecting;
          if (firstLoadComplete && intersection.isIntersecting) {
            page.value += 1;
          } else {
            firstLoadComplete = true;
          }
        }, {
          rootMargin: '0px 0px 400px 0px',
        })
        observer.observe(sentinel);
      }
    });

    const sort = computed(() => `${sortAscending.value ? '+' : '-'}${selectedSort.value}`);
    const parameters = computed(() => {return {page: page.value, per_page: perPage.value, sort: sort.value, search: searchQuery.value}});
    const projects = computed(() => store.getters.projectsList(parameters.value));
    store.dispatch(ActionTypes.FetchProjects, {query: parameters.value});
    watch(selectedSort, () => {
      //sortAscending.value = !['last_activity', 'date', 'requirement', 'follower'].includes(selectedSort.value);
      sortAscending.value = selectedSort.value === 'name';
    });
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
</style>
