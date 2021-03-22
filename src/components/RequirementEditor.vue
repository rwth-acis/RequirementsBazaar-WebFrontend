<template>
  <div>
    <InputText type="text" v-model="name" />
    <Editor v-model="description" editorStyle="height: 320px">
      <template #toolbar>
        <span class="ql-formats">
          <button class="ql-bold"></button>
          <button class="ql-italic"></button>
          <button class="ql-underline"></button>
        </span>
      </template>
    </Editor>
    <Button label="Save" @click="createRequirement" />
  </div>
</template>

<script lang="ts">
import { computed, ref, defineComponent } from 'vue'
import { useStore } from 'vuex';
import { ActionTypes } from '../store/actions';
import { Requirement } from '../types/api';

export default defineComponent({
  name: 'RequirementEditor',
  props: {
    projectId: { type: Number, required: true },
    categoryId: { type: Number, required: true },
    requirementId: { type: Number, required: false },
  },
  setup: ({ projectId, categoryId }) => {
    const store = useStore();

    const name = ref('name');
    const description = ref('description');

    const createRequirement = () => {

      const requirement: Requirement = {
        name: name.value,
        description: description.value,
        categories: [{id: categoryId}],
        projectId: projectId,
      };
      
      store.dispatch(ActionTypes.CreateRequirement, requirement);

    };

    // const parameters = computed(() => {return {per_page: 20}});
    // const comments = computed(() => store.getters.commentsList(requirementId, parameters.value));
    // store.dispatch(ActionTypes.FetchCommentsOfRequirement, {requirementId, query: parameters.value})

    return { name, description, createRequirement };
  }
})
</script>

<style scoped>
</style>
