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
      <Button icon="pi pi-github" label="Connect to GitHub" class="p-button-sm p-button-outlined" v-if="oidcIsAuthenticated" @click="connectToGithub"></Button>
      <Button icon="pi pi-bell" :label="oidcIsAuthenticated && project?.userContext?.isFollower ? t('unfollowProject') : t('followProject')" class="p-button-sm" :class="{ 'p-button-outlined': !(oidcIsAuthenticated && project?.userContext?.isFollower) }" @click="followClick"></Button>
      <Button label="..." class="p-button-sm p-button-outlined" @click="toggleMoreMenu" v-if="oidcIsAuthenticated"></Button>
      <Menu id="overlay_menu" ref="moreMenu" :model="moreItems" :popup="true" />
    </div>
  </div>
  <div id="content">
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
            :numberOfFollowers="category.numberOfFollowers"
            :numberOfRequirements="category.numberOfRequirements">
          </CategoryCard>
        </router-link>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, ref, watch } from 'vue';
import { useStore } from 'vuex';
import { useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n';
import { useConfirm } from 'primevue/useconfirm';
import { ActionTypes } from '../store/actions';

import FilterPanel from '../components/FilterPanel.vue';
import CategoryCard from '../components/CategoryCard.vue';
import ProjectEditor from '../components/ProjectEditor.vue';
import CategoryEditor from '../components/CategoryEditor.vue';

export default defineComponent({
  components: {
    FilterPanel,
    CategoryCard,
    ProjectEditor,
    CategoryEditor,
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

    // read values for the timeline
    const hook_id_value = project.value?.additionalProperties?.hook_id;
    const release_value = project.value?.additionalProperties?.release; //url
    const pull_request_status = project.value?.additionalProperties?.pull_request; //status
    const pull_request_url = project.value?.additionalProperties?.pull_request_url; //url 
    // ****** Functions to update the timeline icons *****
    // Project exported & hook received
    function timelineStatusGithub(){
      let statusLabelGithub = "pi pi-circle-off";
      if(hook_id_value !== undefined){
        statusLabelGithub = "pi pi-check-circle";
      }
      return statusLabelGithub;
    }
    // Pull Request opened 
    function timelineStatusPullRequest(){
      let statusLabelPullRequest = "pi pi-circle-off";
      if(pull_request_status == "opened"){
        statusLabelPullRequest = "pi pi-check-circle";
      }
      return statusLabelPullRequest;
    }
    function timelineStatusRelease(){
      let statusLabelRelease = "pi pi-circle-off";
      if(release_value !== undefined){
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
      if(release_value !== undefined)
        buttonNewRelease = true;
      return buttonNewRelease;
    };

    // Show button "join development"
    function showButtonJoinDevelopment(){
      let buttonJoinDevelopment = false;
      if(pull_request_url != undefined)
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
            window.open(pull_request_url);
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
          )
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
  // Button connect to github
    const connectToGithub = () => {
      const baseUrl = "https://beta.requirements-bazaar.org/bazaar";
      const projectName = projectEditorName.value.replace(/\s/g, '');
      const githubBaseUrl = project.value.additionalProperties.github_url;
      if(hook_id_value == undefined){
          confirm.require({
          header: 'Redirect to Github (Hint: Copy Webhook and Secret)',
          message: 'Webhook: '+baseUrl+'/webhook/'+projectId+'/github '+ 'Secret: '+ projectName,
          icon: 'pi pi-external-link',
          group: 'dialog',
            accept: () => {
            window.open(githubBaseUrl+"/settings/hooks/new");
            },
            reject: () => {
            console.log('not redirected');
            }
          });
      } else{
        alertMessage('This Project is already connected to GitHub.');
      }

    };
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
      connectToGithub,
      timelineEvents,
      newReleaseAvailable,
      showButtonNewRelease,
      showButtonJoinDevelopment,
      joinDevelopment,
      alertMessage,
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
