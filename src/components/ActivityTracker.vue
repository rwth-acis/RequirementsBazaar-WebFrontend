<template>
  <div class="activitiesList">
    <div v-for="activity in activities" :key="activity.id">
      {{ activity.activityAction }}
    </div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent } from 'vue';
import { useStore } from 'vuex';
import { ActionTypes } from '../store/actions';

export default defineComponent({
  name: 'ActivityTracker',
  props: {
  },
  setup: (props, context) => {
    const store = useStore();

    const parameters = computed(() => {return {limit: 10}});
    const activities = computed(() => store.getters.activitiesList(parameters.value));
    store.dispatch(ActionTypes.FetchActivities, {query: parameters.value});

    return { activities };
  },

})
</script>

<style scoped>
  .activitiesList {
    width: 100%;
    height: 100%;
    background-color: #f5f5f5;
  }
</style>
