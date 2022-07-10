<template>
  <ProjectBreadcrumbNav v-if="project"
    :projectId="project.id"
    :projectName="project.name"
    class="p-mt-3" />
  <h1>{{ project?.name }}</h1>
  <Button icon="pi pi-tag" :label="t('projectDetails-joinDevelopmentOnGithub')" class="p-button-sm p-button-outlined"  @click="joinDevelopment" v-if="showButtonJoinDevelopment()"></Button>
  <div id="description">
    <vue3-markdown-it :source="project?.description" />
  </div>
  <div id="timeline" v-if="timelineEnabled">
    <h2>Development Timeline</h2>
    <Timeline :value="timelineEvents" layout="horizontal" align="bottom">
        <template #marker="slotProps">
          <span class="custom-marker">
            <i :class="slotProps.item.status"></i>
          </span>
        </template>
        <template #content="slotProps">
          {{slotProps.item.label}}
        </template>
    </Timeline>
  </div>

  <Dialog :header="t('editProject')" v-model:visible="displayProjectEditor" :breakpoints="{'960px': '75vw', '640px': '100vw'}" :style="{width: '50vw'}" :modal="true">
    <ProjectEditor
      :name="project?.name"
      :description="project?.description"
      :projectId="project?.id"
      :additionalProperties="project?.additionalProperties"
      @cancel="projectEditorCanceled"
      @save="projectEditorSaved">
    </ProjectEditor>
  </Dialog>
  <div id="addCategoryPanel">
    <Button
      label="Add new Category..."
      v-if="!showAddCategory"
      @click="toggleAddCategory" />
    <div class="categoryEditorContainer">
      <CategoryEditor
        class="categoryEditor"
        v-if="showAddCategory"
        :projectId="project?.id"
        @cancel="editorCanceled"
        @save="editorSaved">
      </CategoryEditor>
    </div>
  </div>
  <div id="menuBar">
    <TabMenu id="tabMenu" :model="tabItems" />
    <div id="actionButtons">
      <Button icon="pi pi-tag" :label="t('projectDetails-newRelease')" class="p-button-sm p-button-outlined" v-if="showButtonNewRelease()" @click="newReleaseAvailable"></Button>
      <Button icon="pi pi-github" :label="t('projectDetails-connectToGitHub')" class="p-button-sm p-button-outlined" v-if="oidcIsAuthenticated && !connectedToGitHub" @click="connectToGithub"></Button>
      <Button icon="pi pi-github" :label="t('projectDetails-showOnGitHub')" class="p-button-sm p-button-outlined" v-if="connectedToGitHub" @click="redirectToGitHubRepository()"></Button>
      <Button icon="pi pi-bell" :label="oidcIsAuthenticated && project?.userContext?.isFollower ? t('unfollowProject') : t('followProject')" class="p-button-sm" :class="{ 'p-button-outlined': !(oidcIsAuthenticated && project?.userContext?.isFollower) }" @click="followClick"></Button>
      <Button label="..." class="p-button-sm p-button-outlined" @click="toggleMoreMenu" v-if="oidcIsAuthenticated"></Button>
      <Menu id="overlay_menu" ref="moreMenu" :model="moreItems" :popup="true" />
    </div>
  </div>
  <div id="content">
    <div v-show="showCategories">
      <FilterPanel
        v-model:searchQuery="searchQuery"
        :sortOptions="sortOptions"
        v-model:selectedSort="selectedSort"
        v-model:sortAscending="sortAscending">
      </FilterPanel>
      <div id="categoriesList">
        <div v-for="category in categories" :key="category.id" class="categoryCard">
          <router-link :to="'/projects/' + project?.id + '/categories/' + category?.id">
            <CategoryCard
              :id="category.id"
              :name="category.name"
              :description="category.description"
              :creationDate="category.creationDate"
              :lastActivity="category.lastActivity"
              :numberOfFollowers="category.numberOfFollowers"
              :numberOfRequirements="category.numberOfRequirements"
              :showCreationDate="selectedSort === 'date'">
            </CategoryCard>
          </router-link>
        </div>
      </div>
    </div>
    <div v-if="!showCategories">
      <ProjectMembersList v-if="project" :projectId="project.id" />
    </div>
  </div>

  <Dialog v-model:visible="showAddRepositoryDialog" :style="{width: '450px'}" :header="t('linkRepository-dialogHeader')" :modal="true" class="p-fluid">
        <p class="p-mb-2">
          {{ t('linkRepository-pasteUrlInstruction') }}
        </p>
        <span class="p-input-icon-left">
            <i class="pi pi-github" />
            <InputText id="repositoryUrl" type="text" v-model="updatedRepositoryUrl" placeholder="https://github.com/{account}/{repository}" />
            <label for="repositoryUrl">{{ t('gitHubUrlLabel') }}</label>
            <p v-if="repositoryUrlError" style="color: red">
              {{repositoryUrlError}}
            </p>
        </span>

        <template #footer>
            <ProgressBar mode="indeterminate" class="p-mb-3" v-if="inProgress" />
            <Button :label="t('cancel')" icon="pi pi-times" class="p-button-text" @click="showAddRepositoryDialog = false" />
            <Button :label="t('save')" icon="pi pi-check" class="p-button-text" @click="updateRepositoryUrl()" />
        </template>
    </Dialog>

    <Dialog v-model:visible="showConfigureWebhookDilog" :style="{width: '800px'}" header="Configure GitHub Webhook" :modal="true" class="p-fluid">
        <p class="p-mb-2">
          {{ t('gitHubSetup-configureWebhookInstruction') }}
        </p>
        <p>
          {{ t('gitHubSetup-pleaseGoTo') }}
          <a :href="githubWebhookSettingsURL" target="_blank" rel="noreferrer" @click="webhookSettingsOpened = true">{{githubWebhookSettingsURL}}</a>
          {{ t('gitHubSetup-andConfigureValues') }}
        </p>
        <ul>
          <li><b>{{ t('gitHubSetup-payloadUrlLabel') }}</b>: {{webhookEndpointURL}}</li>
          <li><b>{{ t('gitHubSetup-contentTypeLabel') }}</b>: <i>application/json</i></li>
          <li><b>{{ t('gitHubSetup-secretLabel') }}</b>: {{webhookSecret}}</li>
          <li><b>{{ t('gitHubSetup-eventsLabel') }}</b>: {{ t('gitHubSetup-eventsLabel-hint') }}:
            <ul>
              <li>{{ t('gitHubSetup-eventsLabel-optionAllEvents') }}</li>
              <li>{{ t('gitHubSetup-eventsLabel-optionSpecificEvents') }}</li>
            </ul>
          </li>
        </ul>

        <template #footer>
            <Button :label="t('cancel')" icon="pi pi-times" class="p-button-text" @click="showConfigureWebhookDilog = false" />
            <Button v-if="!webhookSettingsOpened" :label="t('gitHubSetup-goToGitHubSettings')" icon="pi pi-check" class="p-button-text" @click="openWebhookSettings()" />
            <Button v-else :label="t('done')" icon="pi pi-check" class="p-button-text" @click="showConfigureWebhookDilog = false" />
        </template>
    </Dialog>
