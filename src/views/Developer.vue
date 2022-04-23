<template>

  <h1>Developer</h1>

  <p class="p-mb-3">
    <i>Please note, that this resource is currently only available in English. We are sorry for any inconveniences!
    </i>
  </p>

  <p>Requirements Bazaar consists of a Java-based backend and an HTML5 frontend. The backend is driven by the
    peer-to-peer platform <a href="https://las2peer.org" target="_blank">las2peer</a> which is part of our research.
    The frontend is developed using Vue 3.</p>

  <ul>
    <li><a href="https://github.com/rwth-acis/RequirementsBazaar" target="_blank">
      https://github.com/rwth-acis/RequirementsBazaar</a>: This repository contains the code for the service
      backend.</li>
    <li><a href="https://github.com/rwth-acis/RequirementsBazaar-WebFrontend" target="_blank">
      https://github.com/rwth-acis/RequirementsBazaar-WebFrontend</a>: This repository contains the code for the Web
      frontend, the same that you are using right now.</li>
    <li><a href="https://github.com/rwth-acis/las2peer-ActivityTracker" target="_blank">
      https://github.com/rwth-acis/las2peer-ActivityTracker</a>: This repository contains the code for the Activity
      Tracker backend service that powers the activity tracker.</li>
    <li><a href="https://github.com/rwth-acis/activity-tracker" target="_blank">
      https://github.com/rwth-acis/activity-tracker</a>: This repository contains the code for the Activity
      Tracker Web component that asks the service above to fill its content.</li>
    <li><a href="https://github.com/rwth-acis/requirements-grid" target="_blank">
      https://github.com/rwth-acis/requirements-grid</a>: Yet another Web component. This one can be embedded on
      3rd-party websites to display a grid of requirements in a specific project and category. You can see an
      example on the <a href="https://wekit-community.org/ideas/" target="_blank">WEKIT Community website</a> where
      new ideas for Augmented Reality tools are collected.</li>
  </ul>

  <section>
    <h2>Requirements Bazaar API</h2>
    <p>
      Requirements Bazaar has a public API that can be used to access all the data that is shown in this web frontend.
      You can find the <i>swagger.json</i> <a href="https://requirements-bazaar.org/bazaar/swagger.json" target="_blank" rel="noopener">here</a>.
    </p>
    <p>
      Also, you can use <a href="https://requirements-bazaar.org/docs/#/projects" target="_blank" rel="noopener">Swagger UI</a> to browse and explore the API directly in the browser.
    </p>
  </section>

</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'Developer',
  props: {
  },
  setup: () => {
    return {}
  }
})
</script>

<style scoped>
</style>
