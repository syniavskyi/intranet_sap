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
    getters.getSelectedForCvUser ? data.UserAlias = getters.getSelectedForCvUser : data.UserAlias = localStorage.getItem("id");
    data.DateStart = utils.formatDateForBackend(data.DateStart);
    data.DateEnd = utils.formatDateForBackend(data.DateEnd);
    data.DateEndToChange = null;
    data.DateStartToChange = null;
    delete data.Action;
    data.IsCurrent = data.IsCurrent ? 'X' : '-'
    let url = 'UserExperiences';
    let sToken = getters.getToken;
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
    const urlU = "UserExperiences(UserAlias='" + data.UserAlias + "',WorkPos='" + data.WorkPosToChange + "',Employer='" + data.EmployerToChange + "',Language='" + data.Language + "',DateStart=datetime'" + moment(data.DateStartToChange).format("YYYY-MM-DD") + "T00:00:00')";
    const urlD = "UserExperiences(UserAlias='" + data.UserAlias + "',Language='" + data.Language + "',WorkPos='" + data.WorkPos + "',Employer='" + data.Employer + "',DateStart=datetime'" + moment(data.DateStart).format("YYYY-MM-DD") + "T00:00:00')";
    data.DateStartToChange = utils.formatDateForBackend(data.DateStartToChange);
    data.DateEndToChange = utils.formatDateForBackend(data.DateEndToChange);
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
