<template>
  <Card id="card">
    <template #title>
      <div>{{ name }}</div>
      <div class="lastupdate p-d-flex p-ai-center" v-if="showCreationDate">
        <span :title="'created ' + $dayjs(creationDate).format('LLL')"><i class="pi pi-plus-circle"></i> created {{ $dayjs(creationDate).fromNow() }}</span>
      </div>
      <div class="lastupdate p-d-flex p-ai-center" v-if="!compact">
          <span :title="'last activity ' + $dayjs(lastActivity).format('LLL')"><i class="pi pi-user-edit"></i> {{ $dayjs(lastActivity).fromNow() }}</span>
      </div>
    </template>
    <template #content>
      <vue3-markdown-it :source="description" />
    </template>
    <template #footer>
      <div id="footer">
        <div><div v-html="followersIcon" class="icon"></div> {{ numberOfFollowers }}</div>
        <div><div v-html="requirementsIcon" class="icon"></div> {{ numberOfRequirements }}</div>
      </div>
    </template>
  </Card>
</template>

<script lang="ts">
import { computed, defineComponent, toRefs } from 'vue'
import { useI18n } from 'vue-i18n';

import { followersIcon, requirementsIcon } from '../assets/reqbaz-icons.js';

export default defineComponent({
  name: 'CategoryCard',
  props: {
    id: { type: Number, required: true },
    name: { type: String, required: true },
    description: { type: String, required: true },
    creationDate: { type: String, required: true },
    lastActivity: { type: String, required: true },
    numberOfRequirements: { type: Number, required: true },
    numberOfFollowers: { type: Number, required: true },
    showCreationDate: { type: Boolean, default: false },
  },
  setup: (props, context) => {
    const { locale, t } = useI18n({ useScope: 'global' });
    const { lastActivity, creationDate, showCreationDate } = toRefs(props);

    return {
      t,
      lastActivity,
      creationDate,
      showCreationDate,
      followersIcon,
      requirementsIcon
    };
  },

})
</script>

<style scoped>
  #card {
    overflow: hidden;
  }

  #footer {
    display: flex;
    flex-direction: row;
    border-top: 1px solid #e8e8e8;
    padding: 0 16px;
    padding-top: 10px;
    color: #757575;
  }

  #footer > div {
    flex: 1;
    display: flex;
    flex-direction: row;
    align-items: center;
  }

  .icon {
    width: 24px;
    height: 24px;
    fill: #757575;
    margin-right: 10px;
  }

  .lastupdate {
    padding-top: 0.25em;
    font-weight: normal;
    font-size: 0.6em;
    color: #5d5d5d;
  }
</style>
