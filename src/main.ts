import { createApp } from 'vue';
import { router } from './router';
import { store } from "./store";
import App from './App.vue';

import PrimeVue from 'primevue/config';
import InputText from 'primevue/inputtext';

import 'primevue/resources/themes/saga-blue/theme.css';
import 'primevue/resources/primevue.min.css';
import 'primeflex/primeflex.css';
import 'primeicons/primeicons.css';
import './assets/layout/layout.scss';

const app = createApp(App);

app.use(router);
app.use(store);
app.use(PrimeVue);

app.component('InputText', InputText);

app.mount('#app');