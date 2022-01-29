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
    <h2>Requirements Bazaar in Numbers</h2>

    <div class="p-grid">
        <div class="p-col statistics-item">
          <Autocounter v-if="statistics?.numberOfProjects" class="value"
            :startAmount='0'
            :endAmount="statistics?.numberOfProjects"
            :duration='1.0'
            separator=','
            :autoinit='true' />
          <span v-else class="value">...</span>
          <p class="label">Projects</p>
        </div>
        <div class="p-col statistics-item">
          <Autocounter v-if="statistics?.numberOfRequirements" class="value"
            :startAmount='0'
            :endAmount="statistics?.numberOfRequirements"
            :duration='1.4'
            separator=','
            :autoinit='true' />
          <span v-else class="value">...</span>
          <p class="label">Requirements</p>
        </div>
        <div class="p-col statistics-item">
          <Autocounter v-if="statistics?.numberOfComments" class="value"
            :startAmount='0'
            :endAmount="statistics?.numberOfComments"
            :duration='1.8'
            separator=','
            :autoinit='true' />
          <span v-else class="value">...</span>
          <p class="label">Comments</p>
        </div>
    </div>
  </section>

  <section>
    <h2 style="text-align: center; font-size: 2.5em;">Features</h2>
    <div class="p-grid">

        <div class="p-col feature">
          <div class="feature-icon">
            <img src="feature-icons/discuss.png" />
          </div>
          <h5 class="title" style="text-align: center;">Discuss with Users</h5>
          <p class="body">Discuss new ideas, and innovate together with your end-users.</p>
        </div>

        <div class="p-col feature">
          <div class="feature-icon">
            <img src="feature-icons/vote.png" />
          </div>
          <h5 class="title">Vote for Requirements</h5>
          <p class="body">
            Let users vote for requirements to help developers prioritizing the right features.
          </p>
        </div>

        <div class="p-col feature">
          <div class="feature-icon">
            <img src="feature-icons/github.png" />
          </div>
          <h5 class="title">Link to GitHub</h5>
          <p class="body">
            Link your project to a GitHub repository to keep requirements engineering and
            development in sync.
          </p>
        </div>
    </div>
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


import { bazaarApi } from '../api/bazaar';

export default defineComponent({
  name: 'Landing',
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

    return {
      t,
      statistics,
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

  img {
    width: 100%;
    height: auto;
  }
</style>
