<template>
    <div v-if="issue_url" class="p-mb-3">
      <div class="dev-timeline-header">
        <h2>{{ t('devTimeline-title') }}</h2>
        <a v-if="issue_url" :href="issue_url" @click.stop="() => {} /*prevent click from triggering RequirementCard click*/"
          target="_blank" rel="noreferrer" class="p-ml-2 github-link">
          <i class="pi pi-github"></i> {{ t('viewOnGitHub') }}
        </a>
      </div>
      <Timeline
        :value="timelineEvents"
        :layout="windowWidth >= 768 ? 'horizontal' : 'vertical'"
        :align="windowWidth >= 768 ? 'bottom' : 'left'">
          <template #marker="slotProps">
            <span class="custom-marker">
              <i :class="slotProps.item.status"></i>
            </span>
          </template>
          <template #content="slotProps">
            {{slotProps.item.label}}
          </template>
      </Timeline>
    </div>
</template>

<script lang="ts">
import { defineComponent, ref, toRefs, computed } from 'vue';
import { useI18n } from 'vue-i18n';

import { useWindowSize } from '@/ui-utils/window-size';

export default defineComponent({
  name: 'RequirementDevTimeline',
  props: {
      // The additional properties of some requirement
      additionalProperties: {type: Object, required: false},
  },
  setup: (props) => {
    const { additionalProperties } = toRefs(props);
    const { locale, t } = useI18n({ useScope: 'global' });
    const { windowWidth, windowHeight } = useWindowSize();

    const issue_url = computed(() => {
      if (additionalProperties.value && additionalProperties.value.issue_url ) {
        return additionalProperties.value.issue_url
      }
    });

    // get issue's additionalProperties Descriptors & Values
    const additionalPropertiesValue = additionalProperties.value;

    if(additionalPropertiesValue === undefined || additionalPropertiesValue === null){
      var issueNumberValue = undefined;
      var issueStatusValue = undefined;

    } else{
        const issueNumberDescriptor = Object.getOwnPropertyDescriptor(additionalProperties.value, 'issue_number');
        issueNumberValue = issueNumberDescriptor?.value;
        const issueStatusDescriptor = Object.getOwnPropertyDescriptor(additionalProperties.value, 'issue_status');
        issueStatusValue = issueStatusDescriptor?.value;
    }

    // **** Functions to update the timeline icons *****
    // Requirement exported
    function timelineIssueNumber(){
    let timelineIssueNumberIcon = "pi pi-circle-off";
    if(issueNumberValue !== undefined){
        timelineIssueNumberIcon = "pi pi-check-circle";
    }
    return timelineIssueNumberIcon;
    };
    // Requirement opened or closed
    function timelineIssueStatus(){
    let timelineIssueStatusIcon = "pi pi-circle-off";
    if(issueStatusValue !== undefined){
        (issueStatusValue == "closed")
        ? timelineIssueStatusIcon = 'pi pi-check-circle'
        : (issueStatusValue == "opened")
            ? timelineIssueStatusIcon = 'pi pi-circle-off'
            : null;
    }
    return timelineIssueStatusIcon;
    };
    // Requirement Url (Development in Progress)
    function timelineIssueUrl(){
    let timelineIssueUrlIcon = "pi pi-circle-off";
    if(issue_url.value != undefined){
        timelineIssueUrlIcon = "pi pi-check-circle";
    }
    return timelineIssueUrlIcon;
    };

    //Timeline events
    const timelineEvents = ref([
        {label: t('devTimeline-requirementExported'), status: timelineIssueNumber()},
        {label: t('devTimeline-inProgress'), status: timelineIssueUrl()},
        {label: t('devTimeline-closed'), status: timelineIssueStatus()},
    ]);

      return { t, timelineEvents, issue_url, windowWidth };
  },

})
</script>

<style lang="scss" scoped>
.dev-timeline-header {
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
  padding-bottom: 1rem;
}

@media (min-width: 768px) {
  .dev-timeline-header {
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;
    margin-top: 1rem;
    padding-bottom: 0rem;
  }

  .dev-timeline-header h2 {
    margin-bottom: 0px;
    margin-top: 0px;
  }

  .dev-timeline-header .github-link {
    padding-left: 1rem;
  }
}
</style>

/* CSS customization for Primevue Timeline component  */
<style lang="scss">
.p-timeline-event-opposite {
  flex: 0 !important;
}
</style>
