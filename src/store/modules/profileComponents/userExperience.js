import moment from 'moment'
import axios from 'axios'

let utils = require('../../../utils')

const state = {
  userExperience: [],
  showExperienceError: false
}

const mutations = {
  SET_USER_EXPERIENCE(state, list) {
    state.userExperience = list
  },
  SET_EXPERIENCE_ERROR(state, isError) {
    state.showExperienceError = isError
  }
}

const actions = {
  addUserExperience({
    getters
  }) {
    const userExp = getters.getUserExperience
    userExp.push({
      DateStart: null,
      DateEnd: null,
      Employer: null,
      WorkPos: null,
      IsCurrent: false,
      Duplicated: null,
      WorkPosToChange: null,
      EmployerToChange: null,
      DateStartToChange: null,
      DateEndToChange: null,
      Duplicated: null,
      Language: null
    })
  },
  saveNewUserExp({
    getters, dispatch
  }, data) {
    let dataToSave = {... data};
    getters.getSelectedForCvUser ? dataToSave.UserAlias = getters.getSelectedForCvUser : dataToSave.UserAlias = localStorage.getItem("id");
    dataToSave.DateStart = utils.formatDateForBackend(data.DateStart);
    dataToSave.DateEnd = utils.formatDateForBackend(data.DateEnd);
    dataToSave.DateEndToChange = null;
    dataToSave.DateStartToChange = null;
    delete data.Action;
    dataToSave.IsCurrent = data.IsCurrent ? 'X' : '-'
    let url = 'UserExperiences2';
    let sToken = getters.getToken;
    axios({
      url: url,
      method: 'post',
      data: dataToSave,
      headers: {
          "Content-Type": "application/json",
          "X-Requested-With": "XMLHttpRequest",
          "Cache-Control": "no-cache",
          "x-csrf-token": sToken
      }
    }).then(res => {
      let message = res.headers;
      dispatch('displayModal', message);
      }).catch(error => {
    })
  },
  updateUserExp({
    getters, dispatch
  }, data) {
    getters.getSelectedForCvUser ? data.UserAlias = getters.getSelectedForCvUser : data.UserAlias = localStorage.getItem("id");
    data.DateStart = utils.formatDateForBackend(data.DateStart);
    data.DateEnd = utils.formatDateForBackend(data.DateEnd);
    data.IsCurrent = data.IsCurrent ? 'X' : '-';
    const urlU = `UserExperiences2(UserAlias='${data.UserAlias }',ExperienceLevel='${data.ExperienceLevel}',ExperiencePosition='${data.ExperiencePosition}',Employer='${data.Employer}',Language='${data.Language}',DateStart=datetime'${moment(data.DateStart).format("YYYY-MM-DD")}T00:00:00')`
    // const urlU = "UserExperience2(UserAlias='" + data.UserAlias + "',WorkPos='" + data.WorkPosToChange + "',Employer='" + data.EmployerToChange + "',Language='" + data.Language + "',DateStart=datetime'" + moment(data.DateStartToChange).format("YYYY-MM-DD") + "T00:00:00')";
    const urlD = `UserExperiences2(UserAlias='${data.UserAlias }',ExperienceLevel='${data.ExperienceLevel}',ExperiencePosition='${data.ExperiencePosition}',Employer='${data.Employer}',Language='${data.Language}',DateStart=datetime'${moment(data.DateStart).format("YYYY-MM-DD")}T00:00:00')`
    // const urlX = "UserExperiences2(UserAlias='" + data.UserAlias + "',ExperienceLevel='" + data.ExperienceLevel + "',Employer='" + data.Employer + "',Language='" + data.Language + "',DateStart=datetime'" + moment(data.DateStart).format("YYYY-MM-DD") + "T00:00:00')";
    data.DateStartToChange = utils.formatDateForBackend(data.DateStartToChange);
    data.DateEndToChange = utils.formatDateForBackend(data.DateEndToChange);
    delete data.User;
    let sToken = getters.getToken;
    axios({
      url: data.Action === 'U' ? urlU : urlD,
      method: 'put',
      data: data,
      headers: {
          "Content-Type": "application/json",
          "X-Requested-With": "XMLHttpRequest",
          "Cache-Control": "no-cache",
          "x-csrf-token": sToken
      }
    }).then(res => {
      let message = res.headers;
      dispatch('displayModal', message);
      }).catch(error => {
    })
  },
}

const getters = {
  getUserExperience(state) {
    return state.userExperience
  }
}

export default {
  state,
  mutations,
  actions,
  getters
}
