<template>
  <ScrollTop />
  <h1>{{ category?.name }}</h1>
  <div id="description">
    {{ category?.description }}
  </div>
  <div id="addRequirementPanel">
    <Button label="Add new Requirement..." @click="toggleAddRequirement" />
    <div class="requirementEditorContainer">
      <RequirementEditor class="requirementEditor" v-if="showAddRequirement" :projectId="category?.projectId" :categoryId="category?.id"></RequirementEditor>
    </div>
  </div>
  <div id="menuBar">
    <TabMenu id="tabMenu" :model="tabItems" />
    <div id="actionButtons">
      <Button icon="pi pi-bell" :label="category?.userContext?.isFollower ? t('unfollowCategory') : t('followCategory')" class="p-button-sm" :class="{ 'p-button-outlined': !category?.userContext?.isFollower }" @click="followClick"></Button>
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
    <div id="requirementsList">
      <ConfirmDialog></ConfirmDialog>
      <div v-for="requirement in requirements" :key="requirement.id" class="requirementCard">
        <RequirementCard
          :id="requirement.id"
          :name="requirement.name"
          :description="requirement.description"
          :upVotes="requirement.upVotes"
          :numberOfComments="requirement.numberOfComments"
          :numberOfFollowers="requirement.numberOfFollowers"
          :creator="requirement.creator"
          :creationDate="requirement.creationDate"
          :userVoted="requirement.userContext.userVoted"
          :isFollower="requirement.userContext.isFollower"
          :isDeveloper="requirement.userContext.isDeveloper"
          :realized="requirement.realized">
        </RequirementCard>
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
import RequirementEditor from '../components/RequirementEditor.vue';

export default defineComponent({
  name: 'Category',
  components: { FilterPanel, RequirementCard, RequirementEditor },
  props: {
  },
  setup: (props) => {
    const store = useStore();
    const route = useRoute();
    const { t } = useI18n({ useScope: 'global' });
    const confirm = useConfirm();
    
    const categoryId = Number.parseInt(route.params.categoryId.toString(), 10);
    const category = computed(() => store.getters.getCategoryById(categoryId));
    store.dispatch(ActionTypes.FetchCategory, categoryId);

    const searchQuery = ref('');
    const selectedSort = ref('date');
    const sortOptions = [
      {name: 'Alphabetically', value: 'name'},
      {name: 'Last Activity', value: 'last_activity'},
      {name: 'Creation Date', value: 'date'},
      {name: 'Number of Comments', value: 'comment'},
      {name: 'Number of Followers', value: 'follower'},
      {name: 'Number of Votes', value: 'vote'},
    ];
    const sortAscending = ref(false);
    const page = ref(0);
    const perPage = ref(20);
    const sortDirection = computed(() => sortAscending.value ? 'ASC' : 'DESC');
    const parameters = computed(() => {return {page: page.value, per_page: perPage.value, sort: selectedSort.value, sortDirection: sortDirection.value, search: searchQuery.value}});
    const requirements = computed(() => store.getters.requirementsList(categoryId, parameters.value));
    store.dispatch(ActionTypes.FetchRequirementsOfCategory, {categoryId: categoryId, query: parameters.value});
    watch(selectedSort, () => {
      sortAscending.value = selectedSort.value === 'name';
    });
    watch(parameters, () => store.dispatch(ActionTypes.FetchRequirementsOfCategory, {categoryId: categoryId, query: parameters.value}));

    const showAddRequirement = ref(false);
    const toggleAddRequirement = () => {
      showAddRequirement.value = !showAddRequirement.value;
    }

    const followClick = () => {
      store.dispatch(ActionTypes.FollowCategory, {id: categoryId, isFollower: category.value.userContext.isFollower ? false : true});
    };

    const tabItems = ref([
      {
        label: 'Active Requirements',
        to: `/projects/`,
      },
      {
        label: 'Completed Requirements',
        to: `/projects/`,
      },
    ]);

    const confirmDelete = () => {
      confirm.require({
        header: t('deleteCategory'),
        message: t('deleteCompDesc'),
        icon: 'pi pi-info-circle',
        acceptClass: 'p-button-danger',
        accept: () => {
          console.log('deleted');
        },
        reject: () => {
          console.log('not deleted');
        }
      });
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
          console.log('edit category');
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

    return { t, category, tabItems, moreMenu, toggleMoreMenu, moreItems, requirements, searchQuery, sortOptions, selectedSort, sortAscending, showAddRequirement, toggleAddRequirement, followClick }
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

  #requirementsList {
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
