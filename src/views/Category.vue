<template>
  <ScrollTop />
  <ProjectBreadcrumbNav v-if="category && project"
    :projectId="category.projectId"
    :projectName="project.name"
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
            :lastActivityUser="requirement.lastActivityUser"
            :userVoted="requirement.userContext.userVoted"
            :isFollower="requirement.userContext.isFollower ? true : false"
            :isDeveloper="requirement.userContext.isDeveloper ? true : false"
            :realized="requirement.realized"
            :additionalProperties="requirement.additionalProperties"
            :userContext="requirement.userContext ?? {}">
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
            :lastActivityUser="requirement.lastActivityUser"
            :userVoted="requirement.userContext.userVoted"
            :isFollower="requirement.userContext.isFollower ? true : false"
            :isDeveloper="requirement.userContext.isDeveloper ? true : false"
            :realized="requirement.realized"
            :additionalProperties="requirement.additionalProperties"
            :userContext="requirement.userContext ?? {}">
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

import * as pdfMake from "pdfmake/build/pdfmake";
import * as pdfFonts from 'pdfmake/build/vfs_fonts';
(<any>pdfMake).vfs = pdfFonts.pdfMake.vfs;

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
      {
        label: t('exportRequirementsActive'),
        icon: 'pi pi-file-pdf',
        command: () => {
          exportRequirementsPdf(false, false);
        }
      },
      {
        label: t('exportRequirementsCompleted'),
        icon: 'pi pi-file-pdf',
        command: () => {
          exportRequirementsPdf(true, false);
        }
      },
      {
        label: t('exportRequirementsAll'),
        icon: 'pi pi-file-pdf',
        command: () => {
          exportRequirementsPdf(false, true);
        }
      },
      {
        label: t('exportRequirementsActive'),
        icon: 'pi pi-file-o',
        command: () => {
          exportRequirementsTex(false, false);
        }
      },
      {
        label: t('exportRequirementsCompleted'),
        icon: 'pi pi-file-o',
        command: () => {
          exportRequirementsTex(true, false);
        }
      },
      {
        label: t('exportRequirementsAll'),
        icon: 'pi pi-file-o',
        command: () => {
          exportRequirementsTex(false, true);
        }
      },
    ]);

  const exportRequirementsTex=(isCompleted:boolean, all:boolean) => {
    console.log('Export TeX started...');
    if(all){
      var label = 'tab:reqs_'+category.value.id;
      var key = 'headerExportCatAll';
      var fileName = "requirements"+"_"+categoryId+".tex";
      var reqList = realizedRequirements.value.concat(activeRequirements.value);
    } else {
      if(isCompleted){
        var label = 'tab:reqs_completed_'+category.value.id;
        var key = 'headerExportCatComplete';
        var fileName = "completed_requirements"+"_"+categoryId+".tex";
        var reqList = realizedRequirements.value;
      } else {
        var label = 'tab:reqs_active_'+category.value.id;
        var key = 'headerExportCatActive';
        var fileName = "active_requirements"+"_"+categoryId+".tex";
        var reqList = activeRequirements.value;
      }
    }
    // strings for the latex table format
    const setupTable =
    `% It is necessary to add xcolor, colortbl and array to your Preamble!
    \\newcolumntype{L}[1]{>{\\raggedright\\let\\newline\\\\\\arraybackslash\\hspace{0pt}}m{#1}}
    \\begin{table}[h]
        \\label{`+label+`} %Label for referencing
        \\begin{tabular}{!{\\color{black}\\vrule}L{0.25\\textwidth}!{\\color{gray}\\vrule}L{0.65\\textwidth}!{\\color{black}\\vrule}} %Change numbers to scale width of columns
          \\hline
          \\textbf{Title} & \\textbf{Description}\\\\
          \\hline\n`

    const endOfTable =
    `       \\end{tabular}
      \\caption{`+t(key)+" "+category.value.name+`} %Caption of the table
    \\end{table}`;

    // body of the latex table
    var body = '';
    var hlineGray = '\n\t\t\t\t\t\\arrayrulecolor{gray}\\hline\n';
    var hlineBlack = '\n\t\t\t\t\t\\arrayrulecolor{black}\\hline\n';
    for (let i = 0; i < reqList.length; i++) {
      let name = reqList[i].name.split('\\\\').join('\\textbackslash');
      let description = reqList[i].description.split('\\\\').join('\\textbackslash');
      body += '\t\t\t\t\t'+ name + '&' + description +'\\\\';
      if (i == reqList.length-1){
        body += hlineBlack;
      } else {
        body += hlineGray;
      }
    }
    let texString = setupTable+body+endOfTable;
    downloadTex(texString, fileName);
    console.log('Export TeX finished');
  }

  function downloadTex(texString: string, fileName: string){
    let content = new Blob([texString],{type: 'text/plain'});
    let saveFile = new File([content], fileName);

    const objUrl = URL.createObjectURL(saveFile);
    const atag = document.createElement('a');

    atag.setAttribute('href', objUrl);
    atag.setAttribute('download', fileName);
    atag.click()
  }

  const exportRequirementsPdf=(isCompleted:boolean, all:boolean) => {
  console.log('Export PDF started...');
  var bod = [[ { text: t('formTitle'), bold: true}, { text: t('formDesc'), bold: true }]];
  if(all){
      var header ={text:t('headerExportCatAll')+" "+category.value.name+":\n\n", style: 'header'};
      var fileName = "requirements"+"_"+categoryId+".pdf";
      var reqList = realizedRequirements.value.concat(activeRequirements.value);
  } else {
    if(isCompleted){
      var header ={text:t('headerExportCatComplete')+" "+category.value.name+":\n\n", style: 'header'};
      var fileName = "completed_requirements"+"_"+categoryId+".pdf";
      var reqList = realizedRequirements.value;
    } else {
      var header ={text:t('headerExportCatActive')+" "+category.value.name+":\n\n", style: 'header'};
      var fileName = "active_requirements"+"_"+categoryId+".pdf";
      var reqList = activeRequirements.value;
    }
  }
  for (let i = 0; i < reqList.length; i++) {
      bod.push([ { text:reqList[i].name.split('\\\\').join('\\'), bold: false},
      { text: reqList[i].description.split('\\\\').join('\\'), bold: false }]);
    }
  var docDefinition = {
    content: [
      header,
      {
        layout: {
          hLineColor: function (i, node) {
            return (i === 0 || i === node.table.body.length || i==1) ? 'black' : 'gray';
          },
          vLineColor: function (i, node) {
            return (i === 0 || i === node.table.widths.length) ? 'black' : 'gray';
          }
        },
        table: {
          headerRows: 1,
          widths: [ 100, '*'],
          body: bod
        }
      }
    ],
    styles: {
      header: {
        fontSize: 15,
        bold: true
      }
  }
};
  pdfMake.createPdf(docDefinition).download(fileName);
  console.log('Export PDF finished');
};

    const editorCanceled = () => {
      toggleAddRequirement();
    }

    const editorSaved = () => {
      forceUpdateRequirementsList();
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
