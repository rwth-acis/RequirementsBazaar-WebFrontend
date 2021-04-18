<template>
  <div class="p-fluid p-p-3">
    <form @submit.prevent="handleSubmit(!v$.$invalid)" class="p-fluid">
      <div class="p-field">
        <label for="name">{{ t('formTitle') }}</label>
        <InputText id="name" type="text" v-model="state.name" />
        <small v-if="(v$.name.$invalid && submitted)" class="p-error">{{v$.name.required.$message.replace('Value', 'Title')}}</small>
      </div>
      <div class="p-field">
        <label for="description">{{ t('formDesc') }}</label>
        <Editor v-model="state.description" editorStyle="height: 100px">
          <template #toolbar>
            <span class="ql-formats">
              <button class="ql-bold"></button>
              <button class="ql-italic"></button>
            </span>
          </template>
        </Editor>
        <small v-if="(v$.description.$invalid && submitted)" class="p-error">{{v$.description.required.$message.replace('Value', 'Description')}}</small>
      </div>
      <div class="footer p-dialog-footer">
        <Button :label="t('cancel')" @click="cancel" class="p-button-outlined p-ml-2 p-mr-2" />
        <Button type="submit" :label="t('save')" />
      </div>
    </form>
  </div>
</template>

<script lang="ts">
import { ref, defineComponent, PropType, reactive } from 'vue'
import { useStore } from 'vuex';
import { useI18n } from 'vue-i18n';
import { ActionTypes } from '../store/actions';
import { Requirement } from '../types/bazaar-api';
import { required, maxLength } from "@vuelidate/validators";
import { useVuelidate } from "@vuelidate/core";

import TurndownService from 'turndown';

export default defineComponent({
  name: 'RequirementEditor',
  props: {
    projectId: { type: Number, required: true },
    categoryId: { type: Number, required: true },
    requirementId: { type: Number, required: false },
    onCancel: Function as PropType<(x: string) => void>, /* workaround for typing custom events */
    onSave: Function as PropType<(x: string) => void>, /* workaround for typing custom events */
  },
  emits: ['cancel', 'save'],
  setup: ({ projectId, categoryId }, { emit }) => {
    const store = useStore();
    const { t } = useI18n({ useScope: 'global' });

    const submitted = ref(false);

    const state = reactive({
      name: '',
      description: '',
    });
    const rules = {
      name: { required, maxLengthValue: maxLength(50) },
      description: { required },
    };
    const v$ = useVuelidate(rules, state);
    
    const turndownService = new TurndownService();

    const createRequirement = () => {
      const requirement: Requirement = {
        name: state.name,
        description: turndownService.turndown(state.description),
        categories: [categoryId],
        projectId: projectId,
      };
      
      store.dispatch(ActionTypes.CreateRequirement, requirement);

      emit('save');
    };

    const cancel = () => {
      emit('cancel');
    }

    const handleSubmit = (isFormValid) => {
      submitted.value = true;

      if (!isFormValid) {
          return;
      }

      createRequirement();
    }

    return { t, submitted, state, v$, cancel, handleSubmit };
  }
})
</script>

<style scoped>
  .footer {
    text-align: end;
  }
</style>
