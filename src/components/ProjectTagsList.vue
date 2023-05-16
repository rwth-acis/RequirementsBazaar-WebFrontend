<template>
    <div class="card" v-if="tags">
        <div>
            <Button :label="t('projectDetails-addTag')" icon="pi pi-plus" class="p-button-success p-my-3"
                @click="openNewTagDialog" />
        </div>

        <DataTable :value="tags" rowGroupMode="subheader" groupRowsBy="name" sortMode="single" sortField="name"
            :sortOrder="1" scrollable scrollHeight="800px">
            <Column :exportable="false" header="Label">
                <template #body="slotProps">
                    <div class="role-field">
                        <Badge :style="{ background: slotProps.data.colour }" :value=slotProps.data.name></Badge>
                    </div>
                </template>
            </Column>
            <Column :exportable="false" header="">
                <template #body="slotProps">
                        <div class="controls">
                            <Button icon="pi pi-pencil"
                                class="p-button-rounded p-button-success p-mr-2"
                                @click="openEditTagDialog(slotProps.data)" />
                            <Button icon="pi pi-trash"
                                class="p-button-rounded p-button-danger" @click="confirmRemoveTag(slotProps.data)" />
                        </div>
                </template>
            </Column>
        </DataTable>
    </div>

    <Dialog v-model:visible="showAddTagDialog" :style="{ width: '450px' }" :header="t('projectDetails-addTag')"
        :modal="true" class="p-fluid">
        <div class="p-field">
            <label for="name">{{ t('tagName') }}</label>
            <InputText id="name" type="text" v-model="tagToAdd.name" />
            <div class="input-errors" v-for="error of v$.tagToAdd.name.$errors" :key="error.$uid">
                <small class="p-error">{{ error.$message.replace('Value', 'Name') }}</small>
             </div>
        </div>

        <div class="p-field">
            <label for="inventoryStatus" class="p-mb-3">{{ t('tagColour') }}</label>
                <ColorPicker v-model="tagToAdd.colour" inputId="cp-hex" format="hex" class="colorPicker" />
        </div>

        <template #footer>
            <div class="footer">
                <ProgressBar mode="indeterminate" class="mb-3" v-if="inProgress" />
                <Button :label="t('cancel')" icon="pi pi-times" class="p-button-outlined p-ml-2 p-mr-2"
                    @click="showAddTagDialog = false" />
                <Button :label="t('save')" icon="pi pi-check" @click="submitTag" />
            </div>
        </template>
    </Dialog>

    <Dialog v-model:visible="showEditTagDialog" :style="{ width: '450px' }" :header="t('projectDetails-editTag')" :modal="true"
        class="p-fluid">
        <div class="p-field">
            <label for="name">{{ t('tagName') }}</label>
            <InputText id="name" type="text" v-model="tagToEdit!.name" />
            <div class="input-errors" v-for="error of vE$.tagToEdit.name.$errors" :key="error.$uid">
                <small class="p-error">{{ error.$message.replace('Value', 'Name') }}</small>
             </div>
        </div>

        <div class="p-field">
            <label for="inventoryStatus" class="p-mb-3">{{ t('tagColour') }}</label>
            <ColorPicker v-model="tagToEdit!.colour" inputId="cp-hex" format="hex" class="colorPicker" />
        </div>

        <template #footer>
            <div class="footer">
                <ProgressBar mode="indeterminate" class="mb-3" v-if="inProgress" />
                <Button :label="t('cancel')" icon="pi pi-times" class="p-button-outlined p-ml-2 p-mr-2"
                    @click="showEditTagDialog = false" />
                <Button :label="t('save')" icon="pi pi-check" @click="submitUpdatedTag" />
            </div>
        </template>
    </Dialog>

    <Dialog v-model:visible="showRemoveTagDialog" :style="{ width: '450px' }" header="Confirm" :modal="true">
        <div class="confirmation-content">
            <i class="pi pi-exclamation-triangle p-mr-3" style="font-size: 2rem" />
            <span v-if="tagToRemove">{{ t('projectDetails-areYouSureYouWantToRemoveTag') }}
                <b>{{ tagToRemove.name }}</b> {{ t('projectDetails-fromTheProject') }}</span>
        </div>
        <template #footer>
            <div class="footer">
                <ProgressBar mode="indeterminate" class="mb-3" v-if="inProgress" />
                <Button :label="t('no')" icon="pi pi-times" class="p-button-outlined p-ml-2 p-mr-2"
                    @click="showRemoveTagDialog = false" />
                <Button :label="t('yes')" icon="pi pi-check" @click="removeTag(tagToRemove)" />
            </div>
        </template>
    </Dialog>
</template>

<script lang="ts">
import { computed, ref, defineComponent, onMounted } from 'vue'
import { useStore } from 'vuex';
import { useI18n } from 'vue-i18n';
import { ActionTypes } from '../store/actions';
import {Tag, User } from '../types/bazaar-api';
import { required } from "@vuelidate/validators";
import { useVuelidate } from "@vuelidate/core";


