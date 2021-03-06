<template>
  <h1>This is project {{ project?.name }}</h1>
  <div id="description">
    {{ project?.description }}
  </div>
  <TabView id="tabView">
    <TabPanel header="Overview">
      <FilterPanel
        v-model:searchQuery="searchQuery"
        :sortOptions="sortOptions"
        v-model:selectedSort="selectedSort"
        v-model:sortAscending="sortAscending">
      </FilterPanel>
      <div id="categoriesList">
        <div v-for="category in categories" :key="category.id" class="categoryCard">
          <router-link :to="'/projects/' + project?.id + '/categories/' + category?.id">
            <CategoryCard
              :id="category.id"
              :name="category.name"
              :description="category.description"
              :numberOfFollowers="category.numberOfFollowers"
              :numberOfRequirements="category.numberOfRequirements">
            </CategoryCard>
          </router-link>
        </div>
      </div>
    </TabPanel>
    <TabPanel header="All Categories">
      This is a list of all categories.
    </TabPanel>
  </TabView>
</template>

<script lang="ts">
import { computed, defineComponent, ref, watch } from 'vue';
import { useStore } from 'vuex';
import { useRoute } from 'vue-router'
import { ActionTypes } from '../store/actions';

import FilterPanel from '../components/FilterPanel.vue';
import CategoryCard from '../components/CategoryCard.vue';

export default defineComponent({
  components: {
    FilterPanel,
    CategoryCard,
  },
  name: 'Project',
  props: {
  },
  setup: (props) => {
    const store = useStore();
    const route = useRoute();
    
    const projectId = Number.parseInt(route.params.projectId.toString(), 10);
    const project = computed(() => store.getters.getProjectById(projectId));
    store.dispatch(ActionTypes.FetchProject, projectId);

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
    const sort = computed(() => `${sortAscending.value ? '+' : '-'}${selectedSort.value}`);
    const parameters = computed(() => {return {page: page.value, per_page: perPage.value, sort: sort.value, search: searchQuery.value}});
    const categories = computed(() => store.getters.categoriesList(projectId, parameters.value));
    store.dispatch(ActionTypes.FetchCategoriesOfProject, {projectId: projectId, query: parameters.value});
    watch(selectedSort, () => {
      sortAscending.value = selectedSort.value === 'name';
    });
    watch(parameters, () => store.dispatch(ActionTypes.FetchCategoriesOfProject, {projectId: projectId, query: parameters.value}));

    return { project, categories, searchQuery, selectedSort, sortOptions, sortAscending }
  }
})
</script>

<style scoped>
  #description {
    margin-bottom: 2rem;
  }

  #tabView ::v-deep(.p-tabview-nav), #tabView ::v-deep(.p-tabview-nav-link) {
    background-color: transparent;
  }

  #tabView ::v-deep(.p-tabview-panels) {
    background-color: transparent;
  }

  #categoriesList {
    display: flex;
    flex-flow: column;
    align-items: center;
    width: 100%;
  }

  .categoryCard {
    width: 700px;
    margin: 10px;
  }
</style>
