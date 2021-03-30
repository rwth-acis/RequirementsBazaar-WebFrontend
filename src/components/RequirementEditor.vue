<template>
  <div>
    <InputText type="text" v-model="name" />
    <Editor v-model="description" editorStyle="height: 320px">
      <template #toolbar>
        <span class="ql-formats">
          <button class="ql-bold"></button>
          <button class="ql-italic"></button>
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

import TurndownService from 'turndown';

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
    
    const turndownService = new TurndownService();

    const createRequirement = () => {
      const requirement: Requirement = {
        name: name.value,
        description: turndownService.turndown(description.value),
        categories: [{id: categoryId}],
        projectId: projectId,
      };
      
      store.dispatch(ActionTypes.CreateRequirement, requirement);
    };

    return { name, description, createRequirement };
  }
})
</script>

<style scoped>
</style>
