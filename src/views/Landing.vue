<template>
  <h1>Welcome to Requirements Bazaar!</h1>
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
