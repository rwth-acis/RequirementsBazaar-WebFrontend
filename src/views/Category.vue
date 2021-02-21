<template>
  <h1>This is category {{ category?.name }}</h1>
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
</template>

<script lang="ts">
import { computed, defineComponent } from 'vue';
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

    const parameters = computed(() => {return {query: {per_page: 20, sort: '-name', search: ''}}});
    const requirements = computed(() => store.getters.requirementsList(categoryId, parameters.value));
    store.dispatch(ActionTypes.FetchRequirementsOfCategory, {categoryId: categoryId, query: parameters.value})

    return { category, requirements }
  }
})
</script>

<style scoped>
  #requirementsList {
    width: 100%;
    justify-content: center;
  }

  .requirementCard {
    width: 700px;
    margin: 10px;
  }
</style>
