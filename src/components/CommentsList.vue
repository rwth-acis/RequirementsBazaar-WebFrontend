<template>
  <div>
    <Dialog :header="t('editComment')" v-model:visible="displayCommentEditor" :breakpoints="{'960px': '75vw', '640px': '100vw'}" :style="{width: '50vw'}" :modal="true">
      <InputText type="text" v-model="editedCommentMessage" class="input" autofocus />
      <template #footer>
        <Button :label="t('cancel')" icon="pi pi-times" @click="commentEditorCanceled" class="p-button-text"/>
        <Button :label="t('save')" icon="pi pi-check" @click="commentEditorSaved" />
      </template>
    </Dialog>
    <div>
      <div v-if="comments.length === 0">
        <p>{{ t('noComments') }}</p>
      </div>
      <div v-for="comment in comments" :key="comment.id" class="comment p-mb-3">
        <div class="p-d-flex p-mb-1" :class="{ reply: comment.replyToComment }">
            <!-- NOTE: creator attribute may be null (e.g., when comment was deleted) -->
            <UserAvatar :imageUrl="comment.creator?.profileImage" :userName="comment.creator?.userName" size="small" />
            <div class="p-pl-2">
                <div>{{ comment.deleted ? t('deletedCommented') : comment.message }}</div>
                <div class="info">
                  <span v-if="oidcIsAuthenticated && !comment.deleted">
                    <span class="action" @click="toggleReply($event, comment)">{{ t('reply') }}</span> ·
                    <span v-if="oidcUser.preferred_username === comment.creator.userName">
                      <span class="action" @click="editComment(comment)">{{ t('edit') }}</span> ·
                      <span class="action" @click="deleteComment($event, comment.id)">{{ t('delete') }}</span> ·
                    </span>
                  </span>
                  <span :title="$dayjs(comment.creationDate).format('LLL')">{{ $dayjs(comment.creationDate).fromNow() }}</span>
                  <span v-if="!comment.deleted">{{ t('by') }}{{ comment.creator.userName }}</span>
                </div>
            </div>
        </div>
        <div class="p-pb-1 addComment reply" v-if="comment.showReplyTo">
          <InputText type="text" :placeholder="t('addComment')" class="input"/>
          <Button label="Save" @click="createComment($event, comment)" />
        </div>
      </div>
    </div>
    <div class="addComment" v-if="oidcIsAuthenticated">
      <InputText type="text" v-model="message" :placeholder="t('addComment')" class="input" ref="input"/>
      <Button label="Save" @click="createComment" />
    </div>
  </div>
</template>

<script lang="ts">
import { computed, ref, defineComponent, onMounted } from 'vue'
import { useStore } from 'vuex';
import { useI18n } from 'vue-i18n';
import { useConfirm } from "primevue/useconfirm";
import { ActionTypes } from '../store/actions';
import { MutationType } from '../store/mutations';
import { Comment } from '../types/bazaar-api';
import { LocalComment } from '../store/state';
import UserAvatar from './UserAvatar.vue';

export default defineComponent({
  name: 'RequirementCard',
  props: {
    requirementId: { type: Number, required: true },
  },
  components: { UserAvatar },
  setup: ({ requirementId }) => {
    const store = useStore();
    const { t } = useI18n({ useScope: 'global' });
    const confirm = useConfirm();
    const oidcIsAuthenticated = computed(() => store.getters['oidcStore/oidcIsAuthenticated']);
    const oidcUser = computed(() => store.getters['oidcStore/oidcUser']);

    const input = ref(null);

    onMounted(() => {
      //(input as any).value.$el.focus();
    });

    const selectInput = () => {
      (input as any).value.$el.focus();
    };

    const comments = computed(() => store.getters.commentsList(requirementId));
    store.dispatch(ActionTypes.FetchCommentsOfRequirement, requirementId )

    const message = ref('');
    const createComment = (event, replyToComment) => {
      let comment: Comment;

      if (replyToComment) {
        const replyMessage = event.currentTarget.previousSibling.value;
        // only reply to top-level comments
        const replyParent = comments.value.find(comment => comment.id === replyToComment.id);
        const realReplyToComment = replyParent.replyToComment ? replyParent.replyToComment : replyToComment.id;
        comment = {
          message: replyMessage,
          requirementId,
          replyToComment: realReplyToComment,
        };
        // deactivate reply input box
        store.commit(MutationType.SetCommentShowReplyTo, {commentId: replyToComment.id, showReplyTo: false});
      } else {
        comment = {
          message: message.value,
          requirementId,
        };
      }

      store.dispatch(ActionTypes.CreateComment, comment).then( _ => {
        // clear comment text fields
        if (replyToComment) {
          event.currentTarget.previousSibling.value = ''; // pretty hacky. TODO refactor
        } else {
          message.value = '';
        }
      })
    };

    const toggleReply = (event, comment: LocalComment) => {
      const showReplyTo = comment.showReplyTo ? false : true;
      store.commit(MutationType.SetCommentShowReplyTo, {commentId: comment.id, showReplyTo});
    }

    const deleteComment = (event, commentId) => {
      confirm.require({
        target: event.currentTarget,
        message: `${t('delCommTitle')}?`,
        icon: 'pi pi-exclamation-triangle',
        acceptClass: 'p-button-danger',
        group: 'popup',
        accept: () => {
          store.dispatch(ActionTypes.DeleteComment, commentId);
        },
        reject: () => {
          // do nothing
        }
      });
    };

    const displayCommentEditor = ref(false);
    const editedCommentMessage = ref('');
    let editedComment: Comment;
    const editComment = (comment: Comment) => {
      editedComment = comment;
      editedCommentMessage.value = comment.message;
      displayCommentEditor.value = true;
    };
    const commentEditorSaved = () => {
      displayCommentEditor.value = false;
      if (editedComment && editedComment.id) {
        const comment: Comment = {
          id: editedComment.id,
          message: editedCommentMessage.value,
        };
        store.dispatch(ActionTypes.UpdateComment, comment);
      }
    }
    const commentEditorCanceled = () => {
      displayCommentEditor.value = false;
    }

    return {
      t,
      comments,
      oidcIsAuthenticated,
      oidcUser,
      message,
      createComment,
      toggleReply,
      editComment,
      deleteComment,
      input,
      selectInput,
      displayCommentEditor,
      commentEditorCanceled,
      editedCommentMessage,
      commentEditorSaved,
    };
  }
})
</script>

<style scoped>
  .reply {
    padding-left: 3rem;
  }

  .input {
    width: 100%;
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
