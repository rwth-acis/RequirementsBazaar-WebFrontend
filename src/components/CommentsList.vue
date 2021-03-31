<template>
  <div>
    <div v-for="comment in comments" :key="comment.id">
      {{ comment.message }}
    </div>
    <InputText type="text" v-model="message" />
    <Button label="Save" @click="createComment" />
  </div>
</template>

<script lang="ts">
import { computed, ref, defineComponent } from 'vue'
import { useStore } from 'vuex';
import { ActionTypes } from '../store/actions';
import { Comment } from '../types/api';

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

    const message = ref('');
    const createComment = () => {
      const comment: Comment = {
        message: message.value,
        requirementId,
      };
      
      store.dispatch(ActionTypes.CreateComment, comment);
    };

    return { comments, message, createComment };
  }
})
</script>

<style scoped>
</style>
