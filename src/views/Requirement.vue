<template>
  <ScrollTop />
  <ProjectBreadcrumbNav v-if="project && parentCategory && requirement"
    :projectId="project.id"
    :projectName="project.name"
    :categoryId="parentCategory.id"
    :categoryName="parentCategory.name"
    class="p-mt-3" />

  <div id="content">
    <div v-if="loading" class="loading-container">
      <ProgressSpinner />
    </div>

    <div v-if="requirement">
      <div class="title">
        <Badge v-if="requirement.realized" value="Done" class="p-mr-2"></Badge><h1> {{ requirement.name }}</h1>
      </div>
      <div class="lastupdate">
        <span :title="$dayjs(lastActivityDate).format('LLL')">{{ $dayjs(lastActivityDate).fromNow() }}</span>
        {{t('by')}} {{ requirement.creator?.userName }}
      </div>

      <div id="description">
        <vue3-markdown-it :source="requirement?.description" />
      </div>

      <RequirementDevTimeline :additionalProperties="requirement.additionalProperties" />

      <div id="menuBar" class="p-mb-4">
        <TabMenu id="tabMenu" :model="tabItems" />
        <div id="actionButtons">
          <Button icon="pi pi-thumbs-up" label="Upvote" class="p-button-sm" :class="{ 'p-button-outlined': requirement?.userContext?.userVoted !== 'UP_VOTE' }" @click="voteClick('UP_VOTE')"></Button>
          <Button v-if="downVotesEnabled" icon="pi pi-thumbs-down" label="Downvote" class="p-button-sm p-button-danger" :class="{ 'p-button-outlined': requirement?.userContext?.userVoted !== 'DOWN_VOTE' }" @click="voteClick('DOWN_VOTE')"></Button>

          <Button icon="pi pi-bell" :label="requirement?.userContext?.isFollower ? t('unfollowRequirement') : t('followRequirement')" class="p-button-sm p-ml-3" :class="{ 'p-button-outlined': !requirement?.userContext?.isFollower }" @click="followClick"></Button>
          <Button label="..." class="p-button-sm p-button-outlined" @click="toggleMoreMenu" v-if="oidcIsAuthenticated"></Button>
          <Menu id="overlay_menu" ref="moreMenu" :model="moreItems" :popup="true" />
        </div>
      </div>

      <div v-if="activeTab === ''">

        <Card class="p-my-4">
          <template #title>
            {{ t('comments') }}
          </template>
          <template #content>
            <comments-list :requirementId="requirement.id" class="commentsList"></comments-list>
          </template>
        </Card>
      </div>

      <div v-if="activeTab === 'votes'">
        {{ t('votes') }}
      </div>

      <div v-if="activeTab === 'followers'">
        <h3>{{ t('followers') }}</h3>

        <div class="p-grid">
          <div class="p-col-12">
            <DataTable :value="followers" sortMode="single" sortField="role" :sortOrder="1" scrollable scrollHeight="800px">
              <Column field="userName" header="User">
                  <template #body="slotProps">
                      <UserAvatar :imageUrl="slotProps.data.profileImage" :userName="slotProps.data.userName" size="small" />
                      <span class="image-text p-pl-2">{{slotProps.data.userName}}</span>
                  </template>
              </Column>
            </DataTable>
          </div>
        </div>
      </div>

      <div v-if="activeTab === 'developers'">
        <h3>{{ t('developers') }}</h3>

        <div class="p-grid">
          <div class="p-col-12">
            <DataTable :value="developers" sortMode="single" sortField="role" :sortOrder="1" scrollable scrollHeight="800px">
              <Column field="userName" header="User">
                  <template #body="slotProps">
                      <UserAvatar :imageUrl="slotProps.data.profileImage" :userName="slotProps.data.userName" size="small" />
                      <span class="image-text p-pl-2">{{slotProps.data.userName}}</span>
                  </template>
              </Column>
            </DataTable>
          </div>
        </div>
      </div>
    </div>

    <div v-if="requirement === undefined && !loading">
      <h1>{{ t('notFound') }}</h1>
      {{ t('requirementDetails-requirementNotFound') }}
    </div>
    <div class="p-m-4 p-d-flex p-jc-center">
        <Button
            :label="t('requirementDetails-showMoreRequirements')"
            @click="showMoreRequirements()" />
    </div>
  </div>

  <Dialog :header="t('editRequirement')" v-model:visible="displayRequirementEditor" :breakpoints="{'960px': '75vw', '640px': '100vw'}" :style="{width: '50vw'}" :modal="true">
    <RequirementEditor
      class="requirementEditor"
      :requirementId="requirement.id"
      :projectId="project.id"
      :categories="requirement.categories"
      :name="requirement.name"
      :description="requirement.description"
      @cancel="requirementEditorCanceled"
      @save="requirementEditorSaved">
    </RequirementEditor>
  </Dialog>
