import axios from 'axios'
import router from '@/router/index.js'
import moment from "moment";
import odata from 'odata'
let utils = require('../../../utils')

const state = {
  userEducation: [],
  showEducationError: false
}

const mutations = {
  SET_USER_EDUCATION(state, list) {
    state.userEducation = list
  },
  SET_EDUCATION_ERROR(state, isError) {
    state.showEducationError = isError
  }
}

const actions = {
  addUserEduRow({
    getters,
    commit
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
  removeUserEducation({
    getters
  }, index) {
    const lang = 'PL'
    const userEdu = getters.getUserEducation,
      data = userEdu[index],
      url = 'UsersEducation' + '(' + "UserAlias='UIO'," + "University='" + data.University + "',AcademicTitle='" + data.AcademicTitle + "',FieldOfStudy='" + data.FieldOfStudy + "',Language='"+ lang +  "')"

      data.Language = 'PL'
      odata(url).remove().save(function (data) {
        console.log("removed");
        userEdu.splice(index, 1)
      }, function (status) {
        console.error(status);
      });
  },
  editUserEducation({
    getters
  }, data) {
    data.UserAlias = 'UIO'
    data.Language = 'PL'
    // data.DateStart = utils.formatDateForBackend(data.DateStart)
    // data.DateEnd = utils.formatDateForBackend(data.DateEnd)
    data.DateStart ='/Date(1473465600000)/'
    data.DateEnd = '/Date(1473465600000)/'
    data.IsCurrent = data.IsCurrent ? 'X' : '-'
    let query = getters.getUrlQuery
    const url = 'UsersEducation' + '(' + "UserAlias='"+ data.UserAlias + "',University='" + data.UniversityToChange + "',AcademicTitle='" + data.AcademicTitleToChange + "',FieldOfStudy='" + data.FieldOfStudyToChange + "',Language='"+ data.Language + "')" + query
    odata(url).put(data).save(function (data) {
      console.log("changed");
    }, function (status) {
      console.error(status);
    });

  },
  addUserEducation({
    getters
  }, data) {
    data.UserAlias = 'UIO'
    data.Language = 'PL'
    data.DateStart = utils.formatDateForBackend(data.DateStart)
    data.DateEnd = utils.formatDateForBackend(data.DateEnd)
    data.IsCurrent = data.IsCurrent ? 'X' : '-'
    odata('UsersEducation').post(data).save(function (data) {
      console.log("Working");
    }, function (status) {
      console.error(status);
    });
  },
}

const getters = {
  getUserEducation(state) {
    return state.userEducation
  }
}

export default {
  state,
  mutations,
  actions,
  getters
}