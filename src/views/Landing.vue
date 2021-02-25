<template>
  <h1>Welcome to Requirements Bazaar!</h1>
  <h2 style="color:red;">
    This is the BETA environment of Requirements Bazaar, not intended for productive usage, we might delete data here at any time.
    For productive use (even if it's just a test project) please go to the main instance.
  </h2>
  <router-link to="/projects">Projects List</router-link>
</template>

<script lang="ts">
import { ref, defineComponent } from 'vue';

export default defineComponent({
  name: 'Landing',
  props: {
  },
  setup: () => {
    return {}
  }
})
</script>

<style scoped>
</style>
