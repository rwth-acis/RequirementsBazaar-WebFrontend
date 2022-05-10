<template>
  <Card id="card">
    <template #header>
        <div id="header" :style="{ backgroundColor: hashStringToColor(name) }"></div>
    </template>
    <template #title>
      <div>{{ name }}</div>
      <div class="lastupdate p-d-flex p-ai-center" v-if="showCreationDate">
        <span :title="'created ' + $dayjs(creationDate).format('LLL')"><i class="pi pi-plus-circle"></i> created {{ $dayjs(creationDate).fromNow() }}</span>
      </div>
      <div class="lastupdate p-d-flex p-ai-center" v-if="!compact">
          <span :title="'last activity ' + $dayjs(lastActivity).format('LLL')"><i class="pi pi-user-edit"></i> {{ $dayjs(lastActivity).fromNow() }}</span>
        </div>
    </template>
    <template #content v-if="!compact">
        <vue3-markdown-it :source="description" />
    </template>
    <template #footer>
      <div id="footer">
        <div><span style="display: flex; align-items: center;" v-tooltip.bottom="t('followers')"><div v-html="followersIcon" class="icon" ></div> {{ numberOfFollowers }}</span></div>
        <div><span style="display: flex; align-items: center;" v-tooltip.bottom="t('categories')"><div v-html="categoriesIcon" class="icon"></div> {{ numberOfCategories }}</span></div>
        <div><span style="display: flex; align-items: center;" v-tooltip.bottom="t('requirements')"><div v-html="requirementsIcon" class="icon"></div> {{ numberOfRequirements }}</span></div>
      </div>
    </template>
  </Card>
</template>

<script lang="ts">
import { computed, ref, defineComponent, toRefs} from 'vue';
import { useI18n } from 'vue-i18n';

import { followersIcon, categoriesIcon, requirementsIcon } from '../assets/reqbaz-icons.js';

export default defineComponent({
  name: 'ProjectCard',
  props: {
    id: { type: Number, required: true },
    name: { type: String, required: true },
    description: { type: String, required: true },
    creationDate: { type: String, required: true },
    lastActivity: { type: String, required: true },
    numberOfCategories: { type: Number, required: true },
    numberOfRequirements: { type: Number, required: true },
    numberOfFollowers: { type: Number, required: true },
    compact: { type: Boolean, default: false},
    showCreationDate: { type: Boolean, default: false},
  },
  setup: (props, context) => {
    const { locale, t } = useI18n({ useScope: 'global' });
    const { lastActivity, creationDate, compact, showCreationDate } = toRefs(props);

    const activityDate = computed(() => lastActivity.value || creationDate.value);


    // thanks to https://stackoverflow.com/questions/11120840/hash-string-into-rgb-color/16533568#16533568
    const djb2: (str: string) => number = function(str: string) {
      let hash: number = 5381;
      for (let i = 0; i < str.length; i += 1) {
        hash = (hash << 5) + hash + str.charCodeAt(i); /* hash * 33 + c */
      }
      return hash;
    }
    const hashStringToColor: (str: string) => string = function(str: string) {
      const hash: number = djb2(str);
      const r = (hash & 0xff0000) >> 16;
      const g = (hash & 0x00ff00) >> 8;
      const b = hash & 0x0000ff;
      return `#${`0${r.toString(16)}`.substr(-2)}${`0${g.toString(16)}`.substr(-2)}${`0${b.toString(
        16,
      )}`.substr(-2)}`;
    }

    return {
      t,
      hashStringToColor,
      activityDate,
      followersIcon,
      categoriesIcon,
      requirementsIcon,
      compact,
      showCreationDate,
    };
  },

})
</script>

<style scoped>
  #card {
    overflow: hidden;
  }

  #header {
    height: 30px;
  }

  #footer {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
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
    margin-right: 5px;
  }

  .lastupdate {
    padding-top: 0.25em;
    font-weight: normal;
    font-size: 0.6em;
    color: #5d5d5d;
  }
</style>
