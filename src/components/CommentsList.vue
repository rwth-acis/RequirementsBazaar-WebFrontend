<template>
  <div>
    <ConfirmPopup></ConfirmPopup>
    <div>
      <div v-for="comment in comments" :key="comment.id" class="comment p-mb-3">
        <div class="p-d-flex p-mb-1" :class="{ reply: comment.replyToComment }">
            <Skeleton shape="circle" size="2.5rem" class="p-mr-2"></Skeleton>
            <div>
                <div>{{ comment.message }}</div>
                <div class="info">
                  <span v-if="oidcIsAuthenticated">
                    <span class="action" @click="toggleReply($event, comment)">Reply</span> ·
                    <span v-if="oidcUser.preferred_username === comment.creator.userName"><span class="action" @click="deleteComment($event, comment.id)">Delete</span> · </span>
                  </span>
                  <span :title="$dayjs(comment.creationDate).format('LLL')">{{ $dayjs(comment.creationDate).fromNow() }}</span>{{ t('by') }}{{ comment.creator.userName }}
                </div>
            </div>
        </div>
        <div class="p-pb-1 addComment reply" v-if="comment.showReplyTo">
          <InputText type="text" :placeholder="t('addComment')" class="input"/>
          <Button label="Save" @click="createComment($event, comment.id)" />
        </div>
      </div>
    </div>
    <div class="addComment">
      <InputText type="text" v-model="message" :placeholder="t('addComment')" class="input" ref="input"/>
      <Button label="Save" @click="createComment" />
    </div>
  </div>
</template>

<script lang="ts">
import { computed, ref, defineComponent, onMounted, getCurrentInstance } from 'vue'
import { useStore } from 'vuex';
import { useI18n } from 'vue-i18n';
import { ActionTypes } from '../store/actions';
import { MutationType } from '../store/mutations';
import { Comment } from '../types/api';
import { LocalComment } from '../store/state';

export default defineComponent({
  name: 'RequirementCard',
  props: {
    requirementId: { type: Number, required: true },
  },
  setup: ({ requirementId }) => {
    const app = getCurrentInstance();
    const store = useStore();
    const { t } = useI18n({ useScope: 'global' });
    const oidcIsAuthenticated = computed(() => store.getters['oidcStore/oidcIsAuthenticated']);
    const oidcUser = computed(() => store.getters['oidcStore/oidcUser']);

    const input = ref(null);

    onMounted(() => {
      //(input as any).value.$el.focus();
    });

    const selectInput = () => {
      (input as any).value.$el.focus();
    };

    const parameters = computed(() => {return {per_page: 150}});
    const comments = computed(() => store.getters.commentsList(requirementId, parameters.value));
    store.dispatch(ActionTypes.FetchCommentsOfRequirement, {requirementId, query: parameters.value})

    const message = ref('');
    const createComment = (event, replyToComment) => {
      let comment: Comment;

      if (replyToComment) {
        const replyMessage = event.currentTarget.previousSibling.value;
        // only reply to top-level comments
        const replyParent = comments.value.find(comment => comment.id === replyToComment);
        const realReplyToComment = replyParent.replyToComment ? replyParent.replyToComment : replyToComment;
        debugger;
        comment = {
          message: replyMessage,
          requirementId,
          replyToComment: realReplyToComment,
        };
      } else {
        comment = {
          message: message.value,
          requirementId,
        };
      }
      
      store.dispatch(ActionTypes.CreateComment, comment);
    };

    const toggleReply = (event, comment: LocalComment) => {
      const showReplyTo = comment.showReplyTo ? false : true;
      store.commit(MutationType.SetCommentShowReplyTo, {comment, showReplyTo});
    }

    const deleteComment = (event, commentId) => {
      app?.appContext.config.globalProperties.$confirm.require({
          target: event.currentTarget,
          message: `${t('delCommTitle')}?`,
          icon: 'pi pi-exclamation-triangle',
          acceptClass: 'p-button-danger',
          accept: () => {
              //callback to execute when user confirms the action
              store.dispatch(ActionTypes.DeleteComment, commentId);
          },
          reject: () => {
              //callback to execute when user rejects the action
          }
      });
    };

    return { t, comments, oidcIsAuthenticated, oidcUser, message, createComment, toggleReply, deleteComment, input, selectInput };
  }
})
</script>

<style scoped>
  .comment:last-child {
    padding-bottom: 1rem;
  }

  .reply {
    padding-left: 3rem;
  }

  .addComment {
    width: 100%;
    display: flex;
  }

  .addComment > .input {
    flex: 1;
    margin-right: 0.5em;
  }

  .action {
    font-weight: bold;
    text-decoration: underline;
    cursor: pointer;
  }

  .info {
    margin-top: 0.1rem;
    color: grey;
    font-size: 0.9rem;
  }
</style>
