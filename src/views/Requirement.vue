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

  <div id="content">
    <div v-if="requirement">
      <div class="p-d-flex p-jc-start p-ai-center">
        <Badge v-if="requirement.realized" value="Done" class="p-mr-2"></Badge><h1> {{ requirement.name }}</h1>
      </div>
      <div class="lastupdate">
        <span :title="$dayjs(activityDate).format('LLL')">{{ $dayjs(activityDate).fromNow() }}</span>
        {{t('by')}} {{ creator?.userName }}
        <!--<i class="pi pi-pencil" style="fontSize: 0.7rem" v-if="creationDate !== lastActivity" :title="`initially created on ${$dayjs(lastActivity).format('LLL')}`"></i>-->
      </div>
      <div id="description">
        <vue3-markdown-it :source="requirement?.description" />
      </div>
      <div id="menuBar" class="p-mb-4">
        <TabMenu id="tabMenu" :model="tabItems" />
        <div id="actionButtons">
          <Button icon="pi pi-bell" :label="requirement?.userContext?.isFollower ? t('unfollowRequirement') : t('followRequirement')" class="p-button-sm p-ml-3" :class="{ 'p-button-outlined': !requirement?.userContext?.isFollower }" @click="followClick"></Button>
          <Button label="..." class="p-button-sm p-button-outlined" @click="toggleMoreMenu" v-if="oidcIsAuthenticated"></Button>
          <Menu id="overlay_menu" ref="moreMenu" :model="moreItems" :popup="true" />
        </div>
      </div>

      <div v-if="activeTab === ''">

        <Card class="p-my-4">
          <template #title>
            Comments
          </template>
          <template #content>
            <comments-list :requirementId="requirement.id" class="commentsList"></comments-list>
          </template>
        </Card>
      </div>

      <div v-if="activeTab === 'votes'">
        Votes
      </div>

      <div v-if="activeTab === 'followers'">
        Followers
      </div>

      <div v-if="activeTab === 'developers'">
        Developers
      </div>
    </div>

    <div v-else>
      <h1>Not Found</h1>
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
import { useConfirm } from "primevue/useconfirm";

import { ActionTypes } from '@/store/actions';
import { routePathToProject, routePathToRequirement } from '@/router';
import RequirementCard from '@/components/RequirementCard.vue';
import CommentsList from '@/components/CommentsList.vue';
import ProjectBreadcrumbNav from '@/components/ProjectBreadcrumbNav.vue';

export default defineComponent({
  name: 'Requirement',
  components: { RequirementCard, ProjectBreadcrumbNav, CommentsList },
  props: {
  },
  setup: (props) => {
    const store = useStore();
    const route = useRoute();
    const confirm = useConfirm();
    const { t, locale } = useI18n({ useScope: 'global' });
    const oidcIsAuthenticated = computed(() => store.getters['oidcStore/oidcIsAuthenticated']);

    const requirementId = Number.parseInt(route.params.requirementId.toString(), 10);
    const projectId = Number.parseInt(route.params.projectId.toString(), 10);
    const activeTab = computed(() => route.params.activeTab);

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

    const tabItems = computed(() => {
      // requirement may be undefined during loading or if 404
      if (requirement.value) {
        return [
          {
            label: `${requirement.value.numberOfComments} ${t('comments')}`,
            to: `${routePathToRequirement(projectId, requirementId)}`,
          },
          {
            label: `${requirement.value.upVotes} ${t('votes')}`,
            to: `${routePathToRequirement(projectId, requirementId)}/votes`,
          },
          {
            label: `${requirement.value.numberOfFollowers} ${t('followers')}`,
            to: `${routePathToRequirement(projectId, requirementId)}/followers`,
          },
          {
            label: t('developers'),
            to: `${routePathToRequirement(projectId, requirementId)}/developers`,
          },
        ];
      } else {
        return [];
      }
    });

    const followClick = () => {
      if (oidcIsAuthenticated.value) {
        store.dispatch(ActionTypes.FollowRequirement, {id: requirementId, isFollower: requirement.value.userContext.isFollower ? false : true});
      } else {
        confirm.require({
          group: 'dialog',
          message: t('signInToFollowCategory'),
          header: 'Login',
          icon: 'pi pi-info-circle',
          rejectClass: 'p-sr-only',
          acceptLabel: 'OK',
        });
      }
    };

    const moreMenu = ref(null);
    const toggleMoreMenu = (event) => {
      (moreMenu as any).value.toggle(event);
    };

    const moreItems = ref();
    // watch multiple props
    watch(
      [locale, requirement],
      () => {
        if (!requirement.value) {
          return moreItems.value = [];
        } else {
          moreItems.value = [
            {
              label: requirement.value.userContext.isFollower ? t('unfollowRequirement') : t('followRequirement'),
              icon: 'pi pi-bell',
              command: () => {
                store.dispatch(ActionTypes.FollowRequirement, {id: requirementId, isFollower: requirement.value.userContext.isFollower ? false : true});
              }
            },
            {
              label: requirement.value.userContext.isDeveloper ? t('undevelopRequirement') : t('developRequirement'),
              icon: 'pi pi-file',
              command: () => {
                store.dispatch(ActionTypes.DevelopRequirement, {requirementId: requirementId, isDeveloper: requirement.value.userContext.isDeveloper ? false : true});
              }
            },
            {
              label: requirement.value.realized ? t('markAsUndone') : t('markAsDone'),
              icon: 'pi pi-check',
              command: () => {
                store.dispatch(ActionTypes.RealizeRequirement, {requirementId: requirementId, realized: requirement.value.realized ? false : true});
              }
            },
            {
              label: t('editRequirement'),
              icon: 'pi pi-pencil',
              command: () => {
                //displayRequirementEditor.value = true;
              }
            },
            {
              label: requirement.value.issue_url ? t('viewOnGitHub') : t('createGithubIssue'),
              icon: 'pi pi-github',
              disabled: requirement.value.github_url === undefined,
              command: () => {
                if (requirement.value.issue_url) {
                  window.open(requirement.value.issue_url)
                } else {
                  //createGitHubIssueForRequirement();
                }
              }
            },
            {
              label: t('deleteRequirement'),
              icon: 'pi pi-times',
              command: () => {
                //confirmDelete();
              }
            }
          ];
        }
      },
      {
        immediate: true
      }
    );

    return {
      t,
      oidcIsAuthenticated,
      project,
      parentCategory,
      requirement,
      tabItems,
      activeTab,
      moreMenu,
      moreItems,
      toggleMoreMenu,
      showMoreRequirements,
      followClick,
      routePathToRequirement
    }
  }
})
</script>

<style scoped>
  #description {
    margin-bottom: 2rem;
  }

  .title h1 {
    margin: 0;
  }

  .lastupdate {
    padding-top: 5px;
    padding-bottom: 10px;
    font-weight: normal;
    font-size: 0.9em;
    color: #5d5d5d;
  }

  #content {
    padding: 1rem;
  }

  #menuBar {
    width: 100%;
    display: flex;
  }

  #menuBar #tabMenu {
    flex: 1;
  }

  #actionButtons {
    display: flex;
    align-items: center;
    border-bottom: 2px solid #dee2e6;
  }

  #actionButtons > * {
    margin-left: 0.3rem;
  }

  #tabMenu ::v-deep(.p-tabmenu-nav), #tabMenu ::v-deep(.p-menuitem-link) {
    background-color: transparent;
  }

  #tabMenu ::v-deep(.p-tabmenuitem) {
    background-color: transparent;
  }
</style>
