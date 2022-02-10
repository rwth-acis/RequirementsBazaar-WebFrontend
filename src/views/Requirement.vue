<template>
  <ScrollTop />
  <ProjectBreadcrumbNav v-if="project && parentCategory && requirement"
    :projectId="project.id"
    :projectName="project.name"
    :categoryId="parentCategory.id"
    :categoryName="parentCategory.name"
    :requirementId="requirement.id"
    :requirementName="requirement.name"
    class="p-mt-3" />
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
        {{ t('requirementDetails-requirementNotFound') }}
    </div>
    <div class="p-m-4 p-d-flex p-jc-center">
        <Button
            :label="t('requirementDetails-showMoreRequirements')"
            @click="showMoreRequirements()" />
    </div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, ref, watch } from 'vue';
import { useStore } from 'vuex';
import { useRoute, useRouter } from 'vue-router';
import { useI18n } from 'vue-i18n';

import { ActionTypes } from '@/store/actions';
import { routePathToProject } from '@/router';
import RequirementCard from '@/components/RequirementCard.vue';
import ProjectBreadcrumbNav from '@/components/ProjectBreadcrumbNav.vue';

export default defineComponent({
  name: 'Requirement',
  components: { RequirementCard, ProjectBreadcrumbNav },
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

    const parentCategoryId = computed(() => {
      if (requirement.value) {
        return requirement.value.categories[0];
      } else {
        return undefined;
      }
    });
    const parentCategory = computed(() => {
      if (parentCategoryId.value) {
        return store.getters.getCategoryById(parentCategoryId.value);
      } else {
        return undefined;
      }
    });

    store.dispatch(ActionTypes.FetchRequirement, requirementId);
    store.dispatch(ActionTypes.FetchProject, projectId);

    watch(parentCategoryId, () => {
      store.dispatch(ActionTypes.FetchCategory, parentCategoryId.value);
    });

    const { push } = useRouter();

    const showMoreRequirements = () => {
        push({path: routePathToProject(projectId)})
    };

    return {
      t,
      oidcIsAuthenticated,
      project,
      parentCategory,
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