</template>

<script lang="ts">
import { computed, defineComponent, Ref, ref, watch } from 'vue';
import { useStore } from 'vuex';
import { useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n';
import { useConfirm } from 'primevue/useconfirm';
import { ActionTypes } from '../store/actions';

import FilterPanel from '../components/FilterPanel.vue';
import CategoryCard from '../components/CategoryCard.vue';
import ProjectEditor from '../components/ProjectEditor.vue';
import CategoryEditor from '../components/CategoryEditor.vue';
import ProjectMembersList from '../components/ProjectMembersList.vue';
import ProjectBreadcrumbNav from '@/components/ProjectBreadcrumbNav.vue';

import { Project } from '@/types/bazaar-api';

export default defineComponent({
  components: {
    FilterPanel,
    CategoryCard,
    ProjectEditor,
    CategoryEditor,
    ProjectMembersList,
    ProjectBreadcrumbNav,
  },
  name: 'Project',
  props: {
  },
  setup: (props) => {
    const store = useStore();
    const route = useRoute();
    const { t } = useI18n({ useScope: 'global' });
    const oidcIsAuthenticated = computed(() => store.getters['oidcStore/oidcIsAuthenticated']);
    const confirm = useConfirm();

    const projectId = Number.parseInt(route.params.projectId.toString(), 10);
    const project = computed(() => store.getters.getProjectById(projectId));
    store.dispatch(ActionTypes.FetchProject, projectId);
    const showCategories = computed(() => route.params.members ? false : true);

    // read values for the timeline
    const hook_id_value = computed(() => project.value?.additionalProperties?.hook_id);
    const repository_url = computed(() => project.value?.additionalProperties?.github_url);
    const release_value = computed(() => project.value?.additionalProperties?.release); //url
    const pull_request_status = computed(() => project.value?.additionalProperties?.pull_request); //status
    const pull_request_url = computed(() => project.value?.additionalProperties?.pull_request_url); //url

    /*
     * Temporary disable the timeline for projects until we have better semantics for it.
     */
    const timelineEnabled = ref(false);

    // ****** Functions to update the timeline icons *****
    // Project exported & hook received
    function timelineStatusGithub(){
      let statusLabelGithub = "pi pi-circle-off";
      if(hook_id_value.value !== undefined){
        statusLabelGithub = "pi pi-check-circle";
      }
      return statusLabelGithub;
    }
    // Pull Request opened
    function timelineStatusPullRequest(){
      let statusLabelPullRequest = "pi pi-circle-off";
      if(pull_request_status.value == "opened"){
        statusLabelPullRequest = "pi pi-check-circle";
      }
      return statusLabelPullRequest;
    }
    function timelineStatusRelease(){
      let statusLabelRelease = "pi pi-circle-off";
      if(release_value.value !== undefined){
        statusLabelRelease = "pi pi-check-circle";
      }
      return statusLabelRelease;
    }

    //Timeline events
    const timelineEvents = ref([
      {label: 'Development Started',        status: timelineStatusGithub()},
      {label: 'Development in Progress',    status: timelineStatusPullRequest()},
      {label: 'Released',                   status: timelineStatusRelease()},
      ]);

    // Show button "new release"
    function showButtonNewRelease(){
      let buttonNewRelease = false;
      if(release_value.value !== undefined)
        buttonNewRelease = true;
      return buttonNewRelease;
    };

    // Show button "join development"
    function showButtonJoinDevelopment(){
      let buttonJoinDevelopment = false;
      if(pull_request_url.value != undefined)
        buttonJoinDevelopment = true;
      return buttonJoinDevelopment;
    }

    // Redirect to github pull requests
    const joinDevelopment = () => {
      confirm.require({
        header: 'Join Development on GitHub',
        message: 'You will be redirected to GitHub',
        icon: 'pi pi-external-link',
        group: 'dialog',
            accept: () => {
            window.open(pull_request_url.value);
            },
            reject: () => {
            console.log('not redirected');
            }
      })
    };

    // Redirect to github repository
    const redirectToGitHubRepository = () => {
      confirm.require({
        header: 'See this project on GitHub',
        message: 'You will be redirected to GitHub',
        icon: 'pi pi-external-link',
        group: 'dialog',
            accept: () => {
              window.open(repository_url.value);
            },
            reject: () => {
              console.log('not redirected');
            }
      })
    };

    watch(oidcIsAuthenticated, () => store.dispatch(ActionTypes.FetchProject, projectId));

    const MEMBERS_TAB_LABEL = t('projectDetails-members');
    const MEMBERS_TAB_ITEM = {
      label: MEMBERS_TAB_LABEL,
      to: `/projects/${projectId}/members`
    };

    const tabItems = ref([
      {
        label: t('projectDetails-allCategories'), // was: 'Overview'
        to: `/projects/${projectId}`
      },
      MEMBERS_TAB_ITEM
    ]);

    const projectEditorName = ref('');
    const projectEditorDescription = ref('');

    watch([project, oidcIsAuthenticated], () => {

      projectEditorName.value = project.value.name;
      projectEditorDescription.value = project.value.description;

      //const role = project.value.userContext?.projectRole;
      //if (['ProjectAdmin', 'SystemAdmin'].includes(role)) {
      const membersItemId = tabItems.value.findIndex(item => item.label === MEMBERS_TAB_LABEL);
      if (!oidcIsAuthenticated.value && membersItemId > -1) {
        tabItems.value.splice(membersItemId, 1);
      }
      if (oidcIsAuthenticated.value) {
        if (membersItemId === -1) {
          // user is authentivated and memebrs tab not visible yet -> add to tab items
          tabItems.value.push(MEMBERS_TAB_ITEM);
        }
      }
    });

    const searchQuery = ref('');
    const selectedSort = ref('name');
    const sortOptions = [
      {name: t('sorting-alphabetical'), value: 'name'},
      {name: t('sorting-activity'), value: 'last_activity'},
      {name: t('sorting-date'), value: 'date'},
      {name: t('sorting-requirements'), value: 'requirement'},
      {name: t('sorting-followers'), value: 'follower'},
    ];
    const sortAscending = ref(true);
    const page = ref(0);
    const perPage = ref(20);
    const sortDirection = computed(() => sortAscending.value ? 'ASC' : 'DESC');
    const parameters = computed(() => {return {page: page.value, per_page: perPage.value, sort: selectedSort.value, sortDirection: sortDirection.value, search: searchQuery.value}});
    const categories = computed(() => store.getters.categoriesList(projectId, parameters.value));
    store.dispatch(ActionTypes.FetchCategoriesOfProject, {projectId: projectId, query: parameters.value});
    watch(selectedSort, () => {
      sortAscending.value = selectedSort.value === 'name';
    });
    watch(parameters, () => store.dispatch(ActionTypes.FetchCategoriesOfProject, {projectId: projectId, query: parameters.value}));

    // Alerts
    const alertMessage = (message: string) => {
      confirm.require({
          group: 'dialog',
          message: message,
          header: 'Ops!',
          icon: 'pi pi-info-circle',
          rejectClass: 'p-sr-only',
          acceptLabel: 'OK',
        });
    }

    const connectedToGitHub = computed(() => hook_id_value.value != undefined)

    const inProgress = ref(false);

    const showAddRepositoryDialog = ref(false);
    const updatedRepositoryUrl = ref('');
    const repositoryUrlError = ref();

    const showConfigureWebhookDilog = ref(false);
    const githubWebhookSettingsURL = computed(() => repository_url.value + "/settings/hooks/new");
    const webhookEndpointURL = computed(() => `${import.meta.env.VITE_BAZAAR_API_URL}/webhook/${projectId}/github`);
    const webhookSecret = computed(() => project.value.name.replace(/\s/g, ''));
    const webhookSettingsOpened = ref(false);

    const openWebhookSettings = () => {
      window.open(githubWebhookSettingsURL.value);
      webhookSettingsOpened.value = true;
    };

    // Button connect to github
    const connectToGithub = () => {
      if(!connectedToGitHub.value){
          console.log("url:" + repository_url.value)
          if (repository_url.value === undefined || repository_url.value === '') {
            showAddRepositoryDialog.value =  true;
            // wait until URL is set -> then continue the create webhook flow
            return;
          }

          // reset the state of the 'go to webhook settings' button
          webhookSettingsOpened.value = false;
          showConfigureWebhookDilog.value = true;
      } else{
        alertMessage('This Project is already connected to GitHub.');
      }
    };

    const isGitHubRepositoryUrlValid = (url: string) => {
      if (url === undefined || url === '') {
        return false;
      }
      return url.startsWith('https://github.com/');
    }

    const updateRepositoryUrl = () => {
      if (!isGitHubRepositoryUrlValid(updatedRepositoryUrl.value)) {
        repositoryUrlError.value = t('linkRepository-urlInvalid');
        return;
      }

      repositoryUrlError.value = undefined;
      inProgress.value = true;

      const projectUpdate = {
        id: project.value.id,
        name: project.value.name,
        description: project.value.description,
        additionalProperties: JSON.parse(JSON.stringify(project.value.additionalProperties ?? {})),
      };
      if (!projectUpdate.additionalProperties) {
        projectUpdate.additionalProperties = {
          'github_url': updatedRepositoryUrl.value
        }
      } else {
        projectUpdate.additionalProperties.github_url = updatedRepositoryUrl.value
      }

      store.dispatch(ActionTypes.UpdateProject, projectUpdate).then(() => {
        console.log('DONE');
        inProgress.value = false;
        showAddRepositoryDialog.value = false;

        // start normal connect to GitHub flow
        connectToGithub();
      });
    }

    // Button new release
    const newReleaseAvailable = () => {
      const releaseUrl = project.value.additionalProperties.release;
      confirm.require({
          header: 'Redirect to External Link',
          message: 'You will be redirected to the latest release',
          icon: 'pi pi-external-link',
          group: 'dialog',
            accept: () => {
            window.open(releaseUrl);
            },
            reject: () => {
            console.log('not redirected');
            }
          });
    };

    function followClick() {
      if(oidcIsAuthenticated.value) {
        store.dispatch(ActionTypes.FollowProject, { id: projectId, isFollower: project.value.userContext.isFollower? false:true });
      } else {
        confirm.require({
          group: 'dialog',
          message: t('signInToFollowProject'),
          header: 'Login',
          icon: 'pi pi-info-circle',
          rejectClass: 'p-sr-only',
          acceptLabel: 'OK',
        });
      }
    }

    const confirmDelete = () => {
      confirm.require({
        header: t('deleteProjectTitle'),
        message: t('deleteProjectDesc'),
        icon: 'pi pi-info-circle',
        acceptClass: 'p-button-danger',
        group: 'dialog',
        accept: () => {
          console.log('deleted');
        },
        reject: () => {
          console.log('not deleted');
        }
      });
    }

    const displayProjectEditor = ref(false);
    const projectEditorCanceled = () => {
      displayProjectEditor.value = false;
    }
    const projectEditorSaved = () => {
      displayProjectEditor.value = false;
    }

    const moreItems = ref([
      {
        label: t('editProject'),
        icon: 'pi pi-pencil',
        command: () => {
          displayProjectEditor.value = true;
        }
      },
      /*{
        label: t('deleteProjectTitle'),
        icon: 'pi pi-times',
        command: () => {
          confirmDelete();
        }
      },*/
    ]);

    const moreMenu = ref(null);
    const toggleMoreMenu = (event) => {
      (moreMenu as any).value.toggle(event);
    };

    const showAddCategory = ref(false);
    const toggleAddCategory = () => {
      if (oidcIsAuthenticated.value) {
        showAddCategory.value = !showAddCategory.value;
      } else {
        confirm.require({
          group: 'dialog',
          message: t('signInToCreateCategory'),
          header: 'Login',
          icon: 'pi pi-info-circle',
          rejectClass: 'p-sr-only',
          acceptLabel: 'OK',
        });
      }
    }

    const editorCanceled = () => {
      toggleAddCategory();
    }

    const editorSaved = () => {
      toggleAddCategory();
    }

    return {
      t,
      oidcIsAuthenticated,
      showAddCategory,
      toggleAddCategory,
      tabItems,
      moreItems,
      moreMenu,
      toggleMoreMenu,
      project,
      followClick,
      categories,
      searchQuery,
      selectedSort,
      sortOptions,
      sortAscending,
      editorCanceled,
      editorSaved,
      displayProjectEditor,
      projectEditorCanceled,
      projectEditorSaved,
      showCategories,
      connectToGithub,
      timelineEvents,
      newReleaseAvailable,
      showButtonNewRelease,
      showButtonJoinDevelopment,
      redirectToGitHubRepository,
      connectedToGitHub,
      joinDevelopment,
      alertMessage,
      updatedRepositoryUrl,
      showAddRepositoryDialog,
      updateRepositoryUrl,
      inProgress,
      repositoryUrlError,
      showConfigureWebhookDilog,
      githubWebhookSettingsURL,
      webhookEndpointURL,
      webhookSecret,
      webhookSettingsOpened,
      openWebhookSettings,
      timelineEnabled,
    }
  }
})
</script>

<style scoped>
  #description {
    margin-bottom: 2rem;

  }
  #timeline {
    margin-bottom: 1rem;
  }

  #addCategoryPanel {
    margin-bottom: 1.5rem;
  }

  .categoryEditorContainer {
    display: flex;
    flex-flow: column;
    align-items: center;
    width: 100%;
  }

  .categoryEditor {
    width: 100%;
    max-width: 700px;
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

  #content {
    padding: 1rem;
  }

  #categoriesList {
    display: flex;
    flex-flow: column;
    align-items: center;
    width: 100%;
  }

  .categoryCard {
    width: 100%;
    max-width: 700px;
    margin: 10px;
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
