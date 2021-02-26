<template>
  <div>
    <div v-for="comment in comments" :key="comment.id">
      {{ comment.message }}
    </div>
  </div>
</template>

<script lang="ts">
import { computed, ref, defineComponent } from 'vue'
import { useStore } from 'vuex';
import { ActionTypes } from '../store/actions';

export default defineComponent({
  name: 'RequirementCard',
  props: {
    requirementId: { type: Number, required: true },
  },
  setup: ({ requirementId }) => {
    const store = useStore();

    const parameters = computed(() => {return {per_page: 20}});
    const comments = computed(() => store.getters.commentsList(requirementId, parameters.value));
    store.dispatch(ActionTypes.FetchCommentsOfRequirement, {requirementId, query: parameters.value})

    return { comments };
  }
})
</script>

<style scoped>
</style>
