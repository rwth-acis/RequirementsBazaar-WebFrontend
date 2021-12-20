<template>
    <Avatar v-if="showDefaultIcon" icon="pi pi-user" shape="circle" size="large">
    </Avatar>
    <Avatar v-else shape="circle" size="large" label="bar">
        <img :alt="userName" :src="imageUrl" @error="handleImageError()" />
    </Avatar>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';

export default defineComponent({
  name: 'UserAvatar',
  props: {
      imageUrl: { type: String, required: true },
      userName: { type: String, required: true },
  },
  setup: () => {

    const showDefaultIcon = ref(false);

    const handleImageError = () => {
        console.log("image loading error");
        showDefaultIcon.value = true;
    };

    return { showDefaultIcon, handleImageError };
  },

})
</script>
