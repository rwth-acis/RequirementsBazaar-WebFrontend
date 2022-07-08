<template>
    <div class="card" v-if="members">
        <div v-if="isModifyMembersAllowed">
            <Button :label="t('projectDetails-addMember')" icon="pi pi-plus" class="p-button-success p-my-3" @click="openNewMemberDialog" />
        </div>

        <DataTable :value="members" rowGroupMode="subheader" groupRowsBy="role"
            sortMode="single" sortField="role" :sortOrder="1" scrollable scrollHeight="800px">
            <Column field="userName" header="User">
                <template #body="slotProps">
                    <UserAvatar :imageUrl="slotProps.data.userProfileImage" :userName="slotProps.data.userName" size="small" />
                    <span class="image-text p-pl-2">{{slotProps.data.userName}}</span>
                </template>
            </Column>
            <Column field="userId" header="User ID"></Column>
            <Column :exportable="false" header="Role">
                <template #body="slotProps">
                    {{slotProps.data.role}}
                </template>
            </Column>
            <Column :exportable="false">
                <template #body="slotProps">
                    <Button v-if="isModifyMembersAllowed" icon="pi pi-pencil" class="p-button-rounded p-button-success p-mr-2" @click="openEditMemberDialog(slotProps.data)" />
                    <Button v-if="isModifyMembersAllowed" icon="pi pi-trash" class="p-button-rounded p-button-danger" @click="confirmRemoveMember(slotProps.data)" />
                </template>
            </Column>
            <template #groupheader="slotProps">
                <!--<i class="pi pi-user-plus p-pr-3" style="fontSize: 2rem; vertical-align: middle;"></i>-->
                <h3>{{slotProps.data.role}}s</h3>
            </template>
        </DataTable>
    </div>

    <Dialog v-model:visible="showAddMemberDialog" :style="{width: '450px'}" :header="t('projectDetails-addMember')" :modal="true" class="p-fluid">
        <div class="p-field">
            <label for="name">{{ t('username') }}</label>
            <AutoComplete id="name" required="true" v-model="selectedUser" :suggestions="userSuggestions"  @complete="searchUser($event)"
                field="userName" forceSelection :class="{'p-invalid': memberSubmitted && !userNameInput}" :placeholder="t('projectDetails-chooseUserName')"  />
            <small class="p-error" v-if="memberSubmitted && !product.name">{{ t('projectDetails-userNameIsRequired') }}</small>
        </div>

        <div class="p-field">
            <label for="inventoryStatus" class="p-mb-3">{{ t('role') }}</label>
            <Dropdown id="inventoryStatus" v-model="memberToAdd.role" :options="assignableRoles" :placeholder="t('projectDetails-selectRole')">
                <template #value="slotProps">
                    <div v-if="slotProps.value && slotProps.value.value">
                        <span :class="'product-badge status-' +slotProps.value.value">{{slotProps.value.label}}</span>
                    </div>
                    <div v-else-if="slotProps.value && !slotProps.value.value">
                        <span :class="'product-badge status-' +slotProps.value.toLowerCase()">{{slotProps.value}}</span>
                    </div>
                    <span v-else>
                        {{slotProps.placeholder}}
                    </span>
                </template>
            </Dropdown>
        </div>

        <template #footer>
            <ProgressBar mode="indeterminate" class="mb-3" v-if="inProgress" />
            <Button label="Cancel" icon="pi pi-times" class="p-button-text" @click="showAddMemberDialog = false" />
            <Button label="Save" icon="pi pi-check" class="p-button-text" @click="submitMember" />
        </template>
    </Dialog>

    <Dialog v-model:visible="showEditMemberDialog" :style="{width: '450px'}" header="Edit Member" :modal="true" class="p-fluid">
        <div class="p-field">
            <label for="name">{{ t('username') }}: </label> <b>{{memberToEdit.userName}}</b>
        </div>

        <div class="p-field">
            <label for="inventoryStatus" class="p-mb-3">{{ t('role' )}}</label>
            <Dropdown id="inventoryStatus" v-model="memberToEdit.role" :options="assignableRoles" placeholder="Select a Role">
                <template #value="slotProps">
                    <div v-if="slotProps.value && slotProps.value.value">
                        <span :class="'product-badge status-' +slotProps.value.value">{{slotProps.value.label}}</span>
                    </div>
                    <div v-else-if="slotProps.value && !slotProps.value.value">
                        <span :class="'product-badge status-' +slotProps.value.toLowerCase()">{{slotProps.value}}</span>
                    </div>
                    <span v-else>
                        {{slotProps.placeholder}}
                    </span>
                </template>
            </Dropdown>
        </div>

        <template #footer>
            <ProgressBar mode="indeterminate" class="mb-3" v-if="inProgress" />
            <Button :label="t('cancel')" icon="pi pi-times" class="p-button-text" @click="showEditMemberDialog = false" />
            <Button :label="t('save')" icon="pi pi-check" class="p-button-text" @click="submitUpdatedMember" />
        </template>
    </Dialog>

    <Dialog v-model:visible="showRemoveMemberDialog" :style="{width: '450px'}" header="Confirm" :modal="true">
        <Message v-if="warnRemoveActiveUser" severity="warn">{{ t('projectDetails-warningRemoveYourself') }}</Message>
        <div class="confirmation-content">
            <i class="pi pi-exclamation-triangle p-mr-3" style="font-size: 2rem" />
            <span v-if="memberToRemove">{{ t('projectDetails-areYouSureYouWantToRemove') }} <b>{{memberToRemove.userName}}</b> {{ t('projectDetails-fromTheProject') }}</span>
        </div>
        <template #footer>
            <ProgressBar mode="indeterminate" class="mb-3" v-if="inProgress" />
            <Button :label="t('no')" icon="pi pi-times" class="p-button-text" @click="showRemoveMemberDialog = false"/>
            <Button :label="t('yes')" icon="pi pi-check" class="p-button-text" @click="removeMember(memberToRemove)" />
        </template>
    </Dialog>
</template>

<script lang="ts">
import { computed, ref, defineComponent, onMounted, watch } from 'vue'
import { useStore } from 'vuex';
import { useI18n } from 'vue-i18n';
import { ActionTypes } from '../store/actions';
import { ProjectMember, User } from '../types/bazaar-api';
import { bazaarApi, ProjectMemberRole } from '../api/bazaar';

import UserAvatar from './UserAvatar.vue';

export default defineComponent({
  name: 'ProjectMembersList',
  props: {
    projectId: { type: Number, required: true },
  },
  components: { UserAvatar },
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

    const members = computed(() => store.getters.getProjectMembers(projectId));
    store.dispatch(ActionTypes.FetchProjectMembers, projectId);

    // a boolean map indicatng when to show default user icon instead of profile image
    const showDefaultUserIcon = ref({});

    const handleUserImageError = (userId) => {
        showDefaultUserIcon.value[userId] = true;
        showDefaultUserIcon.value = showDefaultUserIcon.value;
    };

    const assignableRoles = ["ProjectMember", "ProjectManager", "ProjectAdmin"];

    const memberToRemove = ref();
    const showRemoveMemberDialog = ref(false);

    const warnRemoveActiveUser = computed(() => activeUser.value && activeUser.value.id === memberToRemove.value.userId)

    const confirmRemoveMember = (member: ProjectMember) => {
        memberToRemove.value = member;

        showRemoveMemberDialog.value = true;
    };

    const removeMember = (member: ProjectMember) => {
        inProgress.value = true;
        store.dispatch(ActionTypes.RemoveProjectMember, {projectId: projectId, userId: member.userId})
            .then(() => {
                showRemoveMemberDialog.value = false;
                inProgress.value = false;
            });
    };

    const showAddMemberDialog = ref(false);
    const memberSubmitted = ref(false);
    const memberToAdd = ref<ProjectMember>({
            userId: -1,
            role: "ProjectMember" // default
    });
    const openNewMemberDialog = () => {
        memberToAdd.value = {
            userId: -1,
            role: "ProjectMember" // default
        };
        memberSubmitted.value = false;
        showAddMemberDialog.value = true;
    };

    const userNameInput = ref('');
    const userSuggestions = ref<User[]>();
    const selectedUser = ref<User>();

    const searchUser = (event) => {
        bazaarApi.users.searchUser({search: event.query, per_page: 10})
            .then(response => response.data)
            .then(users => userSuggestions.value = users);
    };

    const submitMember = () => {
        inProgress.value = true;
        store.dispatch(ActionTypes.UpdateProjectMemberRole, {projectId: projectId, userId: selectedUser.value!.id, role: memberToAdd.value.role})
            .then(() => {
                showAddMemberDialog.value = false;
                inProgress.value = false;
            });
    };

    const showEditMemberDialog = ref(false);
    const memberToEdit = ref<ProjectMember>();

    const openEditMemberDialog = (member: ProjectMember) => {
        // IMPORTANT: clone here so we do not modify a Vuex state object!
        memberToEdit.value = {
            userId: member.userId,
            role: member.role,
            id: member.id,
        };
        showEditMemberDialog.value = true;
    };

    const submitUpdatedMember = () => {
        inProgress.value = true;
        store.dispatch(ActionTypes.UpdateProjectMemberRole, {
            projectId: projectId,
            userId: memberToEdit.value!.userId,
            role: memberToEdit.value!.role,
            memberId: memberToEdit.value?.id,
        })
            .then(() => {
                showEditMemberDialog.value = false;
                inProgress.value = false;
            });
    };

    const isModifyMembersAllowed = computed(() => {
        const role = project.value.userContext?.userRole;
        return oidcIsAuthenticated.value && (role === 'ProjectAdmin' || role === 'ProjectManager');
    });

    return {
      t,
      oidcIsAuthenticated,
      oidcUser,
      members,
      assignableRoles,
      showRemoveMemberDialog,
      showAddMemberDialog,
      confirmRemoveMember,
      warnRemoveActiveUser,
      removeMember,
      memberToRemove,
      openNewMemberDialog,
      memberToAdd,
      memberSubmitted,
      handleUserImageError,
      showDefaultUserIcon,
      submitMember,
      userNameInput,
      userSuggestions,
      selectedUser,
      searchUser,
      inProgress,
      openEditMemberDialog,
      memberToEdit,
      showEditMemberDialog,
      submitUpdatedMember,
      isModifyMembersAllowed,
    };
  }
})
</script>
