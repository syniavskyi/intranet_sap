import axios from 'axios'
let utils = require('../../../utils')

const state = {
  userEducation: [],
  showEducationError: false,
  schoolDescList: [],
  fieldOfStudyDescList: []
}

const mutations = {
  SET_USER_EDUCATION(state, list) {
    state.userEducation = list
  },
  SET_EDUCATION_ERROR(state, isError) {
    state.showEducationError = isError
  },
  SET_SCHOOL_DESC_LIST(state, data) {
    state.schoolDescList = data;
  },
  SET_FIELD_OF_STUDY_DESC_LIST(state, data) {
    state.fieldOfStudyDescList = data;
  },
}

const actions = {
  addUserEduRow({
    getters,
  }) {
    const userEdu = getters.getUserEducation
    userEdu.push({
      DateStart: null,
      DateEnd: null,
      AcademicTitle: null,
      FieldOfStudy: null,
      University: null,
      IsCurrent: false,
      StudyType: null,
      Duplicated: null,
      SchoolDescription: null,
      UniversityToChange: null,
      FieldOfStudyToChange: null,
      AcademicTitleToChange: null,
      FieldOfStudyDescription: null,
      Language: 'PL'
    })
  },
  editUserEducation({
    getters, dispatch
  }, data) {
    getters.getSelectedForCvUser ? data.UserAlias = getters.getSelectedForCvUser : data.UserAlias = localStorage.getItem("id");
    getters.getSelectedCvLang ?  data.Language = getters.getSelectedCvLang.toUpperCase() : data.Language = localStorage.getItem("lang");
    data.DateStart = utils.formatDateForBackend(data.DateStart);
    data.DateEnd = utils.formatDateForBackend(data.DateEnd);
    data.IsCurrent = data.IsCurrent ? 'X' : '-';
    const urlU = "UsersEducation(UserAlias='" + data.UserAlias + "',University='" + data.UniversityToChange + "',AcademicTitle='" + data.AcademicTitleToChange + "',FieldOfStudy='" + data.FieldOfStudyToChange + "',Language='" + data.Language + "')",
    urlD = "UsersEducation(UserAlias='" + data.UserAlias + "',University='" + data.University + "',AcademicTitle='" + data.AcademicTitle + "',FieldOfStudy='" + data.FieldOfStudy + "',Language='" + data.Language + "')"
    let sToken = getters.getToken;
    axios({
      url: data.Action === 'D' ? urlD : urlU,
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
        console.log(error);
    })
  },
  addUserEducation({
    getters, dispatch
  }, data) {
    getters.getSelectedForCvUser ? data.UserAlias = getters.getSelectedForCvUser : data.UserAlias = localStorage.getItem("id");
    getters.getSelectedCvLang ?  data.Language = getters.getSelectedCvLang.toUpperCase() : data.Language = localStorage.getItem("lang");
    data.DateStart = utils.formatDateForBackend(data.DateStart)
    data.DateEnd = utils.formatDateForBackend(data.DateEnd)
    data.IsCurrent = data.IsCurrent ? 'X' : '-'
    let url = 'UsersEducation';
    axios({
      url: url,
      method: 'post',
      data: data,
      headers: {
          "Content-Type": "application/json",
          "X-Requested-With": "XMLHttpRequest",
          "Cache-Control": "no-cache",
          "x-csrf-token": getters.getToken
      }
    }).then(res => {
      let message = res.headers;
      dispatch('displayModal', message);
      }).catch(error => {
        console.log(error);
    })
  },
  // get description for school from text table
  getSchoolDesc({}, lang) {
    if (lang === undefined) {
      lang = "PL"
    }
    return axios({
      method: 'GET',
      url: `SchoolDesc?$filter=Language eq '${lang}'`,
      headers: {
        "Content-type": "application/x-www-form-urlencoded; charset=utf-8"
      }
    })
  },
  // get description for field of study from text table
  getFieldOfStudyDesc({}, lang) {
    if (lang === undefined) {
      lang = "PL"
    }
    return axios({
      method: 'GET',
      url: `FieldOfStudyDesc?$filter=Language eq '${lang}'`, 
      headers: {
        "Content-type": "application/x-www-form-urlencoded; charset=utf-8"
      }
    })
  }
}

const getters = {
  getUserEducation(state) {
    return state.userEducation
  },
  getSchoolDescList(state) {
    return state.schoolDescList;
  },
  getFieldOfStudyDescList(state) {
    return state.fieldOfStudyDescList;
  }
}

export default {
  state,
  mutations,
  actions,
  getters
}
