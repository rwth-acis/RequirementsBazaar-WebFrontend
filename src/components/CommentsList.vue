<template>
  <div>
    <div v-for="comment in comments" :key="comment.id">
      {{ comment.message }}
    </div>
    <div id="addComment">
      <InputText type="text" v-model="message" :placeholder="t('addComment')" class="input" ref="input"/>
      <Button label="Save" @click="createComment" />
    </div>
  </div>
</template>

<script lang="ts">
import { computed, ref, defineComponent, onMounted } from 'vue'
import { useStore } from 'vuex';
import { useI18n } from 'vue-i18n';
import { ActionTypes } from '../store/actions';
import { Comment } from '../types/api';

export default defineComponent({
  name: 'RequirementCard',
  props: {
    requirementId: { type: Number, required: true },
  },
  setup: ({ requirementId }) => {
    const store = useStore();
    const { t } = useI18n({ useScope: 'global' });

    const input = ref(null);

    onMounted(() => {
      (input as any).value.$el.focus();
    });

    const parameters = computed(() => {return {per_page: 150}});
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

    return { t, comments, message, createComment, input };
  }
})
</script>

<style scoped>
  #addComment {
    width: 100;
    display: flex;
    margin-top: 1em;
  }

  #addComment > .input {
    flex: 1;
    margin-right: 0.5em;
  }
</style>
