import axios from 'axios'
import router from '@/router/index.js'
import odata from 'odata'
let utils = require('../../utils')

const state = {
  departmentList: [],
  branches: [],
  userList: [],
  sectionsList: [],
  projectsList: [],
  contractorsList: [],
  isLoaded: false,
  userInfo: {},
  studyTypes: [],
  academicTitles: [],
  langLevels: [],
  userFiles: [],
  fullLanguageList: [],
  workPositionList: [],
  sapDomains: ["ZINTRANET_DEPARTMENT", "ZINTRANET_AVAIL_TYPE", "ZINTRANET_AVAIL_STATUS", "ZINTRANET_BRANCH", "ZINTRANET_STUDIES_TYPES", "ZINTANET_ACADEMIC_TITLES", "ZINTRANET_LANG_LEVEL", "ZWORK_POS", "ZINTRANET_SAP_MODULES", 'ZINTRANET_PRIORITY', 'ZINTRANET_EVENT_TYPE', 'ZINTRANET_EVENT_TYPE', 'ZINTRANET_TARGET_GROUP'],
  schoolDescList: [],
  fieldOfStudyDescList: [],
  sapModulesList: [],
  newUserFiles: [],
  UserRole: [],
  userAdverts: [{Id: '001', Message: 'Wiadomość1', ValidTo: new Date()}, {Id:'002', Message: 'Wiadomość2', ValidTo: new Date()}],
  userAuth: [],
  availStatus: [],
  availType: [],
  targetGroup: []
};

const mutations = {
  SET_DEP_LIST(state, data) {
    state.departmentList = data;
  },
  SET_BRANCH_LIST(state, data) {
    state.branches = data;
  },
  GET_USER_LIST(state, data) {
    state.userList = data;
  },
  SET_DATA_LOADED(state, isLoaded) {
    state.isLoaded = isLoaded;
  },
  SET_CONTRACTORS_LIST(state, data) {
    state.contractorsList = data;
  },
  SET_PROJECTS_LIST(state, data) {
    state.projectsList = data;
  },
  SET_USER_INFO(state, data) {
    state.userInfo = data;
  },
  SET_STUDY_TYPES_LIST(state, data) {
    state.studyTypes = data;
  },
  SET_ACADEMIC_TITLES_LIST(state, data) {
    state.academicTitles = data;
  },
  SET_LANG_LEVELS(state, data) {
    state.langLevels = data
  },
  SET_LANGUAGE_LIST(state, data) {
    state.fullLanguageList = data;
  },
  SET_WORK_POSITION_LIST(state, data) {
    state.workPositionList = data
  },
  SET_SCHOOL_DESC_LIST(state, data) {
    state.schoolDescList = data;
  },
  SET_FIELD_OF_STUDY_DESC_LIST(state, data) {
    state.fieldOfStudyDescList = data;
  },
  SET_SAP_MODULES_LIST(state, data) {
    state.sapModulesList = data;
  },
  SET_USER_FILES_LIST(state, data){
    state.userFiles = data
  },
  SET_NEW_USER_FILES_LIST(state, data) {
    state.newUserFiles = data;
  },
  SET_USER_AUTH(state, data) {
    state.userAuth = data;
  },
  SET_AVAIL_STATUS(state, data){
    state.availStatus = data
  },
  SET_AVAIL_TYPE(state, data){
    state.availType = data
  },
  SET_TARGET_GROUP(state, data) {
    state.targetGroup = data;
  }
};

