import { createApp } from 'vue';
import { router } from './router';
import { store } from "./store";
import { createI18n } from 'vue-i18n'
import App from './App.vue';

import messages from '@intlify/vite-plugin-vue-i18n/messages';

import VueMarkdownIt from 'vue3-markdown-it';
import dayjs from 'dayjs';
import localizedFormat from 'dayjs/plugin/localizedFormat';
import relativeTime from 'dayjs/plugin/relativeTime';
import 'dayjs/locale/de';
import 'dayjs/locale/en';
import 'dayjs/locale/fa';
import 'dayjs/locale/fr';
import 'dayjs/locale/it';
import 'dayjs/locale/nb';
import 'dayjs/locale/ro';
import 'dayjs/locale/sq';

import PrimeVue from 'primevue/config';
import Avatar from 'primevue/avatar';
import AutoComplete from 'primevue/autocomplete';
import BadgeDirective from 'primevue/badgedirective';
import Button from 'primevue/button';
import Card from 'primevue/card';
import ConfirmationService from 'primevue/confirmationservice';
import ConfirmDialog from 'primevue/confirmdialog';
import ConfirmPopup from 'primevue/confirmpopup';
import Dialog from 'primevue/dialog';
import Dropdown from 'primevue/dropdown';
import Editor from 'primevue/editor';
import InputText from 'primevue/inputtext';
import Menu from 'primevue/menu';
import OverlayPanel from 'primevue/overlaypanel';
import ScrollTop from 'primevue/scrolltop';
import SelectButton from 'primevue/selectbutton';
import Skeleton from 'primevue/skeleton';
import TabMenu from 'primevue/tabmenu';
import TabView from 'primevue/tabview';
import TabPanel from 'primevue/tabpanel';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import Toolbar from 'primevue/toolbar';
import ProgressBar from 'primevue/progressbar';

import 'primevue/resources/themes/saga-green/theme.css';
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

dayjs.extend(localizedFormat);
dayjs.extend(relativeTime);

app.use(router);
app.use(store);
app.use(PrimeVue);
app.use(i18n);
app.use(VueMarkdownIt);
app.config.globalProperties.$dayjs = dayjs;

app.directive('badge', BadgeDirective);

app.use(ConfirmationService);
app.component('Avatar', Avatar);
app.component('AutoComplete', AutoComplete);
app.component('Button', Button);
app.component('Card', Card);
app.component('ConfirmDialog', ConfirmDialog);
app.component('ConfirmPopup', ConfirmPopup);
app.component('Dialog', Dialog);
app.component('Dropdown', Dropdown);
app.component('Editor', Editor);
app.component('InputText', InputText);
app.component('Menu', Menu);
app.component('OverlayPanel', OverlayPanel);
app.component('ScrollTop', ScrollTop);
app.component('SelectButton', SelectButton);
app.component('Skeleton', Skeleton);
app.component('TabMenu', TabMenu);
app.component('TabView', TabView);
app.component('TabPanel', TabPanel);
app.component('DataTable', DataTable);
app.component('Column', Column);
app.component('Toolbar', Toolbar);
app.component("ProgressBar", ProgressBar);

app.mount('#app');
