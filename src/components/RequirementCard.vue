<template>
  <Card id="card">
    <template #title>
      <div>{{ name }}</div>
      <div class="lastupdate"><span :title="$dayjs(creationDate).format('LLL')">{{ $dayjs(creationDate).fromNow() }}</span> {{t('by')}} {{ creator?.userName }}</div>
    </template>
    <template #content>
      <div><vue3-markdown-it :source="description" /></div>
      <div id="figures">
        <div id="votes">{{ upVotes }} {{ t('votes') }}</div>
        <div id="followers">{{ numberOfFollowers }} {{ t('followers') }}</div>
        <div id="comments" @click="toggleCommentsPanel">{{ numberOfComments }} {{ t('comments')}}</div>
      </div>
      <div id="actionButtons">
        <div id="groupedButtons">
          <Button label="Vote" :class="{ 'p-button-outlined': !voted }" @click="toggleVote"></Button>
          <Button :label="t('addComment')" @click="toggleCommentsPanel" class="p-button-outlined"></Button>
          <Button label="Share" class="p-button-outlined"></Button>
        </div>
        <Button type="button" class="p-button-outlined" label="..." @click="toggleMenu" aria-haspopup="true" aria-controls="overlay_menu"/>
        <Menu id="overlay_menu" ref="menu" :model="menuItems" :popup="true" />
      </div>
      <comments-list :requirementId="id" v-if="showComments" class="commentsList"></comments-list>
    </template>
  </Card>
</template>

<script lang="ts">
import { computed, ref, toRefs, defineComponent, watch } from 'vue';
import { useStore } from 'vuex';
import { useI18n } from 'vue-i18n';
import { ActionTypes } from '../store/actions';
import { useConfirm } from "primevue/useconfirm";
import CommentsList from './CommentsList.vue';

export default defineComponent({
  components: { CommentsList },
  name: 'RequirementCard',
  props: {
    id: { type: Number, required: true },
    name: { type: String, required: true },
    creator: { type: Object, required: true },
    creationDate: { type: String, required: true },
    description: { type: String, required: true },
    upVotes: { type: Number, required: true },
    numberOfComments: { type: Number, required: true },
    numberOfFollowers: { type: Number, required: true },
    userVoted: { type: String, required: true },
    isFollower: { type: Boolean, required: true },
    isDeveloper: { type: Boolean, required: true },
    realized: { type: String, required: false },
  },
  setup: (props) => {
    const { id, userVoted, isFollower, isDeveloper, realized } = toRefs(props);
    const { locale, t } = useI18n({ useScope: 'global' });
    const store = useStore();
    const confirm = useConfirm();

    const showComments = ref(false);

    const toggleCommentsPanel = () => {
      showComments.value = !showComments.value;
    }

    const oidcIsAuthenticated = computed(() => store.getters['oidcStore/oidcIsAuthenticated']);
    const voted = computed(() => oidcIsAuthenticated.value && (userVoted.value === 'UP_VOTE'));

    const toggleVote = () => {
      const parameters = {
        requirementId: id.value,
        userVoted: userVoted.value === 'NO_VOTE' ? 'UP_VOTE' : 'NO_VOTE',
      };
      
      store.dispatch(ActionTypes.VoteRequirement, parameters);
    };

    const menu = ref(null);
    const toggleMenu = (event) => {
      (menu as any).value.toggle(event);
    }

    const confirmDelete = () => {
      confirm.require({
        header: t('deleteRequirement'),
        message: t('deleteRequirementDesc'),
        icon: 'pi pi-info-circle',
        acceptClass: 'p-button-danger',
        accept: () => {
          console.log(`deleted requirement ${id.value}`);
          // store.dispatch(ActionTypes.DeleteRequirement, id.value);
        },
        reject: () => {
          console.log('not deleted');
        }
      });
    }

    const menuItems = ref();
    // watch multiple props
    watch(
      [locale, isFollower, isDeveloper, realized],
      ([_, isFollower, isDeveloper, realized]) => {
        menuItems.value = [
          {
            label: t('editRequirement'),
            icon: 'pi pi-pencil',
            command: () => {
              debugger;
            }
          },
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

    return { voted, showComments, toggleCommentsPanel, toggleVote, t, toggleMenu, menu, menuItems };
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
    margin-right: .5rem;
    font-weight: bold;
  }

  .commentsList {
    padding-top: 1.5rem;
  }
</style>
