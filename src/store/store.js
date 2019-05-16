import Vue from 'vue'
import Vuex from 'vuex'
import login from './modules/login'
import registration from './modules/registration'
import profile from './modules/profile'
import calendar from './modules/calendar'
import menu from './modules/menu'
import availability from './modules/availability'
import dataloading from './modules/dataloading'
import starterpage from './modules/starterpage'
import delegations from './modules/delegations'
import accomodationCosts from './modules/delegationComponents/accomodationCosts'
import delegationCosts from './modules/delegationComponents/delegationCosts'
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
import toast from './modules/toast'
import loader from './modules/loader'
import confirmDialog from './modules/confirmdialog'
import dialogs from './modules/dialogs'
import files from './modules/files'
import reservation from './modules/reservation'

import settings from './modules/settings'

Vue.use(Vuex);

// const store = new Vuex.Store({
export default new Vuex.Store({
    modules: {
        login,
        registration,
        profile,
        calendar,
        menu,
        availability,
        dataloading,
        settings,
        starterpage,
        delegations,
        accomodationCosts,
        delegationCosts,
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
        cv,
        toast,
        confirmDialog,
        loader,
        files,
        dialogs,
        reservation
    }
});