<template>
	<header class="header">
		<!-- Logo -->
        <router-link class="logo" to="/" @click="closeMenu">
			<div class="title"><embed src="/reqbaz-logo.svg" class="icon" /> Requirements Bazaar</div>
		</router-link>

		<!-- Hamburger Menu Button-->
        <input class="side-menu" type="checkbox" id="side-menu"/>
        <label class="hamb" for="side-menu"><span class="hamb-line"></span></label>

		<!-- Navigation -->
        <nav class="nav">
            <ul class="menu">
				<li v-if="oidcIsAuthenticated">
					<router-link class="p-link" to="/home" @click="closeMenu">
						<div class="menu-item">{{t('dashboard')}}</div>
					</router-link>
				</li>
				<li>
					<router-link class="p-link" to="/projects" @click="closeMenu">
						<div class="menu-item">{{t('publicProjects')}}</div>
					</router-link>
				</li>
				<li>
					<Dropdown v-model="locale" :options="availableLocaleNames" optionLabel="name" optionValue="code" @change="closeMenu" />
				</li>
				<li>
					<i class="pi pi-bell" @click="toggleActivityOverlay"></i>
				</li>
				<li>
					<Button v-if="oidcIsAuthenticated" :label="t('logout')" @click="closeMenu(); removeOidcUser();" />
					<Button v-else :label="t('signIn')" @click="closeMenu(); authenticateOidcPopup();" />
				</li>
			</ul>
        </nav>
		<OverlayPanel class="activityOverlay" ref="activityOverlay" appendTo="body" :showCloseIcon="false" style="width: 278px; height: 500px;">
			<ActivityTracker class="activityTracker"></ActivityTracker>
		</OverlayPanel>
    </header>
</template>

<script lang="ts">
import { computed, defineComponent, watch, getCurrentInstance, ref } from 'vue';
import { useStore } from 'vuex';
import { useI18n } from 'vue-i18n';
import { useRouter } from 'vue-router';
import Cookies from 'js-cookie';

import ActivityTracker from './ActivityTracker.vue';

export default defineComponent({
  name: 'AppTopbar',
	components: {
    ActivityTracker
  },
	setup: (props, context) => {
        const { t, locale, availableLocales } = useI18n({ useScope: 'global' });
		const store = useStore();
		const app = getCurrentInstance();
		const { push } = useRouter();

		watch(locale, (newLocale) => {
    	  app?.appContext.config.globalProperties.$dayjs.locale(newLocale);
		  Cookies.set('locale', newLocale);
		});

		const oidcIsAuthenticated = computed(() => store.getters['oidcStore/oidcIsAuthenticated']);
		const authenticateOidcPopup = () => store.dispatch('oidcStore/authenticateOidcPopup');
		const removeOidcUser = () => store.dispatch('oidcStore/removeOidcUser');

		const closeMenu = () => {
			document.getElementById("side-menu").checked = false;
		};

		const activityOverlay = ref();
		const toggleActivityOverlay = (event) => {
			if (window.innerWidth < 768) {
				event.preventDefault();
				// navigate to activity tracker page instead of opening the overlay
				push('/activity-tracker');
				closeMenu();
			} else {
				activityOverlay.value.toggle(event);
			}
		}

		const availableLocaleNames = ref([
			{name: 'Deutsch', code: 'de'},
			{name: 'English', code: 'en'},
			{name: 'فارسی', code: 'fa'},
			{name: 'Français', code: 'fr'},
			{name: 'Italiano', code: 'it'},
			{name: 'Norsk Bokmål', code: 'nb'},
			{name: 'Română', code: 'ro'},
			{name: 'Shqip', code: 'sq'},
		]);

    return { t, locale, availableLocaleNames, oidcIsAuthenticated, authenticateOidcPopup, removeOidcUser, activityOverlay, toggleActivityOverlay, closeMenu };
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
		height: 100%;
		font-family: 'Ubuntu Condensed', sans-serif;
		font-size: 1.5em;
		font-weight: bold;
		align-items: center;
	}

	i {
		cursor: pointer;
		font-size: 1.5rem;
		position: relative;
		top: 0.2rem;
	}

	.activityTracker {
		height: 472px;
		overflow-y: scroll;
	}
</style>
