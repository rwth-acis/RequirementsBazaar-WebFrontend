<template>
  <div class="activitiesList">
    <div v-for="activity in activities" :key="activity.id" class="activity" @click="onActivityClick(activity)">
      <UserAvatar :imageUrl="activity.user.profileImage" :userName="activity.user.userName" class="profileImage" />

      <div class="activityText">
        {{ activity.user.userName }}
        {{ actionWordings[activity.activityAction] }}
        {{ getTypeWording(activity) }}
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent } from 'vue';
import { useStore } from 'vuex';
import { ActionTypes } from '../store/actions';
import UserAvatar from './UserAvatar.vue';

export default defineComponent({
  components: { UserAvatar },
  name: 'ActivityTracker',
  props: {
  },
  setup: (props, context) => {
    const store = useStore();

    const parameters = computed(() => {return {limit: 10}});
    const activities = computed(() => store.getters.activitiesList(parameters.value));
    store.dispatch(ActionTypes.FetchActivities, {query: parameters.value});

    const actionWordings = {
      'CREATE': 'created',
      'UPDATE': 'updated',
      'DELETE': 'deleted',
      'REALIZE': 'realized',
      'VOTE': 'voted for',
      'UNVOTE': 'unvoted',
      'DEVELOP': 'started developing',
      'UNDEVELOP': 'stopped developing',
      'FOLLOW': 'followed',
      'UNFOLLOW': 'unfollowed',
      'LEADDEVELOP': 'became lead developer of',
      'UNLEADDEVELOP': 'no longer is lead developer of',
    };

    const getTypeWording = (activity) => {
      switch (activity.dataType) {
        case 'PROJECT':
          return `the project ${activity.data.name}.`;
        case 'CATEGORY':
          return `the category ${activity.data.name} in the project ${activity.parentData.name}.`;
        case 'REQUIREMENT':
          return `the requirement ${activity.data.name}.`;
        case 'COMMENT':
          return `a comment for the requirement ${activity.parentData.name}.`;
        case 'USER':
          return `a user account.`;
      }
    }

    /**
     * Handles a click on an activity item.
     *
     * This methd will open the target entity of the specific activity in a new tab (e.g., project, category, requirement)
     */
    const onActivityClick = (activity) => {
      const targetUrl = getActivityTargetUrl(activity);

      window.open(targetUrl);
    };

    return { activities, actionWordings, getTypeWording, onActivityClick };
  },

})

function getActivityTargetUrl(activity) {
  const entityUrl = activity.dataFrontendUrl;

  /*
  * We need some replacing here because old URLs in the activity database (end even new ones?)
  * have an outdated link format, like the following URL:
  *     https://beta.requirements-bazaar.org/projects/110/categories/317/requirements/843
  * while the new URLs we use for requirement links have the following format:
  *     https://beta.requirements-bazaar.org/projects/110/requirements/843
  */
  const oldRequirementLinksRegex = /\/categories\/(\S)+\/requirements\//gm;
  let targetUrl = entityUrl.replace(oldRequirementLinksRegex, '/requirements/');

  // replace the beat link with the more dynamic current origin URL (enables better debugging experience when localhost is used)
  targetUrl = targetUrl.replace('https://beta.requirements-bazaar.org', window.location.origin);

  return targetUrl;
}
</script>

<style scoped>
  .activitiesList {
    width: 100%;
    height: 100%;
    background-color: #f5f5f5;
    overflow-y: scroll;
  }

  .activity {
    display: flex;
    flex-direction: row;
    align-content: center;
    height: 60px;
    border-bottom: 1px solid lightgrey;
    align-content: flex-end;
  }

  .activityText {
    flex: 1;
    font-size: 0.95rem;
    margin: auto 0.2rem;
  }

  .profileImage {
    margin: auto 5px;
  }

  .activity ::v-deep(.p-avatar > img) {
    border-radius: 50%;
  }
</style>