const actions = {
  loadData({
    commit,
    state,
    dispatch,
    getters
  }, userData) {
    for (let i = 0; i < state.sapDomains.length; i++) {
      let domainData = {
        name: state.sapDomains[i],
        lang: userData.lang
      };
      dispatch('getDomainValues', domainData)
    }
    dispatch('getContractorsList');
    dispatch('getIndustries', userData.lang);
    dispatch('getProjectsList');
    dispatch('getUsersLists');
    dispatch('getAllLanguages',);
    dispatch('getSchoolDesc', userData.lang);
    dispatch('getFieldOfStudyDesc', userData.lang);
    dispatch('getUserData', userData);
    dispatch('getEvents')
    // if (getters.isDataLoaded){
    //   router.replace('/dashboard')
    // }
  },
  getDomainValues({
    commit, getters
  }, domainData) {
    let urlQuery = getters.getUrlQuery
    if(domainData.lang === undefined) {
      domainData.lang = "PL"
    }
    axios({
      method: 'GET',
      url: "Dictionaries" + urlQuery  + "&$filter=Name eq '" + domainData.name + "' and Language eq '" + domainData.lang + "'",
      headers: {
        "Content-type": "application/x-www-form-urlencoded; charset=utf-8"
      }
    }).then(res => {
      if (domainData.name == 'ZINTRANET_DEPARTMENT') {
        const aDepartments = res.data.d.results;
        commit('SET_DEP_LIST', aDepartments);
      } else if (domainData.name == 'ZINTRANET_BRANCH') {
        const aBranches = res.data.d.results;
        commit('SET_BRANCH_LIST', aBranches);
      } else if (domainData.name == 'ZINTRANET_STUDIES_TYPES') {
        const aTypes = res.data.d.results;
        commit('SET_STUDY_TYPES_LIST', aTypes);
      } else if (domainData.name == 'ZINTANET_ACADEMIC_TITLES') {
        const aTitles = res.data.d.results;
        commit('SET_ACADEMIC_TITLES_LIST', aTitles);
      } else if (domainData.name == 'ZINTRANET_LANG_LEVEL') {
        const aLevels = res.data.d.results;
        commit('SET_LANG_LEVELS', aLevels);
      } else if (domainData.name == 'ZWORK_POS') {
        const aWorkPos = res.data.d.results;
        commit('SET_WORK_POSITION_LIST', aWorkPos);
      } else if (domainData.name == 'ZINTRANET_SAP_MODULES') {
        const aSapModules = res.data.d.results;
        commit('SET_SAP_MODULES_LIST', aSapModules);
      } else if (domainData.name == 'ZINTRANET_PRIORITY') {
        const aPriority = res.data.d.results;
        commit('SET_PRIORITY', aPriority);
      } else if (domainData.name == 'ZINTRANET_EVENT_TYPE') {
        const aEventType = res.data.d.results;
        commit('SET_EVENT_TYPE', aEventType);
      } else if (domainData.name == 'ZINTRANET_AVAIL_STATUS'){
        const aStatus = res.data.d.results;
        commit('SET_AVAIL_STATUS', aStatus);
      } else if (domainData.name == 'ZINTRANET_AVAIL_TYPE'){
        const aType = res.data.d.results;
        commit('SET_AVAIL_TYPE', aType);
      } else if (domainData.name == 'ZINTRANET_TARGET_GROUP') {
        const aTargetGroup = res.data.d.results;
        commit('SET_TARGET_GROUP', aTargetGroup);
      }
    }).catch(error => {
      console.log(error);
    })
  },
  getProjectsList({
    commit, getters
  }) {
    let urlQuery = getters.getUrlQuery
    axios({
      method: 'GET',
      url: 'Projects'  + urlQuery,
      headers: {
        "Content-type": "application/x-www-form-urlencoded; charset=utf-8"
      }
    }).then(res => {
      let oProjects = res.data.d.results;
      // console.log(res.data.d);
      commit('SET_PROJECTS_LIST', oProjects);
    }).catch(error => {
      console.log(error);
    })
  },
  getContractorsList({
    commit, getters
  }) {
    let urlQuery = getters.getUrlQuery
    axios({
      method: 'GET',
      url: 'Contractors'  + urlQuery,

      headers: {
        "Content-type": "application/x-www-form-urlencoded; charset=utf-8"
      }
    }).then(res => {

      let oContractors = res.data.d.results;

      commit('SET_CONTRACTORS_LIST', oContractors);
    }).catch(error => {
      console.log(error);
    })
  },
  // (UserAlias='UIO',Language='PL')
  // url: 'Users' + '(UserAlias=' + "'UIO'" + ',' + 'Language=' + "'PL'" + ')' + '?$expand=UserEducations,UserExperiences,UserCvProjects,UserSkills,UserLang',
  getUserData({
    commit, getters,
    dispatch
  }, userData) {
    let urlQuery = getters.getUrlQuery

    if(userData === undefined) { // TEMPORARY
     let userData = {
        user: 'UIO',
         lang: 'PL'
      }
    }
    userData.user = 'UIO' // TEMPORARY

    axios({
      method: 'GET',
      url: 'Users' + '(UserAlias=' + "'" + userData.user + "'," +  "Language='" + userData.lang + "')"  + urlQuery +  '&$expand=UserEducations,UserExperiences,UserCvProjects,UserSkills,UserLang,UserFiles,UserRole,UserAuth',
      headers: {
        "Content-type": "application/x-www-form-urlencoded; charset=utf-8"
      }
    }).then(res => {
      
      let sUserId = 'UIO' // TEMPORARY
      
      // let sUserId = res.data.d.UserAlias 
      localStorage.setItem('id', sUserId);
      
      dispatch('formatUserData', res.data.d); // format dates for date pickers and "is current" fields
      dispatch('getUserFilesData') // get data about all user files (cv, photos, documents etc.)
      
      let oData = getters.getUserInfo;
            
      commit('SET_USER_AUTH', oData.UserAuth.results) //set user authorization data
      
      commit('SET_USER_EDUCATION', oData.UserEducations.results); //set user education data for profile and cv
      commit('SET_USER_EXPERIENCE', oData.UserExperiences.results); //set user experience data for profile and cv
      
      commit('SET_USER_SKILLS', oData.UserSkills.results); //set user skills data for profile and cv
      dispatch('formatToArray',  oData.UserSkills.results); 

      commit('SET_USER_PROJECTS_LIST', oData.UserCvProjects.results); //set user projects data for profile and cv
      dispatch('adjustProjects');

      commit('SET_USER_LANGS', oData.UserLang.results);
      // dispatch('adjustLang');

      commit('SET_NEW_USER_FILES_LIST', oData.UserFiles.results); //set list of files for starter page for new user
      
      commit('SET_DATA_LOADED', true)
    }).catch(error => {
      console.log(error);
    })
  },
  formatUserData({
    commit
  }, data) {
    if (data) {
        data.EmploymentDate = utils.dateStringToObj(data.EmploymentDate)
      for (let key in data) {
        if (key === "UserCvProjects" || key === "UserEducations" || key === "UserExperiences"){
          let obj = data[key].results;
          for (let i = 0; i < obj.length; i++) {
            if (obj[i].DateStart){
              obj[i].DateStart =  utils.dateStringToObj(obj[i].DateStart);
            }
            if (obj[i].DateEnd){
              obj[i].DateEnd =  utils.dateStringToObj(obj[i].DateEnd);
            }
            obj[i].IsCurrent = obj[i].IsCurrent === 'X' ? true : false
          }
        }
     }
      commit('SET_USER_INFO', data);
    }
  },
  getUsersLists({
    commit,getters
  }) {
    let urlQuery = getters.getUrlQuery
    axios({
      method: 'GET',
      url: 'Users' + urlQuery,
      headers: {
        "Content-type": "application/x-www-form-urlencoded; charset=utf-8"
      }
    }).then(res => {
      commit('GET_USER_LIST', res.data.d.results);
    }).catch(error => {
      console.log(error)
     })
  },
  getAllLanguages({commit, getters},) {
    let urlQuery = getters.getUrlQuery
    axios({
      method: 'GET',
      url: 'Languages' + urlQuery,
      headers: {
        "Content-type": "application/x-www-form-urlencoded; charset=utf-8"
      }
    }).then(res => {
      commit('SET_LANGUAGE_LIST', res.data.d.results);
    }).catch(error => { 
      console.log(error)
    })
  },
  getSchoolDesc({commit, getters}, lang) {
    if(lang === undefined) {
      lang = "PL"
    }
    let urlQuery = getters.getUrlQuery
    axios({
      method: 'GET',
      url: "SchoolDesc" + urlQuery + "&$filter=Language eq " + "'" + lang + "'",
      headers: {
        "Content-type": "application/x-www-form-urlencoded; charset=utf-8"
      }
    }).then(res => {
      commit('SET_SCHOOL_DESC_LIST', res.data.d.results);
    }).catch(error => {
      console.log(error)
     })
  },

  getUserFilesData({commit, getters}){
    let userId = localStorage.getItem('id')
    let urlQuery = getters.getUrlQuery
    axios({
      method: 'GET',
      url: "Attachments" + urlQuery +  "&$filter=UserAlias eq " + "'" + userId + "'",
      headers: {
        "Content-type": "application/x-www-form-urlencoded; charset=utf-8"
      }
    }).then(res => {
      commit('SET_USER_FILES_LIST', res.data.d.results);
    }).catch(error => { 
      console.log(error)
    })
  },
  getFieldOfStudyDesc({commit, getters}, lang) {
    if(lang === undefined) {
      lang = "PL"
    }
    let urlQuery = getters.getUrlQuery
    axios({
      method: 'GET',
      url: "FieldOfStudyDesc" + urlQuery + "&$filter=Language eq '" + lang + "'",
      headers: {
        "Content-type": "application/x-www-form-urlencoded; charset=utf-8"
      }
    }).then(res => {
      commit('SET_FIELD_OF_STUDY_DESC_LIST', res.data.d.results);
    }).catch(error => { 
      console.log(error)
    })
  }

};

