<template>
  <ScrollTop />
  <ProjectBreadcrumbNav v-if="category && project"
    :projectId="category.projectId"
    :projectName="project.name"
    :categoryId="category.id"
    :categoryName="category.name"
    class="p-mt-3" />
  <h1>{{ category?.name }}</h1>
  <div id="description">
    <vue3-markdown-it :source="category?.description" />
  </div>
  <Dialog :header="t('editCategory')" v-model:visible="displayCategoryEditor" :breakpoints="{'960px': '75vw', '640px': '100vw'}" :style="{width: '50vw'}" :modal="true">
    <CategoryEditor
      :name="category?.name"
      :description="category?.description"
      :categoryId="category?.id"
      :projectId="category?.projectId"
      @cancel="categoryEditorCanceled"
      @save="categoryEditorSaved">
    </CategoryEditor>
  </Dialog>
  <div id="addRequirementPanel">
    <Button
      :label="t('categoryDetails-addRequirement')"
      v-if="!showAddRequirement"
      @click="toggleAddRequirement" />
    <div class="requirementEditorContainer">
      <RequirementEditor
        class="requirementEditor"
        v-if="showAddRequirement"
        :projectId="category?.projectId"
        :categories="[category?.id]"
        @cancel="editorCanceled"
        @save="editorSaved">
      </RequirementEditor>
    </div>
  </div>
  <div id="menuBar">
    <TabMenu id="tabMenu" :model="tabItems" @click="forceUpdateRequirementsList()" />
    <div id="actionButtons">
      <Button icon="pi pi-bell" :label="category?.userContext?.isFollower ? t('unfollowCategory') : t('followCategory')" class="p-button-sm" :class="{ 'p-button-outlined': !category?.userContext?.isFollower }" @click="followClick"></Button>
      <Button label="..." class="p-button-sm p-button-outlined" @click="toggleMoreMenu" v-if="oidcIsAuthenticated"></Button>
      <Menu id="overlay_menu" ref="moreMenu" :model="moreItems" :popup="true" />
    </div>
  </div>
  <div id="content">
    <div>
      <FilterPanel
        v-model:searchQuery="searchQuery"
        :sortOptions="sortOptions"
        v-model:selectedSort="selectedSort"
        v-model:sortAscending="sortAscending">
      </FilterPanel>
      <div class="requirementsList" v-show="!done">
        <div v-if="activeRequirements.length === 0">
          {{ t('categoryDetails-nothingToSeeHere') }}
        </div>
        <div v-for="requirement in activeRequirements" :key="requirement.id" class="requirementCard">
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
            :realized="requirement.realized"
            :additionalProperties="requirement.additionalProperties">
          </RequirementCard>
        </div>
      </div>
      <div class="requirementsList" v-show="done">
        <div v-if="realizedRequirements.length === 0">
          {{ t('categoryDetails-nothingToSeeHere') }}
        </div>
        <div v-for="requirement in realizedRequirements" :key="requirement.id" class="requirementCard">
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
            :realized="requirement.realized"
            :additionalProperties="requirement.additionalProperties">
          </RequirementCard>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, ref, watch } from 'vue';
import { useStore } from 'vuex';
import { useRoute } from 'vue-router';
import { useI18n } from 'vue-i18n';
import { useConfirm } from 'primevue/useconfirm';
import { ActionTypes } from '../store/actions';

import FilterPanel from '../components/FilterPanel.vue';
import RequirementCard from '../components/RequirementCard.vue';
import CategoryEditor from '../components/CategoryEditor.vue';
import RequirementEditor from '../components/RequirementEditor.vue';
import ProjectBreadcrumbNav from '@/components/ProjectBreadcrumbNav.vue';

import { Requirement } from '@/types/bazaar-api';

