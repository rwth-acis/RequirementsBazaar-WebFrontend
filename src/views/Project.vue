<template>
  <h1>{{ project?.name }}</h1>
  <Button icon="pi pi-tag" label="Join Development on GitHub" class="p-button-sm p-button-outlined"  @click="joinDevelopment" v-if="showButtonJoinDevelopment()"></Button>
  <div id="description">
    <vue3-markdown-it :source="project?.description" />
  </div>
  <div id="timeline">
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
      <Button icon="pi pi-tag" label="New Release Available" class="p-button-sm p-button-outlined" v-if="showButtonNewRelease()" @click="newReleaseAvailable"></Button>
      <Button icon="pi pi-github" label="Connect to GitHub" class="p-button-sm p-button-outlined" v-if="oidcIsAuthenticated && !connectedToGitHub" @click="connectToGithub"></Button>
      <Button icon="pi pi-github" label="Show on GitHub" class="p-button-sm p-button-outlined" v-if="connectedToGitHub" @click="redirectToGitHubRepository()"></Button>
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
              :numberOfRequirements="category.numberOfRequirements">
            </CategoryCard>
          </router-link>
        </div>
      </div>
    </div>
    <div v-if="!showCategories">
      <ProjectMembersList v-if="project" :projectId="project.id" />
    </div>
  </div>

  <Dialog v-model:visible="showAddRepositoryDialog" :style="{width: '450px'}" header="Link GitHub repository" :modal="true" class="p-fluid">
        <p class="p-mb-2">
          To get started, first, paste the base URL of a GitHub Repository that should be connected to this project.
        </p>
        <span class="p-input-icon-left">
            <i class="pi pi-github" />
            <InputText id="repositoryUrl" type="text" v-model="updatedRepositoryUrl" placeholder="https://github.com/{account}/{repository}" />
            <label for="repositoryUrl">GitHub URL</label>
            <p v-if="repositoryUrlError" style="color: red">
              {{repositoryUrlError}}
            </p>
        </span>

        <template #footer>
            <ProgressBar mode="indeterminate" class="p-mb-3" v-if="inProgress" />
            <Button label="Cancel" icon="pi pi-times" class="p-button-text" @click="showAddRepositoryDialog = false" />
            <Button label="Save" icon="pi pi-check" class="p-button-text" @click="updateRepositoryUrl()" />
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
import { Project } from '@/types/bazaar-api';

export default defineComponent({
  components: {
    FilterPanel,
    CategoryCard,
    ProjectEditor,
    CategoryEditor,
    ProjectMembersList
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

    const tabItems = ref([
      {
        label: 'All Categories', // was: 'Overview'
        to: `/projects/${projectId}`
      },
      {
        label: 'Members',
        to: `/projects/${projectId}/members`
      }
      /*
      {
        label: 'All Categories',
        to: `/projects/${projectId}/all`
      },*/
    ]);

    const projectEditorName = ref('');
    const projectEditorDescription = ref('');

    watch([project, oidcIsAuthenticated], () => {

      projectEditorName.value = project.value.name;
      projectEditorDescription.value = project.value.description;

      //const role = project.value.userContext?.projectRole;
      //if (['ProjectAdmin', 'SystemAdmin'].includes(role)) {
      const membersItemId = tabItems.value.findIndex(item => item.label === 'Members');
      if (!oidcIsAuthenticated.value && membersItemId > -1) {
        tabItems.value.splice(membersItemId, 1);
      }
      if (oidcIsAuthenticated.value && project.value.userContext?.projectRole === 'ProjectAdmin') {
        if (membersItemId === -1) {
          tabItems.value.push(
            {
              label: 'Members',
              to: `/projects/${projectId}/members`
            }
          );
        }
      }
    });

    const searchQuery = ref('');
    const selectedSort = ref('name');
    const sortOptions = [
      {name: 'Alphabetically', value: 'name'},
      {name: t('sorting-activity'), value: 'last_activity'},
      {name: t('sorting-date'), value: 'date'},
      {name: 'Number of Requirements', value: 'requirement'},
      {name: 'Number of Followers', value: 'follower'},
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

    // Button connect to github
    const connectToGithub = () => {
      const baseUrl = "https://beta.requirements-bazaar.org/bazaar";
      const projectName = projectEditorName.value.replace(/\s/g, '');
      if(!connectedToGitHub.value){
          console.log("url:" + repository_url.value)
          if (repository_url.value === undefined || repository_url.value === '') {
            showAddRepositoryDialog.value =  true;
            // wait until URL is set -> then continue the create webhook flow
            return;
          }

          confirm.require({
            header: 'Redirect to Github (Hint: Copy Webhook and Secret)',
            message: 'Webhook: '+baseUrl+'/webhook/'+projectId+'/github '+ 'Secret: '+ projectName,
            icon: 'pi pi-external-link',
            group: 'dialog',
              accept: () => {
              window.open(repository_url.value + "/settings/hooks/new");
              },
              reject: () => {
              console.log('not redirected');
              }
          });
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
        repositoryUrlError.value = 'Please enter a valid GitHub repository URL';
        return;
      }

      repositoryUrlError.value = undefined;
      inProgress.value = true;

      const projectUpdate = {
        id: project.value.id,
        name: project.value.name,
        description: project.value.description,
        additionalProperties: JSON.parse(JSON.stringify(project.value.additionalProperties)),
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
          message: 'You need to sign in to follow a project.',
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
          message: 'You need to sign in to create a category.',
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
      repositoryUrlError
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

</style>
