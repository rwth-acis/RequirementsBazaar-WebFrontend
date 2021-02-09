<template>
	<div class="layout-topbar">
		<router-link class="p-link layout-menu-button" to="/">
			<img src="/reqbaz-logo.svg"> Requirements Bazaar
		</router-link>
	</div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'AppTopbar',
})
</script>

<style scoped>
	img {
    width: 29px;
    height: 29px;
    margin-right: 5px;
	}
</style>
