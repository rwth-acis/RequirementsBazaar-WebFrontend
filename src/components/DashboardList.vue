<template>
  <h2>{{ t('dashboard-projects') }}</h2>

  <masonry-layout maxcolwidth="400" gap="15" cols="auto">
    <div v-for="project in dashboard.projects" :key="project.id">
      <router-link :to="'/projects/' + project.id">
        <ProjectCard
          :id="project.id"
          :name="project.name"
          :description="project.description"
          :creationDate="project.creationDate"
          :lastActivity="project.lastActivity"
          :numberOfCategories="project.numberOfCategories"
          :numberOfFollowers="project.numberOfFollowers"
          :numberOfRequirements="project.numberOfRequirements">
        </ProjectCard>
      </router-link>
    </div>
  </masonry-layout>

  <h2>{{ t('dashboard-categories') }}</h2>

  <masonry-layout maxcolwidth="400" gap="15" cols="auto">
    <div v-for="category in dashboard.categories" :key="category.id">
      <router-link :to="'/projects/' + category.projectId + '/categories/' + category.id">
        <CategoryCard
          :id="category.id"
          :name="category.name"
          :description="category.description"
          :creationDate="category.creationDate"
          :lastActivity="category.lastActivity"
          :numberOfFollowers="category.numberOfFollowers"
          :numberOfRequirements="category.numberOfRequirements">
        </CategoryCard>
      </router-link>
    </div>
  </masonry-layout>

  <h2>{{ t('dashboard-requirements') }}</h2>
  <masonry-layout maxcolwidth="400" gap="15" cols="auto">
    <div v-for="requirement in dashboard.requirements" :key="requirement.id">
      <router-link :to="'/projects/' + requirement.projectId + '/categories/' + requirement.categories[0]">
        <RequirementCard
          :id="requirement.id"
          :projectId="requirement.projectId"
          :categories="requirement.categories"
          :name="requirement.name"
          :description="requirement.description"
          :upVotes="requirement.upVotes"
          :numberOfComments="requirement.numberOfComments"
          :numberOfFollowers="requirement.numberOfFollowers"
          :creator="requirement.creator"
          :creationDate="requirement.creationDate"
          :lastActivity="requirement.lastActivity"
          :userVoted="requirement.userContext.userVoted"
          :isFollower="requirement.userContext.isFollower ? true : false"
          :isDeveloper="requirement.userContext.isDeveloper ? true : false"
          :realized="requirement.realized"
          :brief="true">
        </RequirementCard>
      </router-link>
    </div>
  </masonry-layout>
</template>

<script lang="ts">
import { ActionTypes } from '../store/actions';
import { computed, defineComponent } from 'vue';
import { useI18n } from 'vue-i18n';
import { useStore } from 'vuex';

import ProjectCard from '../components/ProjectCard.vue';
import CategoryCard from '../components/CategoryCard.vue';
import RequirementCard from '../components/RequirementCard.vue';


export default defineComponent({
  name: 'Dashboard',
  components: {
    ProjectCard,
    CategoryCard,
    RequirementCard,
  },
  setup: () => {
    const { t } = useI18n({ useScope: 'global' });
    const store = useStore();

    const dashboard = computed(() => store.state.dashboard);
    store.dispatch(ActionTypes.FetchDashboard);

    return {
      t,
      dashboard,
    };
  }
})
</script>


<style scoped>
</style>
