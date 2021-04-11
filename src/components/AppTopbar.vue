<template>
	<div class="layout-topbar">
		<router-link class="p-link layout-menu-button" to="/">
			<div class="title"><img src="/reqbaz-logo.svg"> Requirements Bazaar</div>
		</router-link>
		<div class="layout-topbar-icons">
			<select v-model="locale">
				<option v-for="locale in availableLocales" :key="`locale-${locale}`" :value="locale">{{ locale }}</option>
			</select>
			<i class="pi pi-bell" style="fontSize: 1.5rem" @click="toggleActivityOverlay"></i>
			<Button v-if="oidcIsAuthenticated" label="Logout" @click="removeOidcUser" />
			<Button v-else label="Sign in" @click="authenticateOidcPopup" />

			<OverlayPanel class="activityOverlay" ref="activityOverlay" appendTo="body" :showCloseIcon="false" style="width: 278px; height: 500px;">
        <ActivityTracker class="activityTracker"></ActivityTracker>
			</OverlayPanel>
		</div>
	</div>
</template>

<script lang="ts">
import { computed, defineComponent, watch, getCurrentInstance, ref } from 'vue';
import { useStore } from 'vuex';
import { useI18n } from 'vue-i18n';

import ActivityTracker from './ActivityTracker.vue';

export default defineComponent({
  name: 'AppTopbar',
	components: {
    ActivityTracker
  },
	setup: (props, context) => {
    const { locale, availableLocales } = useI18n({ useScope: 'global' });
		const store = useStore();
		const app = getCurrentInstance();

		watch(locale, (newLocale) => {
    	app?.appContext.config.globalProperties.$dayjs.locale(newLocale);
		});

		const oidcIsAuthenticated = computed(() => store.getters['oidcStore/oidcIsAuthenticated']);
		const authenticateOidcPopup = () => store.dispatch('oidcStore/authenticateOidcPopup');
		const removeOidcUser = () => store.dispatch('oidcStore/removeOidcUser');

		const activityOverlay = ref();
		const toggleActivityOverlay = (event) => {
			activityOverlay.value.toggle(event);
		}

    return { locale, availableLocales, oidcIsAuthenticated, authenticateOidcPopup, removeOidcUser, activityOverlay, toggleActivityOverlay };
  },
})
</script>

<style scoped>
	img {
    width: 29px;
    height: 29px;
    margin-right: 0.3em;
	}

	.title {
		display: flex;
		font-family: 'Ubuntu Condensed', sans-serif;
		font-size: 1.5em;
		align-items: center;
	}

	.layout-topbar-icons {
		display: flex;
		align-items: center;
	}

	.layout-topbar-icons > * {
		margin-left: 1rem;
	}

	i {
		cursor: pointer;
	}

	.activityTracker {
		height: 472px;
		overflow-y: scroll;
	}
</style>
