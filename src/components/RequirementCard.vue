<template>
  <Card id="card">
    <template #title>
      <div>{{ name }}</div>
    </template>
    <template #content>
      <div>{{ description }}</div>
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
import { ActionTypes } from '../store/actions';
import CommentsList from './CommentsList.vue';

export default defineComponent({
  components: { CommentsList },
  name: 'RequirementCard',
  props: {
    id: { type: Number, required: true },
    name: { type: String, required: true },
    description: { type: String, required: true },
    upVotes: { type: Number, required: true },
    numberOfComments: { type: Number, required: true },
    userVoted: { type: String, required: true },
  },
  setup: (props) => {
    const { id, userVoted } = toRefs(props)
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

    return { voted, showComments, toggleComments, toggleVote }
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
    padding-bottom: 0;
  }

  .commentsList {
    padding-top: 1rem;
  }
</style>
