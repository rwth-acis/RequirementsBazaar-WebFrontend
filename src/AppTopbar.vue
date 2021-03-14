<template>
	<div class="layout-topbar">
		<router-link class="p-link layout-menu-button" to="/">
			<img src="/reqbaz-logo.svg"> Requirements Bazaar
		</router-link>
		<div class="layout-topbar-icons">
			<select v-model="locale">
				<option v-for="locale in availableLocales" :key="`locale-${locale}`" :value="locale">{{ locale }}</option>
			</select>
		</div>
	</div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { useI18n } from 'vue-i18n';

export default defineComponent({
  name: 'AppTopbar',
	setup: () => {
    const { locale, availableLocales } = useI18n({ useScope: 'global' });
    return { locale, availableLocales }
  }
})
</script>

<style scoped>
	img {
    width: 29px;
    height: 29px;
    margin-right: 5px;
	}
</style>
