<template>
  <Card id="card">
    <template #title>
      <div>{{ name }}</div>
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
import { defineComponent } from 'vue'

import { followersIcon, requirementsIcon } from '../assets/reqbaz-icons.js';

export default defineComponent({
  name: 'CategoryCard',
  props: {
    id: { type: Number, required: true },
    name: { type: String, required: true },
    description: { type: String, required: true },
    numberOfRequirements: { type: Number, required: true },
    numberOfFollowers: { type: Number, required: true },
  },
  setup: () => {
    return { followersIcon, requirementsIcon };
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
</style>
