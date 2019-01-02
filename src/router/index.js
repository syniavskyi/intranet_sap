import Vue from 'vue'
import Router from 'vue-router'

import store from '@/store/store'

import Login from '@/components/auth/Login'
import Registration from '@/components/auth/Registration'

import Dashboard from '@/components/content/Dashboard'
import News from '@/components/content/News'
import Profile from '@/components/content/Profile'
import Employees from '@/components/content/Employees'
import Calendar from '@/components/content/Calendar'
import Files from '@/components/content/Files'
import Availability from '@/components/content/Availability'
import StarterPage from '@/components/content/StarterPage'
import CV from '@/components/content/CV'
import Delegations from '@/components/content/Delegations'
import HolidayRequest from '@/components/content/availabilityComponents/HolidayRequest'

import AuthGuard from './auth-guard'

Vue.use(Router)

export default new Router({
    // mode: 'history',
    routes: [{
        path: '/',
        name: 'Login',
        component: Login
    },
    {
        path: '/registration',
        name: 'Registration',
        component: Registration,
        beforeEnter: AuthGuard
    },
    {
        path: '/dashboard',
        name: 'Dashboard',
        component: Dashboard,
        beforeEnter: AuthGuard
    },
    {
        path: '/news',
        name: 'News',
        component: News,
        beforeEnter: AuthGuard
    },
    {
        path: '/profile',
        name: 'Profile',
        component: Profile,
        beforeEnter: AuthGuard
    },
    {
        path: '/employees',
        name: 'Employees',
        component: Employees,
        beforeEnter: AuthGuard
    },
    {
        path: '/files',
        name: 'Files',
        component: Files,
        beforeEnter: AuthGuard
    },
    {
        path: '/calendar',
        name: 'Calendar',
        component: Calendar,
        beforeEnter: AuthGuard
    },
    {
        path: '/availability',
        name: 'Availability',
        component: Availability,
        beforeEnter: AuthGuard
    },
    {
        path: '/starterpage',
        name: 'StarterPage',
        component: StarterPage,
        beforeEnter: AuthGuard
    },
    {
        path: '/delegations',
        name: 'Delegations',
        component: Delegations,
        beforeEnter: AuthGuard
    },
    {
        path: '/cv',
        name: 'CV',
        component: CV,
        beforeEnter: AuthGuard
    },
    {
        path: '/holidayrequest',
        name: 'HolidayRequest',
        component: HolidayRequest,
        beforeEnter: AuthGuard
    }
],
linkExactActiveClass: 'active-router-link'
})

// Router.beforeEnter((to,from, next) => {
//     console.log(store)
// });

