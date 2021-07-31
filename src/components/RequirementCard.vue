<template>
  <Card id="card">
    <template #title>
      <div>{{ name }}</div>
      <div class="lastupdate">
        <span :title="$dayjs(activityDate).format('LLL')">{{ $dayjs(activityDate).fromNow() }}</span>
        {{t('by')}} {{ creator?.userName }}
        <!--<i class="pi pi-pencil" style="fontSize: 0.7rem" v-if="creationDate !== lastActivity" :title="`initially created on ${$dayjs(lastActivity).format('LLL')}`"></i>-->
      </div>
    </template>
    <template #content>
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
      <vue3-markdown-it :source="description" class="p-mt-3 p-mb-3" />
      <div id="figures">
        <div id="votes">{{ upVotes }} {{ t('votes') }}</div>
        <div id="followers">{{ numberOfFollowers }} {{ t('followers') }}</div>
        <div id="comments" @click="toggleCommentsPanel">{{ numberOfComments }} {{ t('comments')}}</div>
      </div>
      <div id="actionButtons" v-if="!brief">
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

import RequirementEditor from '../components/RequirementEditor.vue';

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
    brief: { type: Boolean, required: false, default: false },
  },
  setup: (props) => {
    const { id, userVoted, isFollower, isDeveloper, realized, lastActivity, creationDate } = toRefs(props);
    const { locale, t } = useI18n({ useScope: 'global' });
    const store = useStore();
    const confirm = useConfirm();

    const showComments = ref(false);

    const toggleCommentsPanel = () => {
      showComments.value = !showComments.value;
    }

    const oidcIsAuthenticated = computed(() => store.getters['oidcStore/oidcIsAuthenticated']);
    const voted = computed(() => oidcIsAuthenticated.value && (userVoted.value === 'UP_VOTE'));

    const activityDate = computed(() => lastActivity.value || creationDate.value);

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
        alertLogin('You need to sign in to vote for a requirement.');
      }
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
          console.log('Sharing to GitHub...');
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
      activityDate,
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
    };
  },
})
</script>

<style scoped>
  #card ::v-deep(.p-card-content) {
    padding: 0;
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
</style>
