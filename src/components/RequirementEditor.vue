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
        <label for="tags">{{ t('formTag') }}</label>
        <Dropdown id="tag" v-model="selectedTag" :options="tagTypes" optionLabel="name" :required="true" />
      </div>
      <div class="footer">
        <Button :label="t('cancel')" @click="cancel" class="p-button-outlined p-ml-2 p-mr-2" />
        <Button type="submit" :label="t('save')" />
      </div>
    </form>
  </div>
</template>

<script lang="ts">
import { ref, defineComponent, PropType, reactive, computed } from 'vue'
import { useStore } from 'vuex';
import { useI18n } from 'vue-i18n';
import { ActionTypes } from '../store/actions';
import { Requirement } from '../types/bazaar-api';
import { required, maxLength } from "@vuelidate/validators";
import { useVuelidate } from "@vuelidate/core";
import { Tag } from '@/types/bazaar-api';

import MarkdownIt from 'markdown-it';
import TurndownService from 'turndown';

import { useProgress } from '@/service/ProgressService';

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
      required: true,
    },
    categories: {
      type: Array as PropType<Array<number>>,
      required: true,
    },
    requirementId: {
      type: Number,
      required: false,
    },
    tag: {
      type: Object as PropType<Tag>,
      required: false,
    },
    onCancel: Function as PropType<(x: string) => void>, /* workaround for typing custom events */
    onSave: Function as PropType<(x: string) => void>, /* workaround for typing custom events */
  },
  emits: ['cancel', 'save'],
  setup: ({ name, description, projectId, categories, requirementId, tag }, { emit }) => {
    const store = useStore();
    const { t } = useI18n({ useScope: 'global' });
    const { setLoading } = useProgress();

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
    const tagList: Array<{ name: String, code: Number }> = [];
    const noneTag = { name: t('tagNone'), code: -1 };
    tagList.push(noneTag);

    store.dispatch(ActionTypes.FetchTags, projectId);
    const storeTags = computed(() => store.getters.getProjectTags(projectId));
    storeTags.value.forEach((tag: Tag) => {
      if (tag.id) {
        let tagEntry = { name: tag.name, code: tag.id }
        tagList.push(tagEntry);
      }
    });
    console.error(tag)
    if (tag) {
      var oldTag = { name: tag.name, code: tag.id };
      var selectedTag = ref(oldTag)
    } else {
      var selectedTag = ref(noneTag)
    }


    const tagTypes = ref(tagList);

    const cancel = () => {
      emit('cancel');
    }

    const handleSubmit = async () => {
      submitted.value = true;
      var chosenTag = selectedTag.value;

      const isFormCorrect = await v$.value.$validate();
      // you can show some extra alert to the user or just leave the each field to show it's `$errors`.
      if (!isFormCorrect) {
        return;
      } else {
        setLoading(true);
      }

      var reqTag;
      storeTags.value.forEach((tag: Tag) => {
        if (tag.id) {
          if (tag.id == chosenTag.code) {
            reqTag = tag;
          }
        }
      });
      console.error(reqTag)

      const requirement: Requirement = {
        name: state.name,
        description: turndownService.turndown(state.description),
        tags: reqTag ? [reqTag] : undefined,
        projectId,
        categories,
      };

      if (!requirementId) {
        store.dispatch(ActionTypes.CreateRequirement, requirement).then(() => {
          setLoading(false);
          emit('save');
        });
      } else {
        requirement.id = requirementId;
        store.dispatch(ActionTypes.UpdateRequirement, requirement).then(() => {
          setLoading(false);
          emit('save');
        });
      }
    }

    return { t, submitted, state, v$, cancel, handleSubmit, turndownService, selectedTag, tagTypes };
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
