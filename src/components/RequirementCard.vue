<template>
  <Card id="card">
    <template #title>
      <div>{{ name }}
        <Button icon="pi pi-link" label="See this Requirement on GitHub" class="p-button-outlined" @click="checkRequirementOnGitHub" v-if="showButtonGitHub()"></Button>
      </div>
      <div class="lastupdate">
        <span :title="$dayjs(creationDate).format('LLL')">{{ $dayjs(creationDate).fromNow() }}</span>
        {{t('by')}} {{ creator?.userName }}
        <!--<i class="pi pi-pencil" style="fontSize: 0.7rem" v-if="creationDate !== lastActivity" :title="`initially created on ${$dayjs(lastActivity).format('LLL')}`"></i>-->      
      </div>   
    </template> 

    <template #content>
    <vue3-markdown-it :source="description" class="p-mt-3 p-mb-3" />
    <!-- Timeline -->
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
        <div id="comments" @click="toggleCommentsPanel">{{ numberOfComments }} {{ t('comments')}}</div>
      </div>
      <div id="actionButtons">
        <div id="groupedButtons">
          <Button label="Vote" :class="{ 'p-button-outlined': !voted }" @click="toggleVote"></Button>
          <Button :label="t('addComment')" @click="toggleCommentsPanel" class="p-button-outlined"></Button>
          <Button label="Share" class="p-button-outlined" @click="toggleShareMenu"></Button>        
          <Menu ref="shareMenu" :model="shareMenuItems" :popup="true" />
        </div>
        <Button v-if="oidcIsAuthenticated" type="button" class="p-button-outlined moreButton" label="..." @click="toggleMenu" aria-haspopup="true" aria-controls="overlay_menu"/>
        <Menu ref="menu" :model="menuItems" :popup="true" />
      </div>
      <comments-list :requirementId="id" v-if="showComments" class="commentsList"></comments-list>
    </template>
  </Card>
</template>

<script lang="ts">
import { computed, ref, toRefs, defineComponent, watch, PropType } from 'vue';
import { useStore } from 'vuex';
import { useI18n } from 'vue-i18n';
import { ActionTypes } from '../store/actions';
import { useConfirm } from "primevue/useconfirm";
import CommentsList from './CommentsList.vue';
import { useRoute } from 'vue-router';

import RequirementEditor from '../components/RequirementEditor.vue';
import { getEnabledCategories } from 'trace_events';

