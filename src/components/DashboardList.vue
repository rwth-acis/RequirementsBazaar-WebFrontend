<template>
  <template v-if="dashboard && dashboard.isGamified == 'true'">
    <div class="rank">
      <h3 style="display: inline-block; white-space: pre">{{ t('level') }} {{ dashboard.status.memberLevel }}: {{ dashboard.status.memberLevelName }}</h3>
    </div>
    <div class="parent">
      <div class="progressBar">
        <ProgressBar :value="dashboard.status.progress" :show-value="true">
          {{ dashboard.status.memberPoint }} / {{ dashboard.status.nextLevelPoint }}
        </ProgressBar>
      </div>

      <div class="progress">
        <h4 style="display: inline-block">{{  t('next-rank') }} </h4>
        <span style="margin-left: 0.5rem"> {{ dashboard.status.nextLevelName }}</span>
      </div>
    </div>
  </template>

  <h2>{{ t('dashboard-projects') }}</h2>

  <masonry-layout maxcolwidth="400" gap="15" cols="auto">
    <div v-for="project in dashboard.projects" :key="project.id">
      <router-link :to="'/projects/' + project.id">
        <ProjectCard :id="project.id" :name="project.name" :description="project.description"
          :creationDate="project.creationDate" :lastActivity="project.lastActivity"
          :numberOfCategories="project.numberOfCategories" :numberOfFollowers="project.numberOfFollowers"
          :numberOfRequirements="project.numberOfRequirements">
        </ProjectCard>
      </router-link>
    </div>
  </masonry-layout>

  <h2>{{ t('dashboard-categories') }}</h2>

  <masonry-layout maxcolwidth="400" gap="15" cols="auto">
    <div v-for="category in dashboard.categories" :key="category.id">
      <router-link :to="'/projects/' + category.projectId + '/categories/' + category.id">
        <CategoryCard :id="category.id" :name="category.name" :description="category.description"
          :creationDate="category.creationDate" :lastActivity="category.lastActivity"
          :numberOfFollowers="category.numberOfFollowers" :numberOfRequirements="category.numberOfRequirements">
        </CategoryCard>
      </router-link>
    </div>
  </masonry-layout>

  <h2>{{ t('dashboard-requirements') }}</h2>
  <masonry-layout maxcolwidth="400" gap="15" cols="auto">
    <div v-for="requirement in dashboard.requirements" :key="requirement.id">
      <router-link :to="'/projects/' + requirement.projectId + '/categories/' + requirement.categories[0]">
        <RequirementCard :id="requirement.id" :projectId="requirement.projectId" :categories="requirement.categories"
          :name="requirement.name" :description="requirement.description" :upVotes="requirement.upVotes"
          :numberOfComments="requirement.numberOfComments" :numberOfFollowers="requirement.numberOfFollowers"
          :creator="requirement.creator" :creationDate="requirement.creationDate"
          :lastActivity="requirement.lastActivity" :userVoted="requirement.userContext.userVoted"
          :isFollower="requirement.userContext.isFollower ? true : false"
          :isDeveloper="requirement.userContext.isDeveloper ? true : false" :realized="requirement.realized"
          :brief="true"
          :tags ="requirement.tags ?? {}"
          :projectTags="requirement.tags ?? {}">
        </RequirementCard>
      </router-link>
    </div>
  </masonry-layout>
  <template v-if= "dashboard && dashboard.isGamified == 'true'">
    <h2>{{ t('dashboard-badges') }}</h2>
    <masonry-layout maxcolwidth="1000" gap="10" cols="auto">
      <div class="figs">
        <figure v-for="badge in dashboard.badges">
          <img v-bind:src="'data:image/png;base64,' + badge.img" alt="gf_badge" v-tooltip.top="badge.description" />
          <figcaption>{{ badge.name }}</figcaption>
        </figure>
      </div>
    </masonry-layout>
  </template>

</template>

<script lang="ts">
import { ActionTypes } from '../store/actions';
import { computed, defineComponent } from 'vue';
import { useI18n } from 'vue-i18n';
import { useStore } from 'vuex';

import ProjectCard from '../components/ProjectCard.vue';
import CategoryCard from '../components/CategoryCard.vue';
import RequirementCard from '../components/RequirementCard.vue';
import Tooltip from 'primevue/tooltip';

export default defineComponent({
  name: 'Dashboard',
  components: {
    ProjectCard,
    CategoryCard,
    RequirementCard,
  },
  directives: {
    'tooltip': Tooltip
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
figure {
  display: inline-block;
  margin-left: 1rem;
  margin-right: 1rem;

  /* adjust as needed */
}

figure img {
  vertical-align: top;
  width: 6rem;
  height: 6rem;
}

figure figcaption {
  text-align: center;
  font-weight: bold;
}

.parent {
  display: grid;
  grid-template-columns: 1rem auto 1rem auto;
  grid-template-rows: repeat(2, 1fr);
}

.progressBar {
  grid-area: 1 / 2 / 2 / 3;
  white-space: pre;
}

.progress {
  grid-area: 2 / 1 / 3 / 4;
  text-align: center;
  white-space: pre;
  margin-top: -4%;
}

.p-progressbar {
  min-width: 5rem;
  max-width: auto;
}
</style>
