import axios from 'axios'
import moment from 'moment'
import { parse } from 'path';
import { stat } from 'fs';
let utils = require('../../../utils')

const state = {
  userAvailProjects: [],
  newProjectForUser: {
    UserAlias: null,
    ProjectId: null,
    ContractorId: null,
    Engag: null,
    StatusId: null,
    Description: null
  }
};

const mutations = {
  SET_USER_AVAIL_PROJECTS(state, userAvail) {
    if(userAvail){
      state.userAvailProjects = userAvail
    }
  },
  SET_USER_PROJECTS(state, userProjects) {
    state.userProjects = userProjects
  },
  SET_NEW_PROJECT_FOR_USER(state, project) {
    state.newProjectForUser = project
  },
  SET_NEW_PROJ(state, data){
    if(data.UserAlias){
      state.newProjectForUser.UserAlias = data.UserAlias
    }
    if(data.StartDate && !data.StartDateIsNull){
      state.newProjectForUser.StartDate = utils.formatDateForBackend(data.StartDate)
    }
    if(data.EndDate && !data.EndDateIsNull){
      state.newProjectForUser.EndDate = utils.formatDateForBackend(data.EndDate)
    }
  }
};

const actions = {
   getUserProjects({}, userId) {
    //get user availability for calendar and editing availability
    return axios({
      method: 'GET',
      url: "UserProjects?$filter=UserAlias eq '" + userId + "'",
      headers: {
        "Content-type": "application/x-www-form-urlencoded; charset=utf-8"
      }
    });
  },
  formatUserProjects({
    commit,
    getters
  }, userProjects) {
    // set projects data with props for calendar
    const projectsList = getters.projectsList
    for (let i = 0; i < userProjects.length; i++) {
      for (let j = 0; j < projectsList.length; j++) {
        if (userProjects[i].ProjectId === projectsList[j].ProjectId) {
          userProjects[i].ProjectName = projectsList[j].ProjectName
        }
      }
    }
    for (let i = 0; i < userProjects.length; i++) {
      let project = userProjects[i]
      project.Color = project.StatusId === 'PL' ? '#fde692' : '#cff09e'
      project.Order = project.StatusId === 'PL' ? 1 : 2
      project.EntryId = i
      project.StartDate = utils.dateStringToObj(project.StartDate)
      project.EndDate = utils.dateStringToObj(project.EndDate)
    }
    commit('SET_USER_AVAIL_PROJECTS', userProjects)
  },
  addUserProject({
    commit,
    getters,
    dispatch
  }) {
    let data = getters.getNewProjectForUser,
      url = 'UserProjects',
      sToken = getters.getToken;

    data.Engag = parseInt(data.Engag)
    axios({
      url: url,
      method: 'post',
      data: data,
      headers: {
        "Content-Type": "application/json",
        "X-Requested-With": "XMLHttpRequest",
        "Cache-Control": "no-cache",
        "x-csrf-token": sToken
      }
    }).then(res => {
      commit("SET_PROMISE_TO_READ", ["NewToken", "AvailProjects"]);
      dispatch('getData');
      commit('SET_NEW_PROJECT_FOR_USER', {
        UserAlias: null,
        ProjectId: null,
        ContractorId: null,
        Engag: null,
        StatusId: null,
        Description: null
      })
      let message = res.headers;
      dispatch('displayModal', message);
    }).catch(error => {
    })
  },
  updateUserProject({
    commit,
    dispatch, getters
  }, data) {
    const UrlU = "UserProjects(ProjectId='" + data.ProjectIdToChange + "',UserAlias='" + data.UserAlias + "',StartDate=datetime'" + moment(data.DateStartToChange).format("YYYY-MM-DD") + "T00:00:00',EndDate=datetime'" + moment(data.DateEndToChange).format("YYYY-MM-DD") + "T00:00:00',Language='')"
    let sToken = getters.getToken;
    data.StartDate = utils.formatDateForBackend(data.StartDate);
    data.EndDate = utils.formatDateForBackend(data.EndDate);
    data.StartDateToChange = utils.formatDateForBackend(data.StartDateToChange);
    data.EndDateToChange = utils.formatDateForBackend(data.EndDateToChange);
    data.Engag = parseInt(data.Engag)

    delete data.ProjectName
    delete data.Color
    delete data.Order
    delete data.EntryId
    axios({
        url: UrlU,
        method: 'put',
        data: data,
        headers: {
          "Content-Type": "application/json",
          "X-Requested-With": "XMLHttpRequest",
          "Cache-Control": "no-cache",
          "x-csrf-token": sToken
        }
      }).then(res => {
        // dispatch('hideAllMessages')
        // commit('SET_EDIT_ERROR', false)
        // commit('SET_SAVE_DATA_SUCCESS', true)
        // commit('SET_PROJECT_TO_EDIT', {})
        commit("SET_PROMISE_TO_READ", ["NewToken", "AvailProjects"]);
        dispatch('getData');
        let message = res.headers;
        dispatch('displayModal', message);

      })
      .catch(error => {
        // dispatch('hideAllMessages')
        // commit('SET_EDIT_ERROR', true)
        // commit('SET_SAVE_DATA_SUCCESS', false)
      });
  },
  removeUserProject({
    commit,
    dispatch, getters
  }, data) {
    const UrlD = "UserProjects(ProjectId='" + data.ProjectId + "',UserAlias='" + data.UserAlias + "',StartDate=datetime'" + moment(data.StartDate).format("YYYY-MM-DD") + "T00:00:00',EndDate=datetime'" + moment(data.EndDate).format("YYYY-MM-DD") + "T00:00:00',Language='')"
    let sToken = getters.getToken;

    axios({
        url: UrlD,
        method: 'delete',
        headers: {
          "Content-Type": "application/json",
          "X-Requested-With": "XMLHttpRequest",
          "Cache-Control": "no-cache",
          "x-csrf-token": sToken
        }
      }).then(res => {
        // dispatch('hideAllMessages')
        // commit('SET_EDIT_ERROR', false)
        // commit('SET_SAVE_DATA_SUCCESS', true)
        // commit('SET_PROJECT_TO_EDIT', {})
        commit("SET_PROMISE_TO_READ", ["NewToken", "AvailProjects"]);
        dispatch('getData');
        let message = res.headers;
        dispatch('displayModal', message);

      })
      .catch(error => {
        // dispatch('hideAllMessages')
        // commit('SET_EDIT_ERROR', true)
        // commit('SET_SAVE_DATA_SUCCESS', false)
      });
  },
};

const getters = {
  getNewProjectForUser(state) {
    return state.newProjectForUser
  },
  userProjectsList(state) {
    return state.userAvailProjects
  }

};

export default {
  state,
  mutations,
  actions,
  getters
}
