<template>
  <div class="p-fluid">
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
            <span class="ql-formats">
              <button class="ql-clean"></button>
            </span>
          </template>
        </Editor>
        <small v-if="(v$.description.$invalid && submitted)" class="p-error">{{v$.description.required.$message.replace('Value', 'Description')}}</small>
      </div>
      <div class="p-field">
        <Accordion>
          <AccordionTab header="Attachments">
            <FileUpload url="https://requirements-bazaar.org/fileservice/files/"
                        :customUpload="true"
                        @uploader="uploadAttachment"
                        :showUploadButton="false"
                        :auto="true"
                        :multiple="true"
                        accept="image/*"
                        :maxFileSize="1000000">
              <template #empty>
                <p>Drag and drop files to here to upload.</p>
              </template>
            </FileUpload>
          </AccordionTab>
        </Accordion>
      </div>
      <div class="footer">
        <Button :label="t('cancel')" @click="cancel" class="p-button-outlined p-ml-2 p-mr-2" />
        <Button type="submit" :label="t('save')" />
      </div>
    </form>
  </div>
</template>

<script lang="ts">
import { computed, ref, defineComponent, PropType, reactive } from 'vue'
import { useStore } from 'vuex';
import { useI18n } from 'vue-i18n';
import { ActionTypes } from '../store/actions';
import { MutationType } from '../store/mutations';
import { Requirement } from '../types/bazaar-api';
import { required, maxLength } from "@vuelidate/validators";
import { useVuelidate } from "@vuelidate/core";
import MarkdownIt from 'markdown-it';
import TurndownService from 'turndown';

export default defineComponent({
  name: 'RequirementEditor',
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
      required: true
    },
    categories: {
      type: Array as PropType<Array<number>>,
      required: true,
    },
    requirementId: {
      type: Number,
      required: false
    },
    onCancel: Function as PropType<(x: string) => void>, /* workaround for typing custom events */
    onSave: Function as PropType<(x: string) => void>, /* workaround for typing custom events */
  },
  emits: ['cancel', 'save'],
  setup: ({ name, description, projectId, categories, requirementId }, { emit }) => {
    const store = useStore();
    const { t } = useI18n({ useScope: 'global' });

    const submitted = ref(false);

    const markdown = new MarkdownIt();
    const renderedHTML = markdown.render(description);

    const state = reactive({
      name,
      description: renderedHTML,
    });
    const rules = {
      name: { required, maxLengthValue: maxLength(50) },
      description: { required },
    };
    const v$ = useVuelidate(rules, state);
    
    const turndownService = new TurndownService();

    const cancel = () => {
      emit('cancel');
    }

    const draft: Requirement = {
      attachments: [],
      description,
      projectId,
      categories,
    }
    if (requirementId) {
      draft.id = requirementId;
    }
    store.commit(MutationType.SetDraftRequirement, draft);
    const draftRequirement = computed(() => store.getters.getDraftRequirementByCategoryId(categories[0]));

    const handleSubmit = (isFormValid) => {
      submitted.value = true;

      if (!isFormValid) {
          return;
      }

      store.commit(MutationType.SetDraftRequirementName, {requirement: draftRequirement.value, name: state.name});
      store.commit(MutationType.SetDraftRequirementDescription, {requirement: draftRequirement.value, description: turndownService.turndown(state.description)});

      if (!requirementId) {
        store.dispatch(ActionTypes.CreateRequirement, draftRequirement.value);
      } else {
        store.dispatch(ActionTypes.UpdateRequirement, draftRequirement.value);
      }
      emit('save');
    }

    const uploadAttachment = (event) => {
      store.dispatch(ActionTypes.UploadAttachment, { draftRequirement: draftRequirement.value, file: event.files[0] });
    }

    return { t, submitted, state, v$, cancel, handleSubmit, turndownService, uploadAttachment };
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
