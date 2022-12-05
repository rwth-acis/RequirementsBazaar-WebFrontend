<template>
  <Card id="card" @click="onCardClick">
    <template #title>
      <div class="card-title">
        <Badge v-if="realized" value="Done" class="p-mr-2"></Badge>
        <router-link :to="requirementPagePath" @click.stop="() => {}/*prevents navigating to detail page twice. By default, onCardClick() would be triggered here*/">
          <div class="title">{{ name }}</div>
        </router-link>
      </div>
      <div class="">
        <div class="lastupdate p-d-flex p-ai-center">
          <i class="pi pi-plus-circle p-mr-2"></i> <span :title="$dayjs(creationDate).format('LLL')">{{ $dayjs(creationDate).fromNow() }}&nbsp;</span> {{t('by')}} {{ creator?.userName }}
        </div>
        <div v-if="showLastActivity" class="lastupdate p-d-flex p-ai-center">
          <i class="pi pi-user-edit p-mr-2"></i> <span :title="$dayjs(lastActivity).format('LLL')">{{ $dayjs(lastActivity).fromNow() }}&nbsp;</span> {{ t('by')}} {{ lastActivityUser?.userName ?? 'unknown user' }}
        </div>
      </div>
    </template>

    <template #content>
      <vue3-markdown-it :source="description" class="p-mt-3 p-mb-3" />

      <!-- Timeline -->
      <RequirementDevTimeline :additionalProperties="additionalProperties" />

      <Dialog :header="t('editRequirement')" v-model:visible="displayRequirementEditor" :breakpoints="{'960px': '75vw', '640px': '100vw'}" :style="{width: '50vw'}" :modal="true">
        <RequirementEditor
          class="requirementEditor"
          :requirementId="id"
          :projectId="projectId"
          :categories="categories"
          :name="name"
          :description="description"
          @cancel="requirementEditorCanceled"
          @save="requirementEditorSaved">
        </RequirementEditor>
      </Dialog>
      <div id="figures">
        <div id="votes">{{ upVotes }} {{ t('votes') }}</div>
        <div id="followers">{{ numberOfFollowers }} {{ t('followers') }}</div>
        <div id="comments" @click.stop="toggleCommentsPanel">{{ numberOfComments }} {{ t('comments')}}</div>
      </div>
      <div id="actionButtons" v-if="!brief">
        <div id="groupedButtons">
          <Button :label="t('vote')" :class="{ 'p-button-outlined': !voted }" @click.stop="toggleVote"></Button>
          <Button v-if="windowWidth >= 768" :label="t('addComment')" @click.stop="toggleCommentsPanel" class="p-button-outlined"></Button>
          <Button :label="t('share')" class="p-button-outlined" @click.stop="toggleShareMenu"></Button>
          <Menu ref="shareMenu" :model="shareMenuItems" :popup="true" />
        </div>
        <Button v-if="oidcIsAuthenticated" type="button" class="p-button-outlined moreButton" label="..." @click.stop="toggleMenu" aria-haspopup="true" aria-controls="overlay_menu"/>
        <Menu ref="menu" :model="menuItems" :popup="true" />
      </div>
      <comments-list :requirementId="id" v-if="showComments" class="commentsList"></comments-list>
    </template>
  </Card>

  <Dialog v-model:visible="displayCategoryDialog" :style="{width: '450px'}" :header="t('changeCategory')" :modal="true" class="p-fluid">
      <div class="p-field">
          <label for="category">{{ t('currentCategory') }}: </label> <b>{{category?.name ?? 'no category'}}</b>
      </div>

      <div class="p-field">
          <label for="newCategory" class="p-mb-3">{{ t('newCategory' )}}</label>
          <Dropdown id="newCategory" v-model="selectedCategoryOption" :options="availableCategoryOptions" placeholder="Select a Category">
              <template #value="slotProps">
                  <span>
                      {{slotProps.value.label}}
                  </span>
              </template>
              <template #option="slotProps">
                  <span>
                      {{slotProps.option.label}}
                  </span>
              </template>
          </Dropdown>
      </div>

      <template #footer>
          <ProgressBar mode="indeterminate" class="mb-3" v-if="changeCategoryInProgress" />
          <Button :label="t('cancel')" icon="pi pi-times" class="p-button-text" @click="displayCategoryDialog = false" />
          <Button :label="t('save')" icon="pi pi-check" class="p-button-text" @click="changeRequirementCategory" />
      </template>
  </Dialog>
