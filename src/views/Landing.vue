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
    <div class="p-col-12 p-md-6">
      <img src="/reqbaz-responsive.png" style="margin-left: auto; margin-right: auto;">
    </div>
    <div class="p-col-12 p-md-6">
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
          <div class="monthly-change" v-if="lastMonthStatistics?.numberOfProjects !== undefined">
            <span class="change-value">+ {{ lastMonthStatistics?.numberOfProjects }}</span> <span class="suffix">{{ t('landing-lastMonthLabel') }}</span>
          </div>
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
          <div class="monthly-change" v-if="lastMonthStatistics?.numberOfRequirements !== undefined">
            <span class="change-value">+ {{ lastMonthStatistics?.numberOfRequirements }}</span> <span class="suffix">{{ t('landing-lastMonthLabel') }}</span>
          </div>
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
          <div class="monthly-change" v-if="lastMonthStatistics?.numberOfComments !== undefined">
            <span class="change-value">+ {{ lastMonthStatistics?.numberOfComments }}</span> <span class="suffix">{{ t('landing-lastMonthLabel') }}</span>
          </div>
        </div>
        <div class="p-col statistics-item">
          <Autocounter v-if="userStatistics?.numberOfActiveUsers" class="value"
            :startAmount='0'
            :endAmount="userStatistics?.numberOfActiveUsers"
            :duration='1.1'
            separator=','
            :autoinit='true' />
          <span v-else class="value">...</span>
          <p class="label" v-tooltip.bottom="t('landing-activeUsersCountRangeLabel')">{{ t('landing-activeUsersCountLabel') }}</p>
          <div class="monthly-change" v-if="lastMonthUserStatistics?.numberOfActiveUsers !== undefined">
            <span class="change-value">{{ lastMonthUserStatistics?.numberOfActiveUsers }}</span> <span class="suffix">{{ t('landing-lastMonthLabel') }}</span>
          </div>
        </div>
    </div>
  </section>

  <section>
    <h2 style="text-align: center; font-size: 2.5em;">{{ t('landing-features') }}</h2>
    <div class="p-grid">

        <div class="p-col-12 p-sm-6 p-md-4 feature">
          <div class="feature-icon">
            <img src="/feature-icons/discuss.png" />
          </div>
          <h5 class="title" style="text-align: center;">{{ t('landing-featureDiscussTitle') }}</h5>
          <p class="body">{{ t('landing-featureDiscussText') }}</p>
        </div>

        <div class="p-col-12 p-sm-6 p-md-4 feature">
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
    <h2 style="text-align: center; font-size: 2.5em;">{{ t('landing-featuredProjects-title') }}</h2>

    <p class="description">
      {{ t('landing-featuredProjects-text') }}
    </p>

    <div class="p-grid">
      <div v-for="project in featuredProjects" :key="project.id" class="p-m-3 p-col">
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
      <ProgressSpinner v-if="featuredProjects.length === 0" />
    </div>

    <p class="description p-py-3">
      {{ t('landing-reqBazProject-description') }}
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
      <div style="text-align: center;" v-else>
        <ProgressSpinner /> {{ t('landing-reqBazProject-cardPlaceholder') }}
      </div>
    </a>
  </section>

  <div class="p-grid p-pt-3 p-pb-5">
    <section class="p-col-12 p-md-7 p-pb-6">
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
    </section>

    <div class="p-col-12 p-md-5">
      <a class="twitter-timeline"
        href="https://twitter.com/reqbaz"
        data-height="270vh"
        data-width="100%">
        Tweets by @reqbaz
      </a>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed, watch, ref, onMounted } from 'vue';
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

    // Load Twitter script to display timeline
    onMounted(() => loadTwitterWidgetJS());

    const statistics = ref();
    bazaarApi.statistics.getStatistics().then(response => statistics.value = response.data);

    const userStatistics = ref();
    const oneYearAgo = new Date();
    oneYearAgo.setFullYear( oneYearAgo.getFullYear() - 1 );
    bazaarApi.userStatistics.getUserStatistics({
      start: oneYearAgo.toISOString(),
    }).then(response => userStatistics.value = response.data);

    const lastMonthStatistics = ref();
    const lastMonthUserStatistics = ref();

    const oneMonthAgo = new Date();
    oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
    bazaarApi.statistics.getStatistics({
      since: oneMonthAgo.toISOString()
    }).then(response => lastMonthStatistics.value = response.data);

    bazaarApi.userStatistics.getUserStatistics({
      start: oneMonthAgo.toISOString(),
    }).then(response => lastMonthUserStatistics.value = response.data);

    const featuredProjects = computed(() => store.getters.getFeaturedProjects());
    store.dispatch(ActionTypes.FetchFeaturedProjects);

    const reqBazProject = ref();

    prodBazaarApi.projects.getProject(2)
      .then(response => {
        reqBazProject.value = response.data;
      });

    return {
      t,
      statistics,
      userStatistics,
      lastMonthStatistics,
      lastMonthUserStatistics,
      featuredProjects,
      reqBazProject,
    };
  }
})

/**
 * Loads the Twitter widgets.js script which renders the Twitter timeline.
 *
 * This function needs to be called from Vue's onMounted() lifecycle hook in order to work correctly inside
 * a Vue component.
 *
 * Taken from: https://developer.twitter.com/en/docs/twitter-for-websites/javascript-api/guides/set-up-twitter-for-websites
 */
function loadTwitterWidgetJS() {
  (window as any).twttr = (function(d, s, id) {
    var js, fjs = d.getElementsByTagName(s)[0],
      t = (window as any).twttr || {};
    if (d.getElementById(id)) return t;
    js = d.createElement(s);
    js.id = id;
    js.src = "https://platform.twitter.com/widgets.js";
    fjs.parentNode!.insertBefore(js, fjs);

    t._e = [];
    t.ready = function(f) {
      t._e.push(f);
    };

    return t;
  }(document, "script", "twitter-wjs"));
}

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

  .statistics-item .monthly-change {
    padding-top: 5px;
    font-weight: bold;
    color: #ff9800;
  }

  .statistics-item .monthly-change .change-value {
    font-size: 1.5em;
  }

  .statistics-item .monthly-change .suffix {
    font-size: 0.85em;
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

  img {
    width: 100%;
    height: auto;
  }
</style>
