<template>
  <div class="p-fluid">
    <form @submit.prevent="handleSubmit()" class="p-fluid">
      <div class="p-field">
        <label for="name">{{ t('formTitle') }}</label>
        <InputText id="name" type="text" v-model="v$.name.$model" />
        <div class="input-errors" v-for="error of v$.name.$errors" :key="error.$uid">
          <small class="p-error">{{ error.$message.replace('Value', 'Title') }}</small>
        </div>
      </div>
      <div class="p-field">
        <label for="description">{{ t('formDesc') }}</label>
        <Editor v-model="v$.description.$model" editorStyle="height: 100px">
          <template #toolbar>
            <span class="ql-formats">
              <button class="ql-bold"></button>
              <button class="ql-italic"></button>
            </span>
            <span class="ql-formats">
              <button class="ql-clean"></button>
            </span>
          </template>
        </Editor>
        <div class="input-errors" v-for="error of v$.description.$errors" :key="error.$uid">
          <small class="p-error">{{ error.$message.replace('Value', 'Description') }}</small>
        </div>
      </div>
      <div class="p-field">
        <label for="repository">{{ t('Repository') }}</label>
        <InputText id="repository" type="text" v-model="v$.repositoryURL.$model" />
        <div class="input-errors" v-for="error of v$.repositoryURL.$errors" :key="error.$uid">
          <small class="p-error">{{ error.$message }}</small>
        </div>
      </div>
      <div class="footer">
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
import { Project } from '../types/bazaar-api';
import { required, maxLength, url } from "@vuelidate/validators";
import { useVuelidate } from "@vuelidate/core";
import MarkdownIt from 'markdown-it';
import TurndownService from 'turndown';

import { useProgress } from '@/service/ProgressService';

export default defineComponent({
  name: 'ProjectEditor',
  props: {
    name: {
      type: String,
      default: '',
    },
    description: {
      type: String,
      default: '',
    },
    projectId: {
      type: Number,
      required: false,
    },
    additionalProperties: {
      type: Object,
      required: false,
    },
    onCancel: Function as PropType<(x: string) => void>, /* workaround for typing custom events */
    onSave: Function as PropType<(x: string) => void>, /* workaround for typing custom events */
  },
  emits: ['cancel', 'save'],
  setup: ({ name, description, projectId, additionalProperties }, { emit }) => {
    const store = useStore();
    const { t } = useI18n({ useScope: 'global' });
    const { startLoading, stopLoading } = useProgress();

    const submitted = ref(false);

    const markdown = new MarkdownIt();
    const renderedHTML = markdown.render(description);

    const state = reactive({
      name,
      description: renderedHTML,
      repositoryURL: additionalProperties?.github_url ?? '',
    });
    const rules = {
      name: { required, maxLengthValue: maxLength(50) },
      description: { required },
      repositoryURL: { url }
    };
    const v$ = useVuelidate(rules, state);

    const turndownService = new TurndownService();

    const cancel = () => {
      emit('cancel');
    }

    const handleSubmit = async () => {
      submitted.value = true;

      const isFormCorrect = await v$.value.$validate();
      if (!isFormCorrect) {
        return;
      } else {
        startLoading();
      }

      const updatedAdditionalProperties = JSON.parse(JSON.stringify(additionalProperties ?? {}));
      updatedAdditionalProperties.github_url = state.repositoryURL;

      const project: Project = {
        name: state.name,
        description: turndownService.turndown(state.description),
        additionalProperties: updatedAdditionalProperties,
      };

      if (!projectId) {
        store.dispatch(ActionTypes.CreateProject, project).then(() => {
          stopLoading();
          emit('save');
        });
      } else {
        project.id = projectId;
        store.dispatch(ActionTypes.UpdateProject, project).then(() => {
          stopLoading();
          emit('save');
        });
      }
    }

    return { t, submitted, state, v$, cancel, handleSubmit, turndownService };
  }
})
</script>

<style scoped>
.footer {
  text-align: end;
}

.footer ::v-deep(.p-button) {
  width: auto;
}
</style>
