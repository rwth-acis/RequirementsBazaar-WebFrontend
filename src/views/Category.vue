<template>
  <h1>This is category {{ category?.name }}</h1>
  <div id="description">
    {{ category?.description }}
  </div>
  <div id="addRequirementPanel">
    <Button label="Add new Requirement..."></Button>
  </div>
  <TabView id="tabView">
    <TabPanel header="Active Ideas">
      <div class="filterPanel">
        <InputText type="text" v-model="searchQuery" placeholder="Search" />
        <Dropdown placeholder="Sort by">
        </Dropdown>
        <SelectButton :options="sortDirectionOptions" dataKey="value">
          <template #option="slotProps">
            <i :class="slotProps.option.icon"></i>
          </template>
        </SelectButton>
      </div>
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

import RequirementCard from '../components/RequirementCard.vue';

export default defineComponent({
  name: 'Category',
  components: { RequirementCard },
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

    const sortDirectionOptions = [
      {icon: 'pi pi-sort-amount-down-alt', value: 'down'},
      {icon: 'pi pi-sort-amount-up', value: 'up'},
    ]

    return { category, requirements, searchQuery, sortDirectionOptions }
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

  .filterPanel {
    display: flex;
    flex-direction: row;
    margin-bottom: 1.5rem;
  }

  .filterPanel > * {
    margin-left: .5rem;
    height: 31px;
  }

  .filterPanel :first-child {
    flex: 1;
    margin-left: 0;
  }

  #requirementsList {
    display: flex;
    flex-flow: column;
    align-items: center;
    width: 100%;
  }

  .requirementCard {
    width: 700px;
    margin: 10px;
  }
</style>
