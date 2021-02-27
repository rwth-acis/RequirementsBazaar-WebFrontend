<template>
  <h1>This is category {{ category?.name }}</h1>
  <div id="description">
    {{ category?.description }}
  </div>
  <div id="addRequirementPanel">
    <Button label="Add new Requirement..." />
  </div>
  <TabView id="tabView">
    <TabPanel header="Active Ideas">
      <FilterPanel
        v-model:searchQuery="searchQuery"
        :sortOptions="sortOptions"
        v-model:selectedSort="selectedSort">
      </FilterPanel>
      <div id="requirementsList">
        <div v-for="requirement in requirements" :key="requirement.id" class="requirementCard">
          <RequirementCard
            :id="requirement.id"
            :name="requirement.name"
            :description="requirement.description"
            :numberOfComments="requirement.numberOfComments">
          </RequirementCard>
        </div>
      </div>
    </TabPanel>
    <TabPanel header="Finished Ideas">
      This is a list of finished requirements.
    </TabPanel>
  </TabView>
</template>

<script lang="ts">
import { computed, defineComponent, ref } from 'vue';
import { useStore } from 'vuex';
import { useRoute } from 'vue-router'
import { ActionTypes } from '../store/actions';

import FilterPanel from '../components/FilterPanel.vue';
import RequirementCard from '../components/RequirementCard.vue';

export default defineComponent({
  name: 'Category',
  components: { FilterPanel, RequirementCard },
  props: {
  },
  setup: (props) => {
    const store = useStore();
    const route = useRoute();
    
    const categoryId = Number.parseInt(route.params.categoryId.toString(), 10);

    const category = computed(() => store.getters.getCategoryById(categoryId));
    store.dispatch(ActionTypes.FetchCategory, categoryId);

    const parameters = computed(() => {return {per_page: 20, sort: '-name', search: ''}});
    const requirements = computed(() => store.getters.requirementsList(categoryId, parameters.value));
    store.dispatch(ActionTypes.FetchRequirementsOfCategory, {categoryId: categoryId, query: parameters.value})

    const searchQuery = ref('');

    const selectedSort = ref('name');
    const sortOptions = [
      {name: 'Alphabetically', value: 'name'},
      {name: 'Activity', value: 'last_activity'},
      {name: 'Creation Date', value: 'date'},
      {name: 'Number of Requirements', value: 'requirement'},
      {name: 'Number of Followers', value: 'follower'},
    ];

    return { category, requirements, searchQuery, sortOptions, selectedSort }
  }
})
</script>

<style scoped>
  #description {
    margin-bottom: 2rem;
  }

  #addRequirementPanel {
    margin-bottom: 1.5rem;
  }

  #tabView ::v-deep(.p-tabview-nav), #tabView ::v-deep(.p-tabview-nav-link) {
    background-color: transparent;
  }

  #tabView ::v-deep(.p-tabview-panels) {
    background-color: transparent;
  }

  #requirementsList {
    display: flex;
    flex-flow: column;
    align-items: center;
    width: 100%;
  }

  .requirementCard {
    width: 100%;
    max-width: 700px;
    margin: 10px;
  }
</style>
