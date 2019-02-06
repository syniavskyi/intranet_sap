// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import VueAxios from 'vue-axios'
import axios from 'axios'
import Vuelidate from 'vuelidate'
import Vuex from 'vuex'
import Icon from 'vue-awesome/icons'
import i18n from './lang/lang'
import store from './store/store'
import VCalendar from 'v-calendar';
import 'v-calendar/lib/v-calendar.min.css';
import { resolve } from 'url';

Vue.use(Vuelidate)
Vue.use(Vuex)
Vue.use(VueAxios, axios)
Vue.use(VCalendar, {
    firstDayOfWeek: 2,
    locale: 'pl-PL'
});

Vue.component('icon', Icon)

require('./assets/styles/style.css');
require('./assets/styles/shared.css');
require('./assets/styles/login/login.css');
require('./assets/styles/profile/profile.css');
require('./assets/styles/registration/registration.css');
// require('./assets/styles/dashboard/dashboard.css');
require('./assets/styles/starterPage/starterPage.css');
require('./assets/styles/availability/availability.css');
require('./assets/styles/employees/employees.css');
require('./assets/styles/files/files.css');
require('./assets/styles/delegations/delegations.css');
require('./assets/styles/calendar/calendar.css');
require('./assets/styles/news/news.css');
require('./assets/styles/pdf/pdf.css');
require('./assets/styles/cd.css');
require('./assets/styles/modals.css');


Vue.config.productionTip = false

axios.defaults.baseURL = window.location.origin + "/api/sap/opu/odata/sap/ZGW_INTRANET_SRV/";

axios.interceptors.response.use(function (config) {
    if (config.status === 413) {
        throw config
    } else {
        return config
    }
})
axios.interceptors.request.use(null, (error) => {
    if (error.status === 413) {
        throw config
    } else {
        return config
    }
})

export const app = new Vue({
    el: '#app',
    router,
    store,
    i18n,
    components: {
        App
    },
    template: '<App/>',
    render: h => h(App)
})
