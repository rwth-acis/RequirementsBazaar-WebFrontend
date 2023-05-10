<template>
    <div class="card" v-if="tags">
        <div>
            <Button :label="t('projectDetails-addTag')" icon="pi pi-plus" class="p-button-success p-my-3"
                @click="openNewTagDialog" />
        </div>

        <DataTable :value="tags" rowGroupMode="subheader" groupRowsBy="name" sortMode="single" sortField="name"
            :sortOrder="1" scrollable scrollHeight="800px">
            <Column field="Name" header="Name">
                <template #body="slotProps">
                    <div class="user-field">
                        <div class="name">
                            <span class="image-text p-pl-2">{{ slotProps.data.tagName }}</span>
                        </div>

                    </div>
                </template>
            </Column>
            <Column :exportable="false" header="Role">
                <template #body="slotProps">
                    <div class="role-field">
                        <div>{{ slotProps.data.role }}</div>
                        <div class="controls">
                            <Button icon="pi pi-pencil"
                                class="p-button-rounded p-button-success p-mr-2"
                                @click="openEditTagDialog(slotProps.data)" />
                            <Button icon="pi pi-trash"
                                class="p-button-rounded p-button-danger" @click="confirmRemoveTag(slotProps.data)" />
                        </div>
                    </div>
                </template>
            </Column>
            <template #groupheader="slotProps">
                <!--<i class="pi pi-user-plus p-pr-3" style="fontSize: 2rem; vertical-align: middle;"></i>-->
                <h3>{{ slotProps.data.role }}s</h3>
            </template>
        </DataTable>
    </div>

    <Dialog v-model:visible="showAddTagDialog" :style="{ width: '450px' }" :header="t('projectDetails-addTag')"
        :modal="true" class="p-fluid">
        <div class="p-field">
            <label for="name">{{ t('name') }}</label>
            <small class="p-error" v-if="tagSubmitted && !tagToAdd.name">{{
                t('projectDetails-tagNameIsRequired')
            }}</small>
        </div>

        <div class="p-field">
            <label for="inventoryStatus" class="p-mb-3">{{ t('role') }}</label>
            todo color picker
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

    <Dialog v-model:visible="showEditTagDialog" :style="{ width: '450px' }" header="Edit Tag" :modal="true"
        class="p-fluid">
        <div class="p-field">
            <label for="name">{{ t('name') }}: </label> <b>{{ tagToEdit.name }}</b>
        </div>

        <div class="p-field">
            <label for="inventoryStatus" class="p-mb-3">{{ t('role') }}</label>
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
            <span v-if="tagToRemove">{{ t('projectDetails-areYouSureYouWantToRemove') }}
                <b>{{ tagToRemove.userName }}</b> {{ t('projectDetails-fromTheProject') }}</span>
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
import { computed, ref, defineComponent, onMounted, watch } from 'vue'
import { useStore } from 'vuex';
import { useI18n } from 'vue-i18n';
import { ActionTypes } from '../store/actions';
import { ProjectMember, Tag, User } from '../types/bazaar-api';
import { bazaarApi, ProjectMemberRole } from '../api/bazaar';

import UserAvatar from './UserAvatar.vue';

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

        const activeUser = ref<User>();
        // TODO Ensure this is already loaded when accessing this property!
        bazaarApi.users.getActiveUser().then(resp => activeUser.value = resp.data);

        const project = computed(() => store.getters.getProjectById(projectId));
        store.dispatch(ActionTypes.FetchProject, projectId);

        const inProgress = ref(false);

        const tags = computed(() => store.getters.getProjectTags(projectId));
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
        const openNewTagDialog = () => {
            tagToAdd.value = {
                id: -1,
                projectId: projectId,
                name: "New Tag",
                colour: "#0000" // default
            };
            tagSubmitted.value = false;
            showAddTagDialog.value = true;
        };

        const selectedTag = ref<User>();

        const submitTag = () => {
            inProgress.value = true;
            store.dispatch(ActionTypes.UpdateTag, { projectId: projectId, tagId: selectedTag.value!.id, name: tagToAdd.value.name, colour: tagToAdd.value.colour })
                .then(() => {
                    showAddTagDialog.value = false;
                    inProgress.value = false;
                });
        };

        const showEditTagDialog = ref(false);
        const tagToEdit = ref<Tag>();

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

        const submitUpdatedTag = () => {
            inProgress.value = true;
            store.dispatch(ActionTypes.UpdateTag, {
                projectId: projectId, tagId: selectedTag.value!.id, name: tagToAdd.value.name, colour: tagToAdd.value.colour
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
            selectedTag,
            inProgress,
            openEditTagDialog,
            tagToEdit,
            showEditTagDialog,
            submitUpdatedTag,
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

.user-field .name {
    display: flex;
    flex-direction: row;
    align-items: center;
}

.user-field .user-id {
    margin-top: 0.5em;
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
