import axios from 'axios'

const state = {
    userProjects: [],
    disableSaveNewProject: true,
    disableSaveEditProject: true,
    beforeEditingCache: null,
    hasDataChanged: false,
    userId: null,
    editError: false,
    addingError: false,
    saveDataSuccess: false,
    removeSuccess: false,
    removeError: false,
    newProjectForUser: {
        userId: null,
        projectId: null,
        contractorId: null,
        engag: null,
        statusId: null,
        notes: null
    },
    projectToEdit: {}
};

const mutations = {
    SET_USER_PROJECTS(state, userProjects) {
        state.userProjects = userProjects
    },
    SET_NEW_PROJECT_FOR_USER(state, project) {
        state.newProjectForUser = project
    },
    SET_PROJECT_TO_EDIT(state, project) {
        state.projectToEdit = project
    },
    SET_DISABLE_SAVE_NEW(state, isDisabled) {
        state.disableSaveNewProject = isDisabled
    },
    SET_DISABLE_SAVE_EDIT(state, isDisabled) {
        state.disableSaveEditProject = isDisabled
    },
    SET_BEFORE_EDIT_CACHE(state, cache) {
        state.beforeEditingCache = cache
    },
    SET_HAS_DATA_CHANGED(state, hasChanged) {
        state.hasDataChanged = hasChanged
    },
    SET_USER_ID(state, userId) {
        state.userId = userId
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
    getUserProjects({commit, dispatch, getters}, userId) {
    //get user projects for calendar and editing projects 
        const URL = "/api/users/" + userId + "/userEngag"
         axios.get(URL).then(res => {
             console.log(res)
            const userProjects = res.data
            dispatch('setUserProjects', userProjects)
            commit('SET_PROJECT_TO_EDIT', {})
        }).catch(error => {
            console.log(error)
        });
    },
    setUserProjects({commit, getters}, userProjects){
    // set projects data with props for calendar 
        const projectsList = getters.projectsList
            for (let i=0; i<userProjects.length; i++) {
                for (let j=0; j<projectsList.length; j++){
                    if (userProjects[i].projId === projectsList[j].id) {
                        userProjects[i].projName = projectsList[j].name
                    } 
                }
            }
            for (let i=0; i<userProjects.length; i++) {
                if (userProjects[i].engag === "100") {
                    userProjects[i].color = '#EDA1A1'
                    userProjects[i].order = 2
                } else {
                    userProjects[i].color = '#fde692'
                    userProjects[i].order = 1
                }
                userProjects[i].startDate = new Date(userProjects[i].startDate)
                userProjects[i].endDate = new Date(userProjects[i].endDate)
            }
            commit('SET_USER_PROJECTS', userProjects)
    },
    removeUserProject({commit, getters, dispatch}, data) {
        const URL = "/api/users/" + data.userId + "/userEngag/" + data.projectId + "/delete"
        axios.delete(URL).then(res => {
            console.log(res)
            dispatch('getUserProjects', data.userId)
            dispatch('hideAllMessages')
            commit('SET_REMOVE_ERROR', false)
            commit('SET_REMOVE_SUCCESS', true)
            commit('SET_PROJECT_TO_EDIT', {})
        }).catch(error => {
            dispatch('hideAllMessages')
            commit('SET_REMOVE_ERROR', true)
            commit('SET_REMOVE_SUCCESS', false)
           console.log(error)
       });
    },
    addUserProject({commit, getters, dispatch}) {
        const newProjectData = getters.getNewProjectForUser
        if (newProjectData.dates === undefined) {
            const dates = {
                end: null,
                start: null
            }
            newProjectData.push(dates)
        }
        const data = {
            userId: newProjectData.userId,
            projId: newProjectData.projectId,
            engag: newProjectData.engag,
            endDate: newProjectData.dates.end,
            startDate: newProjectData.dates.start,
            contractorId: newProjectData.contractorId
        }
        const URL = '/api/users/' + data.userId + '/userEngag/create'
        axios.post( URL, {
            startDate: data.startDate,
            endDate: data.endDate,
            engag: data.engag, 
            projId: data.projId,
            contractorId: data.contractorId
          })
          .then(response => {
            // if the same user is selected in add and edit project, then 
            // set again user's project in calendar and edit part
            if (getters.getSelectedUserId === data.userId) {
                dispatch('setUserProjects', response.data)
            }
            dispatch('hideAllMessages')
            commit('SET_ADDING_ERROR', false)
            commit('SET_SAVE_DATA_SUCCESS', true)
            commit('SET_DISABLE_SAVE_NEW', true)
            commit('SET_NEW_PROJECT_FOR_USER', {})
          })
          .catch(error => {
            console.log(error);
            dispatch('hideAllMessages')
            commit('SET_ADDING_ERROR', true)
            commit('SET_SAVE_DATA_SUCCESS', false)
          });
    },
    editUserProject({commit, dispatch}, projectData) { 
        const URL = '/api/users/' + projectData.userId + '/userEngag/' + projectData.id + '/edit'

        axios.put( URL, {
            startDate: projectData.startDate,
            endDate: projectData.endDate,
            engag: projectData.engag, 
            projId: projectData.projId,
            contractorId: projectData.contractorId
          })
          .then(response => {
            dispatch('hideAllMessages')
            commit('SET_EDIT_ERROR', false)
            commit('SET_SAVE_DATA_SUCCESS', true)
            commit('SET_PROJECT_TO_EDIT', {})
            dispatch('getUserProjects', projectData.userId)

          })
          .catch(error => {
            console.log(error);
            dispatch('hideAllMessages')
            commit('SET_EDIT_ERROR', true)
            commit('SET_SAVE_DATA_SUCCESS', false)
          });
    },
    validateNewProject({commit, getters}){ 
        const project = getters.newProjectForUser
        if (project.userId && project.projectId  && project.engag && project.contractorId && project.dates.start && project.dates.end) {
                commit('SET_DISABLE_SAVE_NEW', false) 
            } else {
                commit('SET_DISABLE_SAVE_NEW', true) 
            }
    },
    validateEditProject({commit, dispatch, getters}){
        project = getters.getProjectToEdit
        dispatch('checkIfDataChanged', project)
        const hasChanged = getters.getHasDataChanged
            if (hasChanged === false) {
                commit('SET_DISABLE_SAVE_EDIT', true) 
                return
            }
            if (project.engag && project.startDate && project.endDate) {
                commit('SET_DISABLE_SAVE_EDIT', false) 
            } else {
                commit('SET_DISABLE_SAVE_EDIT', true) 
            }
    },
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
    validateNewEngag({dispatch, getters},engag) {
        const newProject = getters.getNewProjectForUser
        if (engag < 0) newProject.engag = null;
        if (engag > 100) newProject.engag = 100;
        dispatch('validateNewProject')
    },
     validateEditEngag({dispatch, getters},engag) {
        const editProject = getters.getProjectToEdit
            if (engag < 0) editProject.engag = null;
            if (engag > 100) editProject.engag = 100;
            dispatch('validateEditProject')
        }
};

const getters = {
    userProjectsList (state) {
        return state.userProjects
    },
    getDisableSaveNewProject(state) {
        return state.disableSaveNewProject
    },
    getDisableSaveEditProject(state) {
        return state.disableSaveEditProject
    },
    getBeforeEditingCache(state) {
        return state.beforeEditingCache
    },
    getHasDataChanged(state) {
        return state.hasDataChanged
    },
    getSelectedUserId(state){
        return state.userId
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
    getNewProjectForUser(state) {
        return state.newProjectForUser
    },
    getProjectToEdit(state){
        return state.projectToEdit
    }


};

export default {
    state,
    mutations,
    actions,
    getters
}