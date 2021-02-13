<template>
  <h1>This is category {{ category?.name }}</h1>
  <div v-for="requirement in requirements" :key="requirement.id">
    <div>{{ requirement.name }}</div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent } from 'vue';
import { useStore } from 'vuex';
import { useRoute } from 'vue-router'
import { ActionTypes } from '../store/actions';

export default defineComponent({
  name: 'Category',
  props: {
  },
  setup: (props) => {
    const store = useStore();
    const route = useRoute();
    
    const categoryId = Number.parseInt(route.params.categoryId.toString(), 10);

    const category = computed(() => store.getters.getCategoryById(categoryId));
    store.dispatch(ActionTypes.FetchCategory, categoryId)

    // const parameters = computed(() => {return {query: {per_page: 20, sort: '-name', search: ''}}});
    // const categories = computed(() => store.getters.requirementsList(categoryId, parameters.value));
    // store.dispatch(ActionTypes.FetchRequirementsOfCategory, {projectId: categoryId, query: parameters.value})
    const requirements = [];

    return { category, requirements }
  }
})
</script>

<style scoped>
</style>