const getters = {
  depList(state) {
    return state.departmentList;
  },
  branchList(state) {
    return state.branches;
  },
  projectsList(state) {
    return state.projectsList;
  },
  usersList(state) {
    return state.userList;
  },
  contractorsList(state) {
    return state.contractorsList;
  },
  isDataLoaded(state) {
    return state.isLoaded;
  },
  getUserInfo(state) {
    return state.userInfo;
  },
  studyTypes(state) {
    return state.studyTypes;
  },
  academicTitles(state) {
    return state.academicTitles;
  },
  langLevels(state) {
    return state.langLevels
  },
  langLevels(state){
    return state.langLevels;
  },
  fullLanguageList(state) {
    return state.fullLanguageList;
  },
  workPositions(state) {
    return state.workPositionList;
  },
  schoolDescList(state) {
    return state.schoolDescList;
  },
  fieldOfStudyDescList(state) {
    return state.fieldOfStudyDescList;
  },
  getModulesList(state) {
    return state.sapModulesList;
  },
  getUserFiles(state) {
    return state.userFiles;
  },
  getNewUserFilesList(state) {
    return state.newUserFiles;
  },
  userAdverts(state) {
    return state.userAdverts;
  },
  getUserAuth(state){
    return state.userAuth
  },
  getAvailStatus(state){
    return state.availStatus
  },
  getAvailType(state) {
    return state.availType
  },
  getTargetGroup(state) {
    return state.targetGroup;
  }
};

export default {
  state,
  mutations,
  actions,
  getters
}
