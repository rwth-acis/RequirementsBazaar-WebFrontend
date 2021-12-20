<template>
  <ScrollTop />
  <h1>{{ project?.name }}</h1>
  <div id="description">
    <vue3-markdown-it :source="project?.description" />
  </div>
  <div id="content">
    <div v-if="requirement">
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
        :realized="requirement.realized">
      </RequirementCard>
    </div>
    <div v-else>
        Requirement not found...
    </div>
    <div class="p-m-4 p-d-flex p-jc-center">
        <Button
            label="Show more Requirements"
            @click="showMoreRequirements()" />
    </div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, ref, watch } from 'vue';
import { useStore } from 'vuex';
import { useRoute, useRouter } from 'vue-router';
import { useI18n } from 'vue-i18n';
import { useConfirm } from 'primevue/useconfirm';

import { ActionTypes } from '@/store/actions';
import { routePathToProject } from '@/router';
import RequirementCard from '@/components/RequirementCard.vue';

export default defineComponent({
  name: 'Requirement',
  components: { RequirementCard },
  props: {
  },
  setup: (props) => {
    const store = useStore();
    const route = useRoute();
    const { t } = useI18n({ useScope: 'global' });
    const oidcIsAuthenticated = computed(() => store.getters['oidcStore/oidcIsAuthenticated']);

    const requirementId = Number.parseInt(route.params.requirementId.toString(), 10);
    const projectId = Number.parseInt(route.params.projectId.toString(), 10);

    const requirement = computed(() => store.getters.getRequirementById(requirementId));
    const project = computed(() => store.getters.getProjectById(projectId));

    store.dispatch(ActionTypes.FetchRequirement, requirementId);
    store.dispatch(ActionTypes.FetchProject, projectId);

    const { push } = useRouter();

    const showMoreRequirements = () => {
        push({path: routePathToProject(projectId)})
    };

    return {
      t,
      oidcIsAuthenticated,
      project,
      requirement,
      showMoreRequirements,
    }
  }
})
</script>

<style scoped>
  #description {
    margin-bottom: 2rem;
  }

  #content {
    padding: 1rem;
  }
</style>
