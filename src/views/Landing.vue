<template>
  <h1 style="text-align: center">{{ t('landing-welcome') }}</h1>
  <!--<h2 style="color:red;">
    This is the BETA environment of Requirements Bazaar, not intended for production usage (there might be bugs!), we might delete data here at any time.
    For production usage (even if it's just a test project) please go to the main instance on <a href="https://requirements-bazaar.org">https://requirements-bazaar.org</a> (without the "beta" in the URL).
    <br />
    <br />
    NEXT DATA RESET (current grace period): September 30, 2021
  </h2>-->
  <div class="p-grid">
    <div class="p-col">
      <img src="/reqbaz-responsive.png" style="max-width: 400px;">
    </div>
    <div class="p-col">
      <h2>{{ t('lp-title') }}</h2>
      <div class="description">
        {{ t('lp-desc') }}
      </div>
      <router-link to="/projects">
        <Button :label="t('explore-projects')" />
      </router-link>
    </div>
  </div>

  <section style="text-align: center; " class="p-py-3">
    <h2>{{ t('landing-reqBazInNumbers') }}</h2>

    <div class="p-grid">
        <div class="p-col statistics-item">
          <Autocounter v-if="statistics?.numberOfProjects" class="value"
            :startAmount='0'
            :endAmount="statistics?.numberOfProjects"
            :duration='0.8'
            separator=','
            :autoinit='true' />
          <span v-else class="value">...</span>
          <p class="label">{{ t('landing-projectsCountLabel') }}</p>
        </div>
        <div class="p-col statistics-item">
          <Autocounter v-if="statistics?.numberOfRequirements" class="value"
            :startAmount='0'
            :endAmount="statistics?.numberOfRequirements"
            :duration='0.9'
            separator=','
            :autoinit='true' />
          <span v-else class="value">...</span>
          <p class="label">{{ t('landing-requirementsCountLabel') }}</p>
        </div>
        <div class="p-col statistics-item">
          <Autocounter v-if="statistics?.numberOfComments" class="value"
            :startAmount='0'
            :endAmount="statistics?.numberOfComments"
            :duration='1.0'
            separator=','
            :autoinit='true' />
          <span v-else class="value">...</span>
          <p class="label">{{ t('landing-commentsCountLabel') }}</p>
        </div>
        <div class="p-col statistics-item">
          <Autocounter v-if="userStatistics?.numberOfActiveUsers" class="value"
            :startAmount='0'
            :endAmount="userStatistics?.numberOfActiveUsers"
            :duration='1.1'
            separator=','
            :autoinit='true' />
          <span v-else class="value">...</span>
          <p class="label">{{ t('landing-activeUsersCountLabel') }}</p>
          <p>{{ t('landing-activeUsersCountRangeLabel') }}</p>
        </div>
    </div>
  </section>

  <section>
    <h2 style="text-align: center; font-size: 2.5em;">{{ t('landing-features') }}</h2>
    <div class="p-grid">

        <div class="p-col feature">
          <div class="feature-icon">
            <img src="/feature-icons/discuss.png" />
          </div>
          <h5 class="title" style="text-align: center;">{{ t('landing-featureDiscussTitle') }}</h5>
          <p class="body">{{ t('landing-featureDiscussText') }}</p>
        </div>

        <div class="p-col feature">
          <div class="feature-icon">
            <img src="/feature-icons/vote.png" />
          </div>
          <h5 class="title">{{ t('landing-featureVoteTitle') }}</h5>
          <p class="body">
            {{ t('landing-featureVoteText') }}
          </p>
        </div>

        <div class="p-col feature">
          <div class="feature-icon">
            <img src="/feature-icons/github.png" />
          </div>
          <h5 class="title">{{ t('landing-featureGitHubTitle') }}</h5>
          <p class="body">
            {{ t('landing-featureGitHubText') }}
          </p>
        </div>
    </div>
  </section>

  <section class="p-pt-3 p-pb-5">
    <h2 style="text-align: center; font-size: 2.5em;">Featured Projects</h2>

    <p class="description">
      Check out some of our most interesting projects to get to know Requirements Bazaar in more detail.
    </p>

    <div class="featured-projects">
      <div v-for="project in featuredProjects" :key="project.id" class="p-m-3 project">
        <router-link :to="'/projects/' + project.id">
          <ProjectCard
            :id="project.id"
            :name="project.name"
            :description="project.description"
            :creationDate="project.creationDate"
            :lastActivity="project.lastActivity"
            :numberOfCategories="project.numberOfCategories"
            :numberOfFollowers="project.numberOfFollowers"
            :numberOfRequirements="project.numberOfRequirements"
            :compact="false">
          </ProjectCard>
        </router-link>
      </div>
    </div>

    <p class="description p-py-3">
      New ideas for Requirements Bazaar itself are also tracked and discussed directly on the platform. Feel free to submit your own ideas or discuss the project with other users.
    </p>
    <a target="_blank" rel="noreferrer" href="https://requirements-bazaar.org/projects/2">
      <ProjectCard v-if="reqBazProject"
        :id="reqBazProject.id"
        :name="reqBazProject.name"
        :description="reqBazProject.description"
        :creationDate="reqBazProject.creationDate"
        :lastActivity="reqBazProject.lastActivity"
        :numberOfCategories="reqBazProject.numberOfCategories"
        :numberOfFollowers="reqBazProject.numberOfFollowers"
        :numberOfRequirements="reqBazProject.numberOfRequirements"
        :compact="false">
      </ProjectCard>
      <div v-else>
        Click here to open the Requirements Bzaar project!
      </div>
    </a>
  </section>

  <h2>{{ t('landing-how-it-works') }}</h2>
  <div class="description">
    <div>{{ t('landing-step-1') }}</div>
    <div>{{ t('landing-step-2') }}</div>
    <div>{{ t('landing-step-3') }}</div>
  </div>

  <h2>{{ t('landing-try-it-out') }}</h2>
  <div class="description">
    <div>{{ t('takeAlook') }}</div>
  </div>

  <router-link to="/projects">
    <Button :label="t('explore-projects')" />
  </router-link>
</template>

<script lang="ts">
import { defineComponent, computed, watch, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { useStore } from 'vuex';
import { useRouter } from 'vue-router';

import ProjectCard from '@/components/ProjectCard.vue';


import { bazaarApi, prodBazaarApi } from '../api/bazaar';
import { ActionTypes } from '@/store/actions';

export default defineComponent({
  name: 'Landing',
  components: {
    ProjectCard
  },
  props: {
  },
  setup: () => {
    const { t } = useI18n({ useScope: 'global' });
    const store = useStore();
    const router = useRouter()

    const oidcIsAuthenticated = computed(() => store.getters['oidcStore/oidcIsAuthenticated']);
    watch(oidcIsAuthenticated, (newValue) => {
      if (newValue) {
        router.push('/home');
      }
    });

    const statistics = ref();
    bazaarApi.statistics.getStatistics().then(response => statistics.value = response.data);

    const userStatistics = ref();
    const oneYearAgo = new Date();
    oneYearAgo.setFullYear( oneYearAgo.getFullYear() - 1 );
    bazaarApi.userStatistics.getUserStatistics({
      start: oneYearAgo.toISOString(),
    }).then(response => userStatistics.value = response.data);

    const featuredProjects = computed(() => store.getters.getFeaturedProjects());
    store.dispatch(ActionTypes.FetchFeaturedProjects);

    const reqBazProject = ref();

    prodBazaarApi.projects.getProject(2)
      .then(response => {
        reqBazProject.value = response.data;
        console.log(reqBazProject.value);
      });

    return {
      t,
      statistics,
      userStatistics,
      featuredProjects,
      reqBazProject,
    };
  }
})
</script>

<style scoped>
  .description {
    font-size: 15pt;
    margin-bottom: 20px;
  }

  .statistics-item {
    text-align: center;
  }

  .statistics-item .label {
    font-size: 2em;
  }

  .statistics-item .value {
    font-size: 4em;
    font-weight: bold;
    color: #4CAF50;
  }

  .feature {
    text-align: center;
  }

  .feature .title {
    font-size: 1.5em;
    font-weight: bold;
  }

  .feature .body {
    text-align: center;
  }

  .feature-icon {
    width: 95px;
    margin: auto;
  }

  .featured-projects {
    display: flex;
    justify-content: center;
  }

  .featured-projects .project {
    flex: 1 1 0px;
  }

  img {
    width: 100%;
    height: auto;
  }
</style>
