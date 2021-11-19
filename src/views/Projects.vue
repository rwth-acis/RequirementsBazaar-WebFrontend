<template>
  <h1>{{ t('explore-projects') }}</h1>
  Take a look at the public projects on Requirements Bazaar.
  <div id="addProjectPanel">
    <Button
      label="Add new Project..."
      v-if="!showAddProject"
      @click="toggleAddProject" />
    <div class="projectEditorContainer">
      <ProjectEditor
        class="projectEditor"
        v-if="showAddProject"
        @cancel="editorCanceled"
        @save="editorSaved">
      </ProjectEditor>
    </div>
  </div>
  <h2>Featured Projects</h2>

  Contact us to get featured!
  <h2>All Projects</h2>
  <FilterPanel
    v-model:searchQuery="searchQuery"
    :sortOptions="sortOptions"
    v-model:selectedSort="selectedSort"
    v-model:sortAscending="sortAscending">
  </FilterPanel>
  <masonry-layout maxcolwidth="400" gap="15" cols="auto">
    <div v-for="project in projects" :key="project.id">
      <router-link :to="'/projects/' + project.id">
        <ProjectCard
          :id="project.id"
          :name="project.name"
          :description="project.description"
          :creationDate="project.creationDate"
          :lastActivity="project.lastActivity"
          :numberOfCategories="project.numberOfCategories"
          :numberOfFollowers="project.numberOfFollowers"
          :numberOfRequirements="project.numberOfRequirements">
        </ProjectCard>
      </router-link>
    </div>
  </masonry-layout>
  <div id="sentinel"></div>
</template>

<script lang="ts">
import { computed, ref, watch, defineComponent, onMounted } from 'vue';
import { useI18n } from 'vue-i18n';
import { useStore } from 'vuex';
import { useConfirm } from "primevue/useconfirm";
import { ActionTypes } from '../store/actions';

import '@appnest/masonry-layout';
import FilterPanel from '../components/FilterPanel.vue';
import ProjectCard from '../components/ProjectCard.vue';
import ProjectEditor from '../components/ProjectEditor.vue';

export default defineComponent({
  name: 'Projects',
  components: { FilterPanel, ProjectCard, ProjectEditor },
  props: {
  },
  setup: () => {
    const store = useStore();
    const { t } = useI18n({ useScope: 'global' });
    const confirm = useConfirm();
    const oidcIsAuthenticated = computed(() => store.getters['oidcStore/oidcIsAuthenticated']);

    const searchQuery = ref('');
    const selectedSort = ref('name');
    const sortOptions = [
      {name: 'Alphabetically', value: 'name'},
      {name: 'Last Activity', value: 'last_activity'},
      {name: 'Creation Date', value: 'date'},
      {name: 'Number of Requirements', value: 'requirement'},
      {name: 'Number of Followers', value: 'follower'},
    ];
    const sortAscending = ref(true);
    const page = ref(0);
    const perPage = ref(20);

    let firstLoadComplete = false;
    onMounted(() => {
      const sentinel = document.getElementById('sentinel');
      if (sentinel) {
        const observer = new IntersectionObserver((intersections) => {
          const intersection = intersections[0];
          //const isSentinelVisible = intersection.isIntersecting;
          if (firstLoadComplete && intersection.isIntersecting) {
            page.value += 1;

            // trigger a fetch of the next page
            store.dispatch(ActionTypes.FetchProjects, {query: parameters.value});
          } else {
            firstLoadComplete = true;
          }
        }, {
          rootMargin: '0px 0px 400px 0px',
        })
        observer.observe(sentinel);
      }
    });

    const sortDirection = computed(() => sortAscending.value ? 'ASC' : 'DESC');
    const parameters = computed(() => {return {page: page.value, per_page: perPage.value, sort: selectedSort.value, sortDirection: sortDirection.value, search: searchQuery.value}});
    const projects = computed(() => store.getters.projectsList(parameters.value));
    store.dispatch(ActionTypes.FetchProjects, {query: parameters.value});
    watch(selectedSort, () => {
      //sortAscending.value = !['last_activity', 'date', 'requirement', 'follower'].includes(selectedSort.value);
      sortAscending.value = selectedSort.value === 'name';
    });

    // watch sort params and trigger a 'FetchProjects' action if changed
    const sortParams = computed(() => {return {sort: selectedSort.value, sortDirection: sortDirection.value}});
    watch(sortParams, () => store.dispatch(ActionTypes.FetchProjects, {query: parameters.value}));

    // use the ActionTypes.SearchProject for search if searchQuery modified
    // Reset page when searchQuery is modified so we get the expected results.
    // In case there are many matching result page will be increased while the user scrolls as usual.
    watch(searchQuery, () => {
      page.value = 0;

      store.dispatch(ActionTypes.SearchProjects, {query: parameters.value});
    });

    const showAddProject = ref(false);
    const toggleAddProject = () => {
      if (oidcIsAuthenticated.value) {
        showAddProject.value = !showAddProject.value;
      } else {
        confirm.require({
          group: 'dialog',
          message: 'You need to sign in to create a project.',
          header: 'Login',
          icon: 'pi pi-info-circle',
          rejectClass: 'p-sr-only',
          acceptLabel: 'OK',
        });
      }
    }

    const editorCanceled = () => {
      toggleAddProject();
    }

    const editorSaved = () => {
      toggleAddProject();
    }

    return {
      t,
      showAddProject,
      toggleAddProject,
      editorCanceled,
      editorSaved,
      projects,
      searchQuery,
      selectedSort,
      sortOptions,
      sortAscending,
    };
  }
})
</script>

<style scoped>
  #addProjectPanel {
    margin: 1.5rem 0;
  }

  .projectEditorContainer {
    display: flex;
    flex-flow: column;
    align-items: center;
    width: 100%;
  }

  .projectEditor {
    width: 100%;
    max-width: 700px;
  }
</style>
