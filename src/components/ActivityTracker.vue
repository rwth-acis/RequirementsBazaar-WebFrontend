<template>
  <div class="activitiesList">
    <a v-for="activity in activities" :key="activity.id" class="activity" :href="getActivityTargetUrl(activity)" target="_blank" rel="noreferrer">
      <UserAvatar :imageUrl="activity.user.profileImage" :userName="activity.user.userName" class="profileImage" />

      <div class="activityBody p-ml-1">
        <div class="activityText">
          {{ activity.user.userName }}
          {{ actionWordings[activity.activityAction] }}
          {{ getTypeWording(activity) }}
        </div>
        <div class="activityDate p-mt-1">
          <span :title="$dayjs(activity.creationDate).format('LLL')">{{ $dayjs(activity.creationDate).fromNow() }}</span>
        </div>
      </div>
    </a>
    <div >

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
     * Returns an URL to the target entity of the specific activity (e.g., project, category, requirement)
     */
    const getActivityTargetUrl = (activity) => {
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
    };

    return { activities, actionWordings, getTypeWording, getActivityTargetUrl };
  },

})
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
    border-bottom: 1px solid lightgrey;
    align-content: flex-end;
    color: #495057; /* overrides color forced by <a> tag */
    padding: 5px 10px;
  }

  .activityBody {
    flex: 1;

  }

  .activityText {
    font-size: 0.95rem;
  }

  .activityDate {
    font-weight: normal;
    font-size: 0.75em;
    color: #5d5d5d;
    text-align: right;
    padding-right: 5px;
  }

  .profileImage {
    margin: auto 5px;
  }

  .activity ::v-deep(.p-avatar > img) {
    border-radius: 50%;
  }
</style>