</template>

<script lang="ts">
import { computed, ref, toRefs, defineComponent, watch, PropType, onMounted, onUnmounted } from 'vue';
import { useStore } from 'vuex';
import { useI18n } from 'vue-i18n';
import { ActionTypes } from '../store/actions';
import { useConfirm } from "primevue/useconfirm";
import CommentsList from './CommentsList.vue';
import RequirementDevTimeline from '@/components/RequirementDevTimeline.vue';
import { useRoute, useRouter } from 'vue-router';

import { routePathToRequirement } from '@/router';

import RequirementEditor from '../components/RequirementEditor.vue';
import { confirmDeleteRequirement, createShareableRequirementLink, createGitHubIssueForRequirement, exportToPDF, exportToTex } from '@/ui-utils/requirement-menu-actions';
import { getEnabledCategories } from 'trace_events';

import { useProgress } from '@/service/ProgressService';
import { useWindowSize } from '@/ui-utils/window-size';

export default defineComponent({
  components: { CommentsList, RequirementEditor, RequirementDevTimeline },
  name: 'RequirementCard',
  props: {
    id: { type: Number, required: true },
    projectId: { type: Number, required: true },
    categories: { type: Array as PropType<Array<number>>, required: true },
    name: { type: String, required: true },
    creator: { type: Object, required: true },
    creationDate: { type: String, required: true },
    lastActivity: { type: String, required: true },
    lastActivityUser: { type: Object, required: false },
    description: { type: String, required: true },
    upVotes: { type: Number, required: true },
    numberOfComments: { type: Number, required: true },
    numberOfFollowers: { type: Number, required: true },
    userVoted: { type: String, required: true },
    isFollower: { type: Boolean, required: true },
    isDeveloper: { type: Boolean, required: true },
    realized: { type: String, required: false },
    brief: { type: Boolean, required: false, default: false },
    additionalProperties: {type: Object, required: false},
    showLastActivity: {type: Boolean, required: false, default: true},
    userContext: {type: Object, required: false},
  },

  setup: (props) => {
    const {
      id,projectId, userVoted, isFollower, isDeveloper, realized, lastActivity, lastActivityUser, creationDate, name, description, categories,
      additionalProperties, showLastActivity, userContext,
    } = toRefs(props);
    const { locale, t } = useI18n({ useScope: 'global' });
    const store = useStore();
    const confirm = useConfirm();
    const route = useRoute();
    const { push } = useRouter();
    const { startLoading, stopLoading } = useProgress();

    const { windowWidth, windowHeight } = useWindowSize();

    console.log('userContext:');
    console.log(userContext.value);

    const showComments = ref(false);

    const toggleCommentsPanel = () => {
      showComments.value = !showComments.value;
    }

    const oidcIsAuthenticated = computed(() => store.getters['oidcStore/oidcIsAuthenticated']);
    const voted = computed(() => oidcIsAuthenticated.value && (userVoted.value === 'UP_VOTE'));

    const project = computed(() => store.getters.getProjectById(projectId.value));
    store.dispatch(ActionTypes.FetchProject, projectId.value);

    const category = computed(() => {
      if (categories.value.length > 0) {
        return store.getters.getCategoryById(categories.value[0]);
      }
      return null;
    });

    const projectCategories = computed(() => store.getters.categoriesList(projectId.value, {page: 0, per_page: 200, sort: 'name', sortDirection: 'ASC', search: ''}));

    //get github_url from project's additionalProperties
    const github_url = computed(() => {
      if (project.value && project.value.additionalProperties && project.value.additionalProperties.github_url ) {
        return project.value.additionalProperties.github_url
      }
    });
    const issue_url = computed(() => {
      if (additionalProperties.value && additionalProperties.value.issue_url ) {
        return additionalProperties.value.issue_url
      }
    });

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



    const toggleVote = () => {
      if (oidcIsAuthenticated.value) {
        const parameters = {
          requirementId: id.value,
          userVoted: userVoted.value === 'NO_VOTE' ? 'UP_VOTE' : 'NO_VOTE',
        };
        store.dispatch(ActionTypes.VoteRequirement, parameters);
      } else {
        alertLogin(t('signInToVoteRequirement'));
      }
    };

    const menu = ref(null);
    const toggleMenu = (event) => {
      (menu as any).value.toggle(event);
    };

    const confirmDelete = () => confirmDeleteRequirement(confirm, t, store, id.value);

    const displayRequirementEditor = ref(false);
    const requirementEditorCanceled = () => {
      displayRequirementEditor.value = false;
    }
    const requirementEditorSaved = () => {
      displayRequirementEditor.value = false;
    }

    const displayCategoryDialog = ref(false);
    const availableCategoryOptions = computed(() => {
      return projectCategories.value.map(category => {
        return {
          label: category.name,
          value: category,
        };
      });
    });
    const selectedCategoryOption = ref();
    const changeCategoryInProgress = ref(false);
    const showDisplayCategoryDialog = async () => {
      startLoading();
      await store.dispatch(ActionTypes.FetchCategoriesOfProject, {projectId: projectId.value});
      selectedCategoryOption.value = availableCategoryOptions.value.find(category => category.value.id === categories.value[0]);
      stopLoading();
      displayCategoryDialog.value = true;
    };

    const changeRequirementCategory = async () => {
      const parameters = {
        requirementId: id.value,
        projectId: projectId.value,
        categoryId: selectedCategoryOption.value.value.id,
      };
      await store.dispatch(ActionTypes.MoveRequirement, parameters);

      displayCategoryDialog.value = false;
    };

    const menuItems = ref();
    // watch multiple props
    watch(
      [locale, isFollower, isDeveloper, realized, issue_url, github_url],
      ([_, isFollower, isDeveloper, realized, issue_url, github_url]) => {
        menuItems.value = [
          {
            label: isFollower ? t('unfollowRequirement') : t('followRequirement'),
            icon: 'pi pi-bell',
            command: () => {
              store.dispatch(ActionTypes.FollowRequirement, {id: id.value, isFollower: isFollower ? false : true});
            }
          },
          {
            label: isDeveloper ? t('undevelopRequirement') : t('developRequirement'),
            icon: 'pi pi-file',
            command: () => {
              store.dispatch(ActionTypes.DevelopRequirement, {requirementId: id.value, isDeveloper: isDeveloper ? false : true});
            }
          },
          {
            label: realized ? t('markAsUndone') : t('markAsDone'),
            icon: 'pi pi-check',
            command: () => {
              store.dispatch(ActionTypes.RealizeRequirement, {requirementId: id.value, realized: realized ? false : true});
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
            label: issue_url ? t('viewOnGitHub') : t('createGithubIssue'),
            icon: 'pi pi-github',
            disabled: github_url === undefined,
            command: () => {
              if (issue_url) {
                window.open(issue_url)
              } else {
                createGitHubIssueForRequirement(confirm, t, project.value, {
                  id: id.value,
                  name: name.value,
                  description: description.value,
                  additionalProperties: additionalProperties.value,
                });
              }
            }
          },
          ...(userContext.value?.isMoveAllowed ? [
            {
            label: t('moveRequirementToCategory'),
            icon: 'pi pi-times',
            command: () => {
              showDisplayCategoryDialog();
            }
          }] : []),
          ...(userContext.value?.isDeleteAllowed ? [
            {
            label: t('deleteRequirement'),
            icon: 'pi pi-times',
            command: () => {
              confirmDelete();
            }
          }] : []),
          {
              label: t('exportRequirementPdf'),
              icon: 'pi pi-file-pdf',
              command: () => {
                exportToPDF(category.value,{id: id.value, name: name.value, description: description.value}, t);
              }
            },
            {
              label: t('exportRequirementTex'),
              icon: 'pi pi-file-o',
              command: () => {
                exportToTex(category.value, {id: id.value, name: name.value, description: description.value}, t);
              }
            }
        ];
      },
      {
        immediate: true
      }
    )

    const shareMenu = ref(null);
    const toggleShareMenu = (event) => {
      (shareMenu as any).value.toggle(event);
    };
    const shareMenuItems = ref([
      {
        label: 'Facebook',
        icon: 'pi pi-facebook',
        disabled: true,
        command: () => {
          console.log('Sharing to Facebook...');
        },
      },
      {
        label: 'Twitter',
        icon: 'pi pi-twitter',
        disabled: true,
        command: () => {
          console.log('Sharing to Twitter...');
        },
      },
      {
        label: t('copyToClipboard'),
        icon: 'pi pi-copy',
        command: () => {
          navigator.clipboard.writeText(createShareableRequirementLink(projectId.value, id.value));
        },
      },
    ]);

    const requirementPagePath = computed(() => routePathToRequirement(projectId.value, id.value));
    const onCardClick = () => {
      push(requirementPagePath.value);
    };

    return {
      id,
      projectId,
      voted,
      creationDate,
      lastActivity,
      lastActivityUser,
      showLastActivity,
      oidcIsAuthenticated,
      showComments,
      toggleCommentsPanel,
      toggleVote,
      t,
      toggleMenu,
      menu,
      menuItems,
      shareMenu,
      shareMenuItems,
      toggleShareMenu,
      displayRequirementEditor,
      requirementEditorCanceled,
      requirementEditorSaved,
      issue_url,
      displayCategoryDialog,
      category,
      availableCategoryOptions,
      selectedCategoryOption,
      changeRequirementCategory,
      changeCategoryInProgress,
      windowWidth,
      onCardClick,
      requirementPagePath,
    };
  },
})
</script>

<style scoped>
  #card ::v-deep(.p-card-content) {
    padding: 0;
  }

  #timeline {
    margin-bottom: 1rem;
  }

  .lastupdate {
    padding-top: 0.25em;
    font-weight: normal;
    font-size: 0.6em;
    color: #5d5d5d;
  }

  #figures {
    display: flex;
    flex-direction: row;
    width: 100%;
    padding-top: 0.5em;
    font-weight: bold;
  }

  #followers {
    flex: 1;
    text-align: center;
  }

  #comments {
    text-align: end;
  }

  #comments:hover {
    text-decoration: underline;
    cursor: pointer;
  }

  #actionButtons {
    width: 100%;
    display: flex;
    flex-direction: row;
    padding-top: 1rem;
  }

  #groupedButtons {
    display: flex;
    flex: 1;
  }

  #groupedButtons > * {
    display: flex;
    flex: 1;
    margin-inline-end: .5rem;
    font-weight: bold;
  }

  #groupedButtons :last-child {
    margin-inline-end: 0;
  }

  .card-title {
    display: flex;
    align-items: flex-start;
    flex-direction: column;
    justify-content: flex-start;
    padding-bottom: 0.25em;
  }

  .title {
    /* normize color which'd be added by router link ->*/
    color: #495057;
    padding-top: 0.25em;
  }

  .moreButton {
    margin-inline-start: .5rem;
  }

  .commentsList {
    padding-top: 1.5rem;
  }

    /*Timeline*/
  .custom-marker {
    display: flex;
    width: 2rem;
    height: 1rem;
    align-items: center;
    justify-content: center;
    color: green;
    border-radius: 50%;
    z-index: 1;
  }

  @media (min-width: 768px) {
    .card-title {
      align-items: center;
      flex-direction: row;
    }

    .title {
      padding-top: 0px;
    }
  }
</style>