</template>

<script lang="ts">
import { computed, defineComponent, ref, watch } from 'vue';
import { useStore } from 'vuex';
import { useRoute, useRouter } from 'vue-router';
import { useI18n } from 'vue-i18n';
import { useConfirm } from "primevue/useconfirm";

import { ActionTypes } from '@/store/actions';
import { routePathToProject, routePathToRequirement } from '@/router';
import RequirementDevTimeline from '@/components/RequirementDevTimeline.vue';
import CommentsList from '@/components/CommentsList.vue';
import UserAvatar from '@/components/UserAvatar.vue';
import ProjectBreadcrumbNav from '@/components/ProjectBreadcrumbNav.vue';
import RequirementEditor from '../components/RequirementEditor.vue';
import { confirmDeleteRequirement, createGitHubIssueForRequirement } from '@/ui-utils/requirement-menu-actions';

export default defineComponent({
  name: 'Requirement',
  components: { ProjectBreadcrumbNav, CommentsList, RequirementDevTimeline, UserAvatar, RequirementEditor },
  props: {
  },
  setup: (props) => {
    const store = useStore();
    const route = useRoute();
    const confirm = useConfirm();
    const { t, locale } = useI18n({ useScope: 'global' });
    const oidcIsAuthenticated = computed(() => store.getters['oidcStore/oidcIsAuthenticated']);

    const downVotesEnabled = `${import.meta.env.VITE_DOWN_VOTES_ENABLED}`.toLowerCase() === 'true';

    const requirementId = Number.parseInt(route.params.requirementId.toString(), 10);
    const projectId = Number.parseInt(route.params.projectId.toString(), 10);
    const activeTab = computed(() => route.params.activeTab);

    const loading = ref(true);
    const requirement = computed(() => store.getters.getRequirementById(requirementId));
    const project = computed(() => store.getters.getProjectById(projectId));

    const lastActivityDate = computed(() => requirement.value?.lastActivity || requirement.value?.creationDate);

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

    //get github_url from project's additionalProperties
    const projectGithubUrl = computed(() => {
      if (project.value && project.value.additionalProperties && project.value.additionalProperties.github_url ) {
        return project.value.additionalProperties.github_url
      }
    });
    const issue_url = computed(() => {
      if (requirement.value && requirement.value.additionalProperties && requirement.value.additionalProperties.issue_url ) {
        return requirement.value.additionalProperties.issue_url;
      }
    });

    store.dispatch(ActionTypes.FetchRequirement, requirementId).then(() => {
      loading.value = false;
    });
    store.dispatch(ActionTypes.FetchProject, projectId);

    const alertLogin = (message: string) => {
      confirm.require({
          group: 'dialog',
          message: message,
          header: 'Login',
          icon: 'pi pi-info-circle',
          rejectClass: 'p-sr-only',
          acceptLabel: 'OK',
        });
    }

    watch(parentCategoryId, () => {
      if (parentCategoryId.value !== null && parentCategoryId.value !== undefined) {
        store.dispatch(ActionTypes.FetchCategory, parentCategoryId.value);
      }
    });

    const { push } = useRouter();

    const showMoreRequirements = () => {
        push({path: routePathToProject(projectId)})
    };

    const displayRequirementEditor = ref(false);
    const requirementEditorCanceled = () => {
      displayRequirementEditor.value = false;
    }
    const requirementEditorSaved = () => {
      displayRequirementEditor.value = false;
    }

    const tabItems = computed(() => {
      // requirement may be undefined during loading or if 404
      if (requirement.value) {
        return [
          {
            label: `${requirement.value.numberOfComments} ${t('comments')}`,
            to: `${routePathToRequirement(projectId, requirementId)}`,
          },
          // TODO backend first needs to support listing votes
          /*{
            label: `${requirement.value.upVotes} ${t('votes')}`,
            to: `${routePathToRequirement(projectId, requirementId)}/votes`,
          },*/
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
      [locale, requirement, projectGithubUrl],
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
                displayRequirementEditor.value = true;
              }
            },
            {
              label: issue_url.value ? t('viewOnGitHub') : t('createGithubIssue'),
              icon: 'pi pi-github',
              disabled: projectGithubUrl === undefined,
              command: () => {
                if (issue_url.value) {
                  window.open(issue_url.value);
                } else {
                  createGitHubIssueForRequirement(confirm, t, project.value, requirement.value);
                }
              }
            },
            {
              label: t('deleteRequirement'),
              icon: 'pi pi-times',
              command: () => {
                 confirmDeleteRequirement(confirm, t, store, requirementId, () => {
                   showMoreRequirements();
                 });
              },
            }
          ];
        }
      },
      {
        immediate: true
      }
    );

    const voteClick = (vote: string) => {
      if (oidcIsAuthenticated.value) {
        const parameters = {
          requirementId: requirementId,
          userVoted: requirement.value.userContext.userVoted !== vote ? vote : 'NO_VOTE',
        };
        console.log('voting with params: voted=' + parameters.userVoted);
        store.dispatch(ActionTypes.VoteRequirement, parameters);
      } else {
        alertLogin(t('signInToVoteRequirement'));
      }
    };

    const followers = computed(() => store.getters.getRequirementFollowers(requirementId));
    watch([activeTab], () => {
      if (activeTab.value == 'followers') {
        store.dispatch(ActionTypes.FetchRequirementFollowers, requirementId);
      }
    }, { immediate: true});

    const developers = computed(() => store.getters.getRequirementDevelopers(requirementId));
    watch([activeTab], () => {
      if (activeTab.value == 'developers') {
        store.dispatch(ActionTypes.FetchRequirementDevelopers, requirementId);
      }
    }, { immediate: true});

    return {
      t,
      oidcIsAuthenticated,
      project,
      loading,
      parentCategory,
      requirement,
      tabItems,
      downVotesEnabled,
      activeTab,
      moreMenu,
      moreItems,
      toggleMoreMenu,
      displayRequirementEditor,
      lastActivityDate,
      followers,
      developers,
      showMoreRequirements,
      followClick,
      voteClick,
      routePathToRequirement,
      requirementEditorCanceled,
      requirementEditorSaved,
    }
  }
})
</script>

<style scoped>
  #description {
    margin-bottom: 0.5rem;
  }

  .title h1 {
    margin: 0;
  }

  .loading-container {
    text-align: center;
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
    flex-direction: column-reverse;
  }

  #menuBar #tabMenu {
    flex: 1;
    margin-bottom: 1rem;
  }

  #actionButtons {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    padding-bottom: 0.5rem;
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

  /* Responsive changes for larger screens */
  @media (min-width: 768px) {
    #menuBar {
      flex-direction: row;
    }

    #menuBar #tabMenu {
      margin-bottom: 0rem;
    }

    #actionButtons {
      border-bottom: 2px solid #dee2e6;
    }
  }
</style>
