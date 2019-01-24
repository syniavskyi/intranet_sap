import axios from 'axios'
let utils = require('../../utils')

const state = {
    hasDataChanged: false,
    dataToRead: ["NewToken", "Domains", "Industries", "UserData", "UserList", "Projects", "Contractors", "Availabilities", "AvailProjects"],
    avaliablityAuth: "",
    availAccAuth: "",
    disabledBtnToEditAvail: false,
    filteredTeamUsers: []
}

const mutations = {
    SET_HAS_DATA_CHANGED(state, hasChanged) {
        state.hasDataChanged = hasChanged
    },
    SET_AVAILABILITY_AUTH(state, sAuth){
        state.avaliablityAuth = sAuth
    },
    SET_AVAIL_ACCEPT_AUTH(state, sAuth){
        state.availAccAuth = sAuth
    },
    SET_DISABLED_BTN_TO_EDIT_AVAIL(state, data) {
        state.disabledBtnToEditAvail = data
    },
    SET_FILTERED_TEAM_USERS(state, data) {
        state.filteredTeamUsers = data
    }
}

const actions = {
   checkIfDataChanged({commit, dispatch, getters}, project) {
        let currentData = Object.assign({}, project),
        beforeEditing = Object.assign({}, getters.getBeforeEditingCache),
        currDataProps = Object.getOwnPropertyNames(currentData),
        beforeDataProps = Object.getOwnPropertyNames(beforeEditing)

        for (var i = 0; i < beforeDataProps.length; i++) {
            var propName = beforeDataProps[i];
            if (currentData[propName] !== beforeEditing[propName]) {
                commit('SET_HAS_DATA_CHANGED', true)
                return
            } else {
                commit('SET_HAS_DATA_CHANGED', false)
            }
        }
    },
    // validateNewEngag({dispatch, getters},engag) {
    //     const newProject = getters.getNewProjectForUser
    //     if (engag < 0) newProject.engag = null;
    //     if (engag > 100) newProject.engag = 100;
    //     dispatch('validateNewProject')
    // }
}

const getters = {
    getHasDataChanged(state) {
        return state.hasDataChanged
    },
    getAvailabilityToRead(state){
        return state.dataToRead
    },
    getAvailabilityAuth(state){
        return state.avaliablityAuth;
    },
    getAvailAcceptAuth(state){
        return state.availAccAuth
    },
    getDisabledBtnToEditAvail(state) {
        return state.disabledBtnToEditAvail
    },
    getFilteredTeamUsers(state) {
        return state.filteredTeamUsers
    }
}

export default {
    state,
    mutations,
    actions,
    getters
}