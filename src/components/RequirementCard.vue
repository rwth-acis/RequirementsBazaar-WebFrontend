<template>
  <Card id="card">
    <template #title>
      <div>{{ name }}</div>
      <div class="lastupdate"><span :title="$dayjs(creationDate).format('LLL')">{{ $dayjs(creationDate).fromNow() }}</span> {{t('by')}} {{ creator?.userName }}</div>
    </template>
    <template #content>
      <div><vue3-markdown-it :source="description" /></div>
      <div id="actionButtons">
        <Button :label="`${upVotes} Votes`" :class="{ 'p-button-outlined': !voted }" @click="toggleVote"></Button>
        <Button :label="`${numberOfComments} Comments`" @click="toggleComments" class="p-button-outlined"></Button>
        <Button label="Share" class="p-button-outlined"></Button>
      </div>
      <comments-list :requirementId="id" v-if="showComments" class="commentsList"></comments-list>
    </template>
    <!--<template #footer>
      <div id="actionButtons">
        <Button label="Vote"></Button>
        <Button :label="`${numberOfComments} Comments`"></Button>
        <Button label="Share"></Button>
      </div>
    </template>-->
  </Card>
</template>

<script lang="ts">
import { computed, ref, toRefs, defineComponent } from 'vue';
import { useStore, mapGetters } from 'vuex';
import { useI18n } from 'vue-i18n';
import { ActionTypes } from '../store/actions';
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
    userVoted: { type: String, required: true },
  },
  setup: (props) => {
    const { id, userVoted } = toRefs(props);
    const { t } = useI18n({ useScope: 'global' });
    const store = useStore();
    const showComments = ref(false);

    const toggleComments = () => {
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

    return { voted, showComments, toggleComments, toggleVote, t };
  },
})
</script>

<style scoped>
  #actionButtons {
    width: 100%;
    display: flex;
    flex-direction: row;
    padding-top: 1rem;
  }

  #actionButtons > * {
    display: flex;
    flex: 1;
    margin-left: .5rem;
  }

  #actionButtons :first-child {
    margin-left: 0;
  }

  #card ::v-deep(.p-card-content) {
    padding: 0;
  }

  .lastupdate {
    padding-top: 0.25em;
    font-weight: normal;
    font-size: 0.6em;
    color: #5d5d5d;
  }

  .commentsList {
    padding-top: 1rem;
  }
</style>
