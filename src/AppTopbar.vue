<template>
	<div class="layout-topbar">
		<router-link class="p-link layout-menu-button" to="/">
			<div class="title"><img src="/reqbaz-logo.svg"> Requirements Bazaar</div>
		</router-link>
		<div class="layout-topbar-icons">
			<select v-model="locale">
				<option v-for="locale in availableLocales" :key="`locale-${locale}`" :value="locale">{{ locale }}</option>
			</select>
			<Button v-if="oidcIsAuthenticated" label="Logout" @click="signOut" />
			<Button v-else label="Sign in" @click="authenticateOidcPopup" />
		</div>
	</div>
</template>

<script lang="ts">
import { computed, defineComponent, watch, getCurrentInstance } from 'vue';
import { mapGetters, mapActions } from 'vuex';
import { useI18n } from 'vue-i18n';

export default defineComponent({
  name: 'AppTopbar',
	setup: (props, context) => {
    const { locale, availableLocales } = useI18n({ useScope: 'global' });
		const app = getCurrentInstance();
		watch(locale, (newLocale) => {
    	app?.appContext.config.globalProperties.$dayjs.locale(newLocale);
		});
    return { locale, availableLocales };
  },
	computed: {
    ...mapGetters('oidcStore', [
      'oidcIsAuthenticated'
    ]),
  },
	methods: {
    ...mapActions('oidcStore', [
      'authenticateOidcPopup',
      'removeOidcUser'
    ]),
		signOut: function () {
      this.removeOidcUser();
    },
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
		align-items: centered;
	}
</style>