export default defineComponent({
    name: 'ProjectTagsList',
    props: {
        projectId: { type: Number, required: true },
    },
    setup: ({ projectId }) => {
        const store = useStore();
        const { t } = useI18n({ useScope: 'global' });
        const oidcIsAuthenticated = computed(() => store.getters['oidcStore/oidcIsAuthenticated']);
        const oidcUser = computed(() => store.getters['oidcStore/oidcUser']);

        onMounted(() => {
            //(input as any).value.$el.focus();
            console.log("mounted");
        });

        const project = computed(() => store.getters.getProjectById(projectId));
        store.dispatch(ActionTypes.FetchProject, projectId);

        const inProgress = ref(false);

        var tags = computed(() => store.getters.getProjectTags(projectId));
        store.dispatch(ActionTypes.FetchTags, projectId);

        const tagToRemove = ref();
        const showRemoveTagDialog = ref(false);

        const confirmRemoveTag = (tag: Tag) => {
            tagToRemove.value = tag;

            showRemoveTagDialog.value = true;
        };

        const removeTag = (tag: Tag) => {
            inProgress.value = true;
            store.dispatch(ActionTypes.RemoveTag, { projectId: projectId, tagId: tag.id })
                .then(() => {
                    showRemoveTagDialog.value = false;
                    inProgress.value = false;
                });
        };

        const showAddTagDialog = ref(false);
        const tagSubmitted = ref(false);
        const tagToAdd = ref<Tag>({
            id: -1,
            projectId: projectId,
            name: "New Tag",
            colour: "#0000" // default
        });
        const rulesAdd = {
              tagToAdd: {
                name: { required },
                },
            };
        const rulesEdit = {
              tagToEdit: {
                name: { required },
                },
            };
        const tagToEdit = ref<Tag>();


        const v$ = useVuelidate(rulesAdd, { tagToAdd });
        const openNewTagDialog = () => {
            tagToAdd.value = {
                id: -1,
                projectId: projectId,
                name: "New Tag",
                colour: "#447500" // default
            };
            tagSubmitted.value = false;
            showAddTagDialog.value = true;
        };

        const submitTag = async () => {
            tagSubmitted.value = true;
            const isFormCorrect = await v$.value.$validate();

            if (!isFormCorrect) {
                return;
            }
            else{
                if (!tagToAdd.value!.colour.startsWith("#")) {
                    tagToAdd.value.colour = "#" + tagToAdd.value.colour;
                }
                inProgress.value = true;
            }
            store.dispatch(ActionTypes.CreateTag, { projectId: projectId, id: tagToAdd.value!.id, name: tagToAdd.value.name, colour: tagToAdd.value.colour })
                .then(() => {
                    showAddTagDialog.value = false;
                    inProgress.value = false;
                });
        };

        const showEditTagDialog = ref(false);
        const vE$ = useVuelidate(rulesEdit, { tagToEdit });

        const openEditTagDialog = (tag: Tag) => {
            // IMPORTANT: clone here so we do not modify a Vuex state object!
            tagToEdit.value = {
                id: tag.id,
                projectId: projectId,
                colour: tag.colour,
                name: tag.name
            };
            showEditTagDialog.value = true;
        };

        const submitUpdatedTag = async () => {
            tagSubmitted.value = true;
            const isFormCorrect = await vE$.value.$validate();

            if (!isFormCorrect) {
                return;
            }
            else{
                inProgress.value = true;
                if (!tagToEdit.value!.colour.startsWith("#")) {
                    tagToEdit.value!.colour = "#" + tagToEdit.value!.colour;
                }
            }
            store.dispatch(ActionTypes.UpdateTag, {
                projectId: projectId, id: tagToEdit.value!.id, name: tagToEdit.value!.name, colour: tagToEdit.value!.colour
            })
                .then(() => {
                    showEditTagDialog.value = false;
                    inProgress.value = false;
                });
        };

        return {
            t,
            oidcIsAuthenticated,
            oidcUser,
            tags,
            showRemoveTagDialog,
            showAddTagDialog,
            confirmRemoveTag,
            removeTag,
            tagToRemove,
            openNewTagDialog,
            tagToAdd,
            tagSubmitted,
            submitTag,
            inProgress,
            openEditTagDialog,
            tagToEdit,
            showEditTagDialog,
            submitUpdatedTag,
            v$,
            vE$,
        };
    }
})
</script>

<style lang="scss" scoped>

.footer {
  text-align: end;
  margin-top: 2%;
}

.footer ::v-deep(.p-button) {
  width: auto;
}
.role-field {
    display: flex;
    flex-direction: column;
    align-items: center;
}

.role-field .controls {
    margin-top: .75em;
}

.user-field {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
}

.colorPicker{
    display: flex;
}

.user-field .name {
    display: flex;
    flex-direction: row;
    align-items: center;
}

.user-field .user-id {
    margin-top: 0.5em;
}
.custom-colorpicker {
  opacity: 1; /* Reset the opacity */
  cursor: not-allowed; /* Reset the cursor */
  background-color: #f4f4f4; /* Set the desired background color for the disabled state */
  color: #333; /* Set the desired text color for the disabled state */
}

@media (min-width: 768px) {
    .role-field {
        flex-direction: row;
    }

    .role-field .controls {
        margin-left: 1em;
        display: flex;
        margin-top: .75em;
    }

    .user-field {
        flex-direction: row;
    }

    .user-field .name {
        margin-right: 0.5em;
    }
}
</style>
