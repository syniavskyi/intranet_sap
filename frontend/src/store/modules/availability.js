import axios from 'axios'
let utils = require('../../utils')

const state = {
    hasDataChanged: false,
    editError: false,
    addingError: false,
    saveDataSuccess: false,
    removeSuccess: false,
    removeError: false
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



};

export default {
    state,
    mutations,
    actions,
    getters
}