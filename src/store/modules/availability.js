import axios from 'axios'
let utils = require('../../utils')

const state = {
    hasDataChanged: false,
    editError: false,
    addingError: false,
    saveDataSuccess: false,
    removeSuccess: false,
    removeError: false,
    dataToRead: ["NewToken", "Domains", "Industries", "UserData", "UserList", "Projects", "Contractors"],
    avaliablityAuth: "",
    availAccAuth: "",
    disabledBtnToEditAvail: false,
    disabledBtnToEditProject: false,
    filteredTeamUsers: []
};

const mutations = {
    SET_HAS_DATA_CHANGED(state, hasChanged) {
        state.hasDataChanged = hasChanged
    },
    SET_EDIT_ERROR(state, isError) {
        state.editError = isError
    },
    SET_ADDING_ERROR(state, isError) {
        state.addingError = isError
    },
    SET_REMOVE_ERROR(state, isError) {
        state.removeError = isError
    },
    SET_SAVE_DATA_SUCCESS(state, isSuccess) {
        state.saveDataSuccess = isSuccess
    },
    SET_REMOVE_SUCCESS(state, isSuccess) {
        state.removeSuccess = isSuccess
    },
    SET_AVAILABILITY_AUTH(state, sAuth){
        state.avaliablityAuth = sAuth;
    },
    SET_AVAIL_ACCEPT_AUTH(state, sAuth){
        state.availAccAuth = sAuth;
    },
    SET_DISABLED_BTN_TO_EDIT_AVAIL(state, data) {
        state.disabledBtnToEditAvail = data;
    },
    SET_DISABLED_BTN_TO_EDIT_PROJECT(state, data) {
        state.disabledBtnToEditProject = data;
    },
    SET_FILTERED_TEAM_USERS(state, data) {
        state.filteredTeamUsers = data;
    }
};

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
    hideAllMessages({commit}){
        commit('SET_EDIT_ERROR', false)
        commit('SET_ADDING_ERROR', false)
        commit('SET_REMOVE_ERROR', false)
        commit('SET_SAVE_DATA_SUCCESS', false)
        commit('SET_REMOVE_SUCCESS', false)
    },
    // validateNewEngag({dispatch, getters},engag) {
    //     const newProject = getters.getNewProjectForUser
    //     if (engag < 0) newProject.engag = null;
    //     if (engag > 100) newProject.engag = 100;
    //     dispatch('validateNewProject')
    // }
};

const getters = {
    getHasDataChanged(state) {
        return state.hasDataChanged
    },
    getRemoveError(state){
        return state.removeError
    },
    getEditError(state){
        return state.editError
    },
    getAddingError(state){
        return state.addingError
    },
    getSaveDataSucccess(state){
        return state.saveDataSuccess
    },
    getRemoveSuccess(state){
        return state.removeSuccess
    },
    getAvailabilityToRead(state){
        return state.dataToRead;
    },
    getAvailabilityAuth(state){
        return state.avaliablityAuth;
    },
    getAvailAcceptAuth(state){
        return state.availAccAuth;
    },
    getDisabledBtnToEditAvail(state) {
        return state.disabledBtnToEditAvail;
    },
    getDisabledBtnToEditProject(state) {
        return state.disabledBtnToEditProject;
    },
    getFilteredTeamUsers(state) {
        return state.filteredTeamUsers;
    }

};

export default {
    state,
    mutations,
    actions,
    getters
}