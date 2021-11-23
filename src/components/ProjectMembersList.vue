<template>
    <div class="card" v-if="members">
        <DataTable :value="members" rowGroupMode="subheader" groupRowsBy="role"
            sortMode="single" sortField="name" :sortOrder="1" scrollable scrollHeight="800px">
            <Column field="userName" header="User">
                <template #body="slotProps">
                    <!-- Shows a default icon if profile image loading fails (currently always the case!) -->
                    <i v-if="showDefaultUserIcon[slotProps.data.userId] === true"
                        class="pi pi-user p-pr-3" style="fontSize: 1rem; vertical-align: middle;"></i>
                    <img v-else
                        :alt="slotProps.data.userName"
                        :src="slotProps.data.userProfileImage"
                        @error="handleUserImageError(slotProps.data.userId)"
                        width="32" style="vertical-align: middle" class="p-pr-3" />
                    <span class="image-text">{{slotProps.data.userName}}</span>
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
                    <Button icon="pi pi-pencil" class="p-button-rounded p-button-success p-mr-2" @click="editProduct(slotProps.data)" />
                    <Button icon="pi pi-trash" class="p-button-rounded p-button-danger" @click="confirmRemoveMember(slotProps.data)" />
                </template>
            </Column>
            <template #groupheader="slotProps">
                <!--<i class="pi pi-user-plus p-pr-3" style="fontSize: 2rem; vertical-align: middle;"></i>-->
                <h3>{{slotProps.data.role}}s</h3>
            </template>
        </DataTable>
    </div>

    <Dialog v-model:visible="showRemoveMemberDialog" :style="{width: '450px'}" header="Confirm" :modal="true">
        <div class="confirmation-content">
            <i class="pi pi-exclamation-triangle p-mr-3" style="font-size: 2rem" />
            <span v-if="memberToRemove">Are you sure you want to remove member <b>{{memberToRemove.userName}}</b> from the project?</span>
        </div>
        <template #footer>
            <Button label="No" icon="pi pi-times" class="p-button-text" @click="showRemoveMemberDialog = false"/>
            <Button label="Yes" icon="pi pi-check" class="p-button-text" @click="removeMember(memberToRemove)" />
        </template>
    </Dialog>
</template>

<script lang="ts">
import { computed, ref, defineComponent, onMounted } from 'vue'
import { useStore } from 'vuex';
import { useI18n } from 'vue-i18n';
import { ActionTypes } from '../store/actions';
import { ProjectMember } from '../types/bazaar-api';

export default defineComponent({
  name: 'ProjectMembersList',
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

    const members = computed(() => store.getters.getProjectMembers(projectId));
    store.dispatch(ActionTypes.FetchProjectMembers, projectId);

    // a boolean map indicatng when to show default user icon instead of profile image
    const showDefaultUserIcon = ref({});

    const handleUserImageError = (userId) => {
        showDefaultUserIcon.value[userId] = true;
        showDefaultUserIcon.value = showDefaultUserIcon.value;
    };

    const assignableRoles = ["ProjectMember", "ProjectAdmin", "ProjectManager"];

    const memberToRemove = ref();
    const showRemoveMemberDialog = ref(false);

    const confirmRemoveMember = (member: ProjectMember) => {
        memberToRemove.value = member;
        showRemoveMemberDialog.value = true;
    };

    const removeMember = (member: ProjectMember) => {

        // TODO run action

        showRemoveMemberDialog.value = false;
    };

    return {
      t,
      oidcIsAuthenticated,
      oidcUser,
      members,
      assignableRoles,
      showRemoveMemberDialog,
      confirmRemoveMember,
      removeMember,
      memberToRemove,
      handleUserImageError,
      showDefaultUserIcon
    };
  }
})
</script>
