<template>
  <Card>
    <template #title>
      <div>{{ name }}</div>
    </template>
    <template #content>
      <div>{{ description }}</div>
      <div id="actionButtons">
        <Button label="Vote"></Button>
        <Button :label="`${numberOfComments} Comments`"></Button>
        <Button label="Share"></Button>
      </div>
      <div v-for="comment in comments" :key="comment.id">
        {{ comment.message }}
      </div>
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
import { computed, ref, defineComponent } from 'vue'
import { useStore } from 'vuex';
import { ActionTypes } from '../store/actions';

export default defineComponent({
  name: 'RequirementCard',
  props: {
    id: { type: Number, required: true },
    name: { type: String, required: true },
    description: { type: String, required: true },
    numberOfComments: { type: Number, required: true },
  },
  setup: (props) => {
    const store = useStore();

    const requirementId = props.id;

    const parameters = computed(() => {return {per_page: 20}});
    const comments = computed(() => store.getters.commentsList(requirementId, parameters.value));
    store.dispatch(ActionTypes.FetchCommentsOfRequirement, {requirementId, query: parameters.value})

    return { comments }
  }
})
</script>

<style scoped>
  #actionButtons {
    width: 100%;
    display: flex;
    flex-direction: row;
  }

  button {
    display: flex;
    flex: 1;
    margin-left: .5rem;
  }

  #actionButtons :first-child {
    margin-left: 0;
  }
</style>
