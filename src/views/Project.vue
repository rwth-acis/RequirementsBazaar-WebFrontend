<template>
  <h1>This is project {{ project?.name }}</h1>
  <div id="description">
    {{ project?.description }}
  </div>
  <div id="menuBar">
    <TabMenu id="tabMenu" :model="tabItems" />
    <div id="actionButtons">
      <Button :label="project?.isFollower ? t('unfollowProject') : t('followProject')" class="p-button-sm" :class="{ 'p-button-outlined': !project?.isFollower }" @click="followClick"></Button>
      <Button label="..." class="p-button-sm p-button-outlined" @click="toggleMoreMenu"></Button>
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
import { ActionTypes } from '../store/actions';

import FilterPanel from '../components/FilterPanel.vue';
import CategoryCard from '../components/CategoryCard.vue';

export default defineComponent({
  components: {
    FilterPanel,
    CategoryCard,
  },
  name: 'Project',
  props: {
  },
  setup: (props) => {
    const store = useStore();
    const route = useRoute();
    const { t } = useI18n({ useScope: 'global' });
    
    const projectId = Number.parseInt(route.params.projectId.toString(), 10);
    const project = computed(() => store.getters.getProjectById(projectId));
    store.dispatch(ActionTypes.FetchProject, projectId);

    const tabItems = ref([
      {
        label: 'Overview',
        to: `/projects/${projectId}`
      },
      {
        label: 'All Categories',
        to: `/projects/${projectId}/all`
      },
    ]);

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
    const sortDirection = computed(() => sortAscending.value ? 'ASC' : 'DESC');
    const parameters = computed(() => {return {page: page.value, per_page: perPage.value, sort: selectedSort.value, sortDirection: sortDirection.value, search: searchQuery.value}});
    const categories = computed(() => store.getters.categoriesList(projectId, parameters.value));
    store.dispatch(ActionTypes.FetchCategoriesOfProject, {projectId: projectId, query: parameters.value});
    watch(selectedSort, () => {
      sortAscending.value = selectedSort.value === 'name';
    });
    watch(parameters, () => store.dispatch(ActionTypes.FetchCategoriesOfProject, {projectId: projectId, query: parameters.value}));

    const followClick = () => {
      store.dispatch(ActionTypes.FollowProject, {id: projectId, isFollower: project.value.isFollower ? false : true});
    };

    const moreItems = ref([
      {
        label: t('editProject'),
        icon: 'pi pi-pencil',
        command: () => {
        }
      },
      {
        label: t('deleteProjectTitle'),
        icon: 'pi pi-times',
        command: () => {
        }
      },
    ]);

    const moreMenu = ref(null);
    const toggleMoreMenu = (event) => {
      (moreMenu as any).value.toggle(event);
    };

    return { t, tabItems, moreItems, moreMenu, toggleMoreMenu, project, followClick, categories, searchQuery, selectedSort, sortOptions, sortAscending }
  }
})
</script>

<style scoped>
  #description {
    margin-bottom: 2rem;
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
</style>
