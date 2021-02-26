<template>
  <Card id="card">
    <template #title>
      <div>{{ name }}</div>
    </template>
    <template #content>
      <div>{{ description }}</div>
      <div id="actionButtons">
        <Button label="Vote"></Button>
        <Button :label="`${numberOfComments} Comments`" @click="toggleComments"></Button>
        <Button label="Share"></Button>
      </div>
      <comments-list :requirementId="id" v-if="showComments" id="commentsList"></comments-list>
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
import CommentsList from './CommentsList.vue';

export default defineComponent({
  components: { CommentsList },
  name: 'RequirementCard',
  props: {
    id: { type: Number, required: true },
    name: { type: String, required: true },
    description: { type: String, required: true },
    numberOfComments: { type: Number, required: true },
  },
  setup: (props) => {
    const showComments = ref(false);

    const toggleComments = () => {
      showComments.value = !showComments.value;
    }

    return { showComments, toggleComments }
  }
})
</script>

<style scoped>
  #actionButtons {
    width: 100%;
    display: flex;
    flex-direction: row;
    padding-top: 1rem;
  }

  button {
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

  #commentsList {
    padding-top: 1rem;
  }
</style>
