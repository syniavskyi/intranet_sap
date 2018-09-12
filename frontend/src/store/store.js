import Vue from 'vue'
import Vuex from 'vuex'
import login from './modules/login'
import registration from './modules/registration'
import dashboard from './modules/dashboard'
import shared from './modules/shared'
import profile from './modules/profile'
import employees from './modules/employees'
import calendar from './modules/calendar'
import menu from './modules/menu'
import availability from './modules/availability'
import dataloading from './modules/dataloading'
import starterpage from './modules/starterpage'
import delegations from './modules/delegations'
import accomodationCosts from './modules/delegationComponents/accomodationCosts'
import otherCosts from './modules/delegationComponents/otherCosts'
import travelCosts from './modules/delegationComponents/travelCosts'
import advanceTable from './modules/delegationComponents/advanceTable'
import news from './modules/news'
import userEducation from './modules/profileComponents/userEducation'
import userExperience from './modules/profileComponents/userExperience'
import userProjects from './modules/profileComponents/userProjects'
import userSkills from './modules/profileComponents/userSkills'
import availLeaves from './modules/availabilityComponents/availLeaves'
import availProjects from './modules/availabilityComponents/availProjects'
import cv from './modules/cv'

import settings from './modules/settings'

Vue.use(Vuex);

// const store = new Vuex.Store({
export default new Vuex.Store({
    modules: {
        login,
        registration,
        dashboard,
        shared,
        profile,
        employees,
        calendar,
        menu,
        availability,
        dataloading,
        settings,
        starterpage,
        delegations,
        accomodationCosts,
        otherCosts,
        travelCosts,
        advanceTable,
        news,
        userEducation,
        userExperience,
        userProjects,
        userSkills,
        availLeaves,
        availProjects,
        cv
    }
});