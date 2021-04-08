<template>
  <ScrollTop />
  <h1>This is category {{ category?.name }}</h1>
  <div id="description">
    {{ category?.description }}
  </div>
  <div id="addRequirementPanel">
    <Button label="Add new Requirement..." @click="toggleAddRequirement" />
    <RequirementEditor v-if="showAddRequirement" :projectId="category?.projectId" :categoryId="category?.id"></RequirementEditor>
  </div>
  <FilterPanel
    v-model:searchQuery="searchQuery"
    :sortOptions="sortOptions"
    v-model:selectedSort="selectedSort"
    v-model:sortAscending="sortAscending">
  </FilterPanel>
  <div id="requirementsList">
    <div v-for="requirement in requirements" :key="requirement.id" class="requirementCard">
      <RequirementCard
        :id="requirement.id"
        :name="requirement.name"
        :description="requirement.description"
        :upVotes="requirement.upVotes"
        :numberOfComments="requirement.numberOfComments"
        :numberOfFollowers="requirement.numberOfFollowers"
        :userVoted="requirement.userVoted"
        :creator="requirement.creator"
        :creationDate="requirement.creationDate"
        :realized="requirement.realized"
        :isDeveloper="requirement.isDeveloper">
      </RequirementCard>
    </div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, ref, watch } from 'vue';
import { useStore } from 'vuex';
import { useRoute } from 'vue-router'
import { ActionTypes } from '../store/actions';

import FilterPanel from '../components/FilterPanel.vue';
import RequirementCard from '../components/RequirementCard.vue';
import RequirementEditor from '../components/RequirementEditor.vue';

export default defineComponent({
  name: 'Category',
  components: { FilterPanel, RequirementCard, RequirementEditor },
  props: {
  },
  setup: (props) => {
    const store = useStore();
    const route = useRoute();
    
    const categoryId = Number.parseInt(route.params.categoryId.toString(), 10);
    const category = computed(() => store.getters.getCategoryById(categoryId));
    store.dispatch(ActionTypes.FetchCategory, categoryId);

    const searchQuery = ref('');
    const selectedSort = ref('date');
    const sortOptions = [
      {name: 'Alphabetically', value: 'name'},
      {name: 'Last Activity', value: 'last_activity'},
      {name: 'Creation Date', value: 'date'},
      {name: 'Number of Comments', value: 'comment'},
      {name: 'Number of Followers', value: 'follower'},
      {name: 'Number of Votes', value: 'vote'},
    ];
    const sortAscending = ref(false);
    const page = ref(0);
    const perPage = ref(20);
    const sortDirection = computed(() => sortAscending.value ? 'ASC' : 'DESC');
    const parameters = computed(() => {return {page: page.value, per_page: perPage.value, sort: selectedSort.value, sortDirection: sortDirection.value, search: searchQuery.value}});
    const requirements = computed(() => store.getters.requirementsList(categoryId, parameters.value));
    store.dispatch(ActionTypes.FetchRequirementsOfCategory, {categoryId: categoryId, query: parameters.value});
    watch(selectedSort, () => {
      sortAscending.value = selectedSort.value === 'name';
    });
    watch(parameters, () => store.dispatch(ActionTypes.FetchRequirementsOfCategory, {categoryId: categoryId, query: parameters.value}));

    const showAddRequirement = ref(false);
    const toggleAddRequirement = () => {
      showAddRequirement.value = !showAddRequirement.value;
    }

    return { category, requirements, searchQuery, sortOptions, selectedSort, sortAscending, showAddRequirement, toggleAddRequirement }
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
