<template>
  <Card id="card">
    <template #header>
        <div id="header" :style="{ backgroundColor: hashStringToColor(name) }"></div>
    </template>
    <template #title>
      <div>{{ name }}</div>
    </template>
    <template #content>
        <div>{{ description }}</div>
    </template>
    <template #footer>
        <div>{{ numberOfFollowers }}</div>
        <div>{{ numberOfCategories }}</div>
        <div>{{ numberOfRequirements }}</div>
    </template>
  </Card>
</template>

<script lang="ts">
import { ref, defineComponent } from 'vue'

export default defineComponent({
  name: 'ProjectCard',
  props: {
    id: { type: Number, required: true },
    name: { type: String, required: true },
    description: { type: String, required: true },
    numberOfCategories: { type: Number, required: true },
    numberOfRequirements: { type: Number, required: true },
    numberOfFollowers: { type: Number, required: true },
  },
  setup: (props, context) => {

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



    return { hashStringToColor };
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
</style>
