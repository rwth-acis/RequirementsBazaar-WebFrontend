import { createApp } from 'vue';
import { router } from './router';
import { store } from "./store";
import { createI18n } from 'vue-i18n'
import App from './App.vue';

import messages from '@intlify/vite-plugin-vue-i18n/messages';

import VueMarkdownIt from 'vue3-markdown-it';

import PrimeVue from 'primevue/config';
import Avatar from 'primevue/avatar';
import Button from 'primevue/button';
import Card from 'primevue/card';
import Dropdown from 'primevue/dropdown';
import Editor from 'primevue/editor';
import InputText from 'primevue/inputtext';
import SelectButton from 'primevue/selectbutton';
import TabView from 'primevue/tabview';
import TabPanel from 'primevue/tabpanel';

import 'primevue/resources/themes/saga-blue/theme.css';
import 'primevue/resources/primevue.min.css';
import 'primeflex/primeflex.css';
import 'primeicons/primeicons.css';
import './assets/layout/layout.scss';

const app = createApp(App);
const i18n = createI18n({
  legacy: false,
  locale: 'en',
  fallbackLocale: 'en',
  messages
});

app.use(router);
app.use(store);
app.use(PrimeVue);
app.use(i18n);
app.use(VueMarkdownIt);

app.component('Avatar', Avatar);
app.component('Button', Button);
app.component('Card', Card);
app.component('Dropdown', Dropdown);
app.component('Editor', Editor);
app.component('InputText', InputText);
app.component('SelectButton', SelectButton);
app.component('TabView', TabView);
app.component('TabPanel', TabPanel);

app.mount('#app');
