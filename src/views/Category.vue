<template>
  <h1>This is category {{ category?.name }}</h1>
  <div v-for="requirement in requirements" :key="requirement.id">
    <RequirementCard :id="requirement.id"></RequirementCard>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent } from 'vue';
import { useStore } from 'vuex';
import { useRoute } from 'vue-router'
import { ActionTypes } from '../store/actions';

import RequirementCard from '../components/RequirementCard.vue';

export default defineComponent({
  components: { RequirementCard },
    name: 'Category',
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
</style>
