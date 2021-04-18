<template>
  <div class="p-fluid p-p-3">
    <div class="p-field">
      <label for="name">{{ t('formTitle') }}</label>
      <InputText id="name" type="text" v-model="name" />
    </div>
    <div class="p-field">
      <label for="description">{{ t('formDesc') }}</label>
      <Editor v-model="description" editorStyle="height: 100px">
        <template #toolbar>
          <span class="ql-formats">
            <button class="ql-bold"></button>
            <button class="ql-italic"></button>
          </span>
        </template>
      </Editor>
    </div>
    <div class="p-field">
      <Button label="Save" @click="createRequirement" />
    </div>
  </div>
</template>

<script lang="ts">
import { ref, defineComponent } from 'vue'
import { useStore } from 'vuex';
import { useI18n } from 'vue-i18n';
import { ActionTypes } from '../store/actions';
import { Requirement } from '../types/bazaar-api';

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
    const { t } = useI18n({ useScope: 'global' });

    const name = ref('');
    const description = ref('');
    
    const turndownService = new TurndownService();

    const createRequirement = () => {
      const requirement: Requirement = {
        name: name.value,
        description: turndownService.turndown(description.value),
        categories: [categoryId],
        projectId: projectId,
      };
      
      store.dispatch(ActionTypes.CreateRequirement, requirement);
    };

    return { t, name, description, createRequirement };
  }
})
</script>

<style scoped>
</style>