export default defineComponent({
  name: 'Category',
  components: { FilterPanel, RequirementCard, CategoryEditor, RequirementEditor, ProjectBreadcrumbNav },
  props: {
  },
  setup: (props) => {
    const store = useStore();
    const route = useRoute();
    const { t } = useI18n({ useScope: 'global' });
    const oidcIsAuthenticated = computed(() => store.getters['oidcStore/oidcIsAuthenticated']);
    const confirm = useConfirm();

    const categoryId = Number.parseInt(route.params.categoryId.toString(), 10);
    const projectId = Number.parseInt(route.params.projectId.toString(), 10);
    const done = computed(() => route.params.done ? true : false);

    const category = computed(() => store.getters.getCategoryById(categoryId));
    const project = computed(() => store.getters.getProjectById(projectId));

    store.dispatch(ActionTypes.FetchCategory, categoryId);
    store.dispatch(ActionTypes.FetchProject, projectId);

    const searchQuery = ref('');
    const selectedSort = ref('date');
    const sortOptions = [
      {name: t('sorting-alphabetical'), value: 'name'},
      {name: t('sorting-activity'), value: 'last_activity'},
      {name: t('sorting-date'), value: 'date'},
      {name: t('sorting-comments'), value: 'comment'},
      {name: t('sorting-followers'), value: 'follower'},
      {name: t('sorting-votes'), value: 'vote'},
    ];
    const sortAscending = ref(false);
    const page = ref(0);
    const perPage = ref(20);
    const sortDirection = computed(() => sortAscending.value ? 'ASC' : 'DESC');
    const parameters = computed(() => {return {page: page.value, per_page: perPage.value, sort: selectedSort.value, sortDirection: sortDirection.value, search: searchQuery.value}});

    const activeRequirements = ref<Requirement[]>([]);
    const realizedRequirements = ref<Requirement[]>([]);
    // set to true when changing 'done' status, so requirement stays in the same tab until user reloads/switches tabs
    const updatingActiveRequirementsListEnabled = ref(true);
    const updatingRealizedRequirementsListEnabled = ref(true);
    const activeRequirementsFromStore = computed(() => store.getters.requirementsList(categoryId, parameters.value, false));
    const realizedRequirementsFromStore = computed(() => store.getters.requirementsList(categoryId, parameters.value, true));

    const forceUpdateRequirementsList = () => {
      console.log('forceUpdateRequirementsList:');
      updatingActiveRequirementsListEnabled.value = true;
      updatingRealizedRequirementsListEnabled.value = true;

      store.dispatch(ActionTypes.FetchRequirementsOfCategory, {categoryId: categoryId, query: parameters.value});
    };


    /*
     * Takes a requirement (which we maybe got from a store update) and replaces the existing requirement in the same list (active/realized).
     * With this, maybe overcomplicated update function, we achive a nice UX when changing the 'done' state of a requirement.
     * The requirement will stay in the same list for the moment and is only flagged with a 'done' label. Only when the page is reload, or the user
     * switches the tabs the lists are completely updated.
     */
    const replaceRequirementInCurrentListHelper = (requirement: Requirement) => {
      const indexInActiveList = activeRequirements.value.findIndex(e => e.id === requirement.id);
      if (indexInActiveList !== -1) {
        activeRequirements.value[indexInActiveList] = requirement;
      } else {
        const indexInRealizedList = realizedRequirements.value.findIndex(e => e.id === requirement.id);
        if (indexInRealizedList !== -1) {
          realizedRequirements.value[indexInRealizedList] = requirement;
        } else {
          // append new requirment to the correct list
          if (requirement.realized) {
            realizedRequirements.value.push(requirement);
          } else {
            activeRequirements.value.push(requirement);
          }
        }
      }
    };

    const removeDeletedRequirementsInCurrentListHelper = () => {
      activeRequirements.value.forEach(requirement => {
        if (!activeRequirementsFromStore.value.some(e => e.id === requirement.id)
            && !realizedRequirementsFromStore.value.some(e => e.id === requirement.id)) {
          // requirement is neither in the active nor in the realized list => it was deleted
          activeRequirements.value.splice(activeRequirements.value.indexOf(requirement), 1);
        }
      });

      realizedRequirements.value.forEach(requirement => {
        if (!activeRequirementsFromStore.value.some(e => e.id === requirement.id)
            && !realizedRequirementsFromStore.value.some(e => e.id === requirement.id)) {
          // requirement is neither in the active nor in the realized list => it was deleted
          realizedRequirements.value.splice(realizedRequirements.value.indexOf(requirement), 1);
        }
      });
    }

    watch(activeRequirementsFromStore, () => {
      if (updatingActiveRequirementsListEnabled.value) {
        activeRequirements.value = activeRequirementsFromStore.value;
        updatingActiveRequirementsListEnabled.value = false; // pause again until next 'hard' update reason
      } else {
        // instead of replacing the whole list, we update the individual requirements if ID matches ('soft' update)
        activeRequirementsFromStore.value.forEach(replaceRequirementInCurrentListHelper);
      }

      // Remove requirements which no longer exist in store
      removeDeletedRequirementsInCurrentListHelper();
    });
    watch(realizedRequirementsFromStore, () => {
      if (updatingRealizedRequirementsListEnabled.value) {
        realizedRequirements.value = realizedRequirementsFromStore.value;
        updatingRealizedRequirementsListEnabled.value = false; // pause again until next 'hard' update reason
      } else {
        // instead of replacing the whole list, we update the individual requirements if ID matches ('soft' update)
        realizedRequirementsFromStore.value.forEach(replaceRequirementInCurrentListHelper);
      }

      // Remove requirements which no longer exist in store
      removeDeletedRequirementsInCurrentListHelper();
    });

    store.dispatch(ActionTypes.FetchRequirementsOfCategory, {categoryId: categoryId, query: parameters.value});

    watch(selectedSort, () => {
      sortAscending.value = selectedSort.value === 'name';
    });
    watch(parameters, () => {
       // if parameters change we should do a 'hard' update of the list (put done requirements in the correct tabs)
       forceUpdateRequirementsList();
    });

    const showAddRequirement = ref(false);
    const toggleAddRequirement = () => {
      if (oidcIsAuthenticated.value) {
        showAddRequirement.value = !showAddRequirement.value;
      } else {
        confirm.require({
          group: 'dialog',
          message: t('signInToCreateRequirement'),
          header: 'Login',
          icon: 'pi pi-info-circle',
          rejectClass: 'p-sr-only',
          acceptLabel: 'OK',
        });
      }
    }

    const followClick = () => {
      if (oidcIsAuthenticated.value) {
        store.dispatch(ActionTypes.FollowCategory, {id: categoryId, isFollower: category.value.userContext.isFollower ? false : true});
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

    const tabItems = ref([
      {
        label: t('categoryDetails-activeRequirements'),
        to: `/projects/${projectId}/categories/${categoryId}`,
      },
      {
        label: t('categoryDetails-completedRequirements'),
        to: `/projects/${projectId}/categories/${categoryId}/done`,
      },
    ]);

    const confirmDelete = () => {
      confirm.require({
        header: t('deleteCategory'),
        message: t('deleteCompDesc'),
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

    const displayCategoryEditor = ref(false);
    const categoryEditorCanceled = () => {
      displayCategoryEditor.value = false;
    }
    const categoryEditorSaved = () => {
      displayCategoryEditor.value = false;
    }

    const moreMenu = ref(null);
    const toggleMoreMenu = (event) => {
      (moreMenu as any).value.toggle(event);
    };
    const moreItems = ref([
      {
        label: t('editCategory'),
        icon: 'pi pi-pencil',
        command: () => {
          displayCategoryEditor.value = true;
        }
      },
      {
        label: t('deleteCategory'),
        icon: 'pi pi-times',
        command: () => {
          confirmDelete();
        }
      },
    ]);

    const editorCanceled = () => {
      toggleAddRequirement();
    }

    const editorSaved = () => {
      toggleAddRequirement();
    }

    return {
      t,
      oidcIsAuthenticated,
      project,
      category,
      done,
      tabItems,
      moreMenu,
      toggleMoreMenu,
      moreItems,
      activeRequirements,
      realizedRequirements,
      forceUpdateRequirementsList,
      searchQuery,
      sortOptions,
      selectedSort,
      sortAscending,
      showAddRequirement,
      toggleAddRequirement,
      followClick,
      editorCanceled,
      editorSaved,
      displayCategoryEditor,
      categoryEditorCanceled,
      categoryEditorSaved,
    }
  }
})
</script>

<style scoped>
  #description {
    margin-bottom: 2rem;
  }

  #addRequirementPanel {
    margin-bottom: 1.5rem;
  }

  .requirementEditorContainer {
    display: flex;
    flex-flow: column;
    align-items: center;
    width: 100%;
  }

  .requirementEditor {
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

  .requirementsList {
    display: flex;
    flex-flow: column;
    align-items: center;
    width: 100%;
  }

  .requirementCard {
    width: 100%;
    max-width: 700px;
    margin: 10px;
  }
</style>