export default defineComponent({
  components: { CommentsList, RequirementEditor },
  name: 'RequirementCard',
  props: {
    id: { type: Number, required: true },
    projectId: { type: Number, required: true },
    categories: { type: Array as PropType<Array<number>>, required: true },
    name: { type: String, required: true },
    creator: { type: Object, required: true },
    creationDate: { type: String, required: true },
    lastActivity: { type: String, required: true },
    description: { type: String, required: true },
    upVotes: { type: Number, required: true },
    numberOfComments: { type: Number, required: true },
    numberOfFollowers: { type: Number, required: true },
    userVoted: { type: String, required: true },
    isFollower: { type: Boolean, required: true },
    isDeveloper: { type: Boolean, required: true },
    realized: { type: String, required: false },
    additionalProperties: {type: Object, required: false},
  },
  setup: (props) => {
    const { id,projectId, userVoted, isFollower, isDeveloper, realized, lastActivity, creationDate, name, description, categories, additionalProperties } = toRefs(props);
    const { locale, t } = useI18n({ useScope: 'global' });
    const store = useStore();
    const confirm = useConfirm();
    const route = useRoute();

    const showComments = ref(false);

    const toggleCommentsPanel = () => {
      showComments.value = !showComments.value;
    }

    const oidcIsAuthenticated = computed(() => store.getters['oidcStore/oidcIsAuthenticated']);
    const voted = computed(() => oidcIsAuthenticated.value && (userVoted.value === 'UP_VOTE'));

    const activityDate = computed(() => lastActivity.value || creationDate.value);

    const project = computed(() => store.getters.getProjectById(projectId.value));
    store.dispatch(ActionTypes.FetchProject, projectId.value);

    //get github_url from project's additionalProperties
    const github_url = computed(() => {
      if (project.value && project.value.additionalProperties && project.value.additionalProperties.github_url ) {
        return project.value.additionalProperties.github_url
      }
    });

    // get issue's additionalProperties Descriptors & Values
    const additionalPropertiesValue = additionalProperties.value;

    if(additionalPropertiesValue === undefined){
      var issueNumberValue = undefined;
      var issueStatusValue = undefined;
      var issueUrlValue = undefined;

    }else{
          const issueNumberDescriptor = Object.getOwnPropertyDescriptor(additionalProperties.value, 'issue_number');
          issueNumberValue = issueNumberDescriptor?.value;
          const issueStatusDescriptor = Object.getOwnPropertyDescriptor(additionalProperties.value, 'issue_status');
          issueStatusValue = issueStatusDescriptor?.value;
          const issueUrlDescriptor = Object.getOwnPropertyDescriptor(additionalProperties.value, 'issue_url');
          issueUrlValue = issueUrlDescriptor?.value;
    }

    // **** Functions to update the timeline icons *****
    // Requirement exported
    function timelineIssueNumber(){
      let timelineIssueNumberIcon = "pi pi-circle-off";
      if(issueNumberValue !== undefined){
        timelineIssueNumberIcon = "pi pi-check-circle";
      }
      return timelineIssueNumberIcon;
    };
    // Requirement opened or closed 
    function timelineIssueStatus(){
      let timelineIssueStatusIcon = "pi pi-circle-off";
      if(issueStatusValue !== undefined){
        (issueStatusValue == "closed") 
          ? timelineIssueStatusIcon = 'pi pi-check-circle' 
          : (issueStatusValue == "opened")
            ? timelineIssueStatusIcon = 'pi pi-circle-off'   
            : null;    
      }
      return timelineIssueStatusIcon;
    };
    // Requirement Url (Development in Progress)
    function timelineIssueUrl(){
      let timelineIssueUrlIcon = "pi pi-circle-off";
      if(issueUrlValue != undefined){
        timelineIssueUrlIcon = "pi pi-check-circle";
      }
      return timelineIssueUrlIcon;
    };

    //Timeline events
    const timelineEvents = ref([
      {label: 'Requirement Exported',    status: timelineIssueNumber()},
      {label: 'Development in Progress', status: timelineIssueUrl()},
      {label: 'Closed',                  status: timelineIssueStatus()},   
      ]); 

    // show button "check it on github"
    function showButtonGitHub(){
      let buttonCheckOnGitHub = false;
      if(issueUrlValue != undefined) 
        buttonCheckOnGitHub = true;
      return buttonCheckOnGitHub;
    }

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

    const alertShareGitHub = (message: string) => {
      confirm.require({
          group: 'dialog',
          message: message,
          header: 'Ops',
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
        alertLogin('You need to sign in to vote for a requirement.');
      }
    };

    // Redirect to github "see requirement btn"
    const checkRequirementOnGitHub = () => {
      confirm.require({
        header: 'See this requirement on GitHub',
        message: 'You will be redirected to GitHub',
        icon: 'pi pi-external-link',
        group: 'dialog',
            accept: () => {
            window.open(issueUrlValue);
            },
            reject: () => {
            console.log('not redirected');
            } 
      })
    }; 

    const menu = ref(null);
    const toggleMenu = (event) => {
      (menu as any).value.toggle(event);
    };

    const confirmDelete = () => {
      confirm.require({
        header: t('deleteRequirement'),
        message: t('deleteRequirementDesc'),
        icon: 'pi pi-info-circle',
        acceptClass: 'p-button-danger',
        group: 'dialog',
        accept: () => {
          store.dispatch(ActionTypes.DeleteRequirement, id.value);
        },
        reject: () => {
          console.log('not deleted');
        }
      });
    }

    const displayRequirementEditor = ref(false);
    const requirementEditorCanceled = () => {
      displayRequirementEditor.value = false;
    }
    const requirementEditorSaved = () => {
      displayRequirementEditor.value = false;
    }

    const menuItems = ref();
    // watch multiple props
    watch(
      [locale, isFollower, isDeveloper, realized],
      ([_, isFollower, isDeveloper, realized]) => {
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
            label: t('deleteRequirement'),
            icon: 'pi pi-times',
            command: () => {
              confirmDelete();
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
        command: () => {
          console.log('Sharing to Facebook...');
        },
      },
      {
        label: 'GitHub',
        icon: 'pi pi-github',
        command: () => {
          const githubBaseUrl = project.value.additionalProperties.github_url;
          const requirementTitle = name.value.replace(/\s/g, '+');
          const requirementDescription = description.value.replace(/\s/g, '+');
          const requirementProject = projectId.value;
          const requirementId = id.value;
          const requirementCategory = categories.value[0];
          const bazaarBaseUrl = "https://requirements-bazaar.org";
          const bazaarRequirementUrl = bazaarBaseUrl+"/projects/"+requirementProject+"/categories/"+requirementCategory+"/requirements/"+requirementId; 
          if(additionalPropertiesValue == undefined){
            confirm.require({
              header: 'Share to GitHub',
              message: 'You will be redirected to GitHub',
              icon: 'pi pi-external-link',
              group: 'dialog',
                accept: () => {
            window.open(githubBaseUrl+"/issues/new?"+"title="+requirementTitle+"&body="+requirementDescription+" -> _**See+requirement+in+Bazaar:**_ "+bazaarRequirementUrl);
            },
                reject: () => {
            console.log('not redirected');
            }
          });
          }else{
            alertShareGitHub('This Requirement is already on GitHub.')
          }
        },
      },
      {
        label: 'Twitter',
        icon: 'pi pi-twitter',
        command: () => {
          console.log('Sharing to Twitter...');
        },
      },
      {
        label: 'Copy to clipboard',
        icon: 'pi pi-copy',
        command: () => {
          console.log('Copying to clipboard...');
          navigator.clipboard.writeText('');
        },
      },
    ]);

    return {
      voted,
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
      timelineEvents,
      checkRequirementOnGitHub,
      showButtonGitHub,
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
</style>
