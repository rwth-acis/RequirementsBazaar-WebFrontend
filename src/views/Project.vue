<template>
  <h1>This is project {{ project?.name }}</h1>
  <div id="description">
    {{ project?.description }}
  </div>
  <div id="categoriesList">
    <div v-for="category in categories" :key="category.id" class="categoryCard">
      <router-link :to="'/projects/' + project?.id + '/categories/' + category?.id">
        <CategoryCard
          :id="category.id"
          :name="category.name"
          :description="category.description">
        </CategoryCard>
      </router-link>
    </div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent } from 'vue';
import { useStore } from 'vuex';
import { useRoute } from 'vue-router'
import { ActionTypes } from '../store/actions';

import CategoryCard from '../components/CategoryCard.vue';

export default defineComponent({
    components: {
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

    const parameters = computed(() => {return {per_page: 20, sort: '-name', search: ''}});
    const categories = computed(() => store.getters.categoriesList(projectId, parameters.value));
    store.dispatch(ActionTypes.FetchCategoriesOfProject, {projectId: projectId, query: parameters.value})

    return { project, categories }
  }
})
</script>

<style scoped>
  #description {
    margin-bottom: 2rem;
  }

  #categoriesList {
    width: 100%;
    justify-content: center;
  }

  .categoryCard {
    width: 700px;
    margin: 10px;
  }
</style>
