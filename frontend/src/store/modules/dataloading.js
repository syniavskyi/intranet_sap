import axios from 'axios'
import router from '@/router/index.js'
import odata from 'odata'

const state = {
  departmentList: [],
  branches: [],
  userList: [],
  sectionsList: [],
  projectsList: [],
  contractorsList: [],
  isLoaded: false,
  userInfo: {},
  userData: {},
  studyTypes: [],
  academicTitles: [],
  langLevels: [],
  userFiles: [],
  fullLanguageList: [],
  workPositionList: [],
  sapDomains: ["ZINTRANET_DEPARTMENT", "ZINTRANET_BRANCH", "ZINTRANET_STUDIES_TYPES", "ZINTANET_ACADEMIC_TITLES", "ZINTRANET_LANG_LEVEL", "ZWORK_POS", "ZINTRANET_SAP_MODULES", 'ZINTRANET_PRIORITY', 'ZINTRANET_EVENT_TYPE', 'ZINTRANET_TARGET_GROUP'],
  schoolDescList: [],
  fieldOfStudyDescList: [],
  sapModulesList: [],
  newUserFiles: [],
  UserRole: [],
  userAdverts: [{Id: '001', Message: 'Wiadomość1', ValidTo: new Date()}, {Id:'002', Message: 'Wiadomość2', ValidTo: new Date()}],
  userAuth: [],
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
  SET_FORMATTED_DATE(state, data) {
    state.userData = data
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
  SET_USER_ROLE(state, data) {
    state.userRole = data;
  },
  SET_USER_AUTH(state, data) {
    state.userAuth = data;
  },
  SET_TARGET_GROUP(state, data) {
    state.targetGroup = data;
  }
};

const actions = {
  formatData({
    commit
  }, data) {
    if (data) {
      if (data.EmploymentDate !== null) {
        let nParsedDate = parseInt(data.EmploymentDate.substring(6, data.EmploymentDate.length - 2))

        data.EmploymentDate = new Date(nParsedDate);
      }

      if (data.UserCvProjects.results.length > 0) {
        for (let i = 0; i < data.UserCvProjects.results.length; i++) {
          if (data.UserCvProjects.results[i].DateStart !== null && data.UserCvProjects.results[i].DateEnd !== null) {
            let nParsedCvDateStart = parseInt(data.UserCvProjects.results[i].DateStart.substring(6, data.UserCvProjects.results[i].DateStart.length - 2)),
              nParsedCvDateEnd = parseInt(data.UserCvProjects.results[i].DateEnd.substring(6, data.UserCvProjects.results[i].DateEnd.length - 2))

            data.UserCvProjects.results[i].DateStart = new Date(nParsedCvDateStart);
            data.UserCvProjects.results[i].DateEnd = new Date(nParsedCvDateEnd);
          }
        }
      }
      if (data.UserEducations.results.length > 0) {
        for (let j = 0; j < data.UserEducations.results.length; j++) {
          if (data.UserEducations.results[j].DateStart !== null && data.UserEducations.results[j].DateEnd !== null) {
            let nParsedEducationDateStart = parseInt(data.UserEducations.results[j].DateStart.substring(6, data.UserEducations.results[j].DateStart.length - 2)),
              nParsedEducationDateEnd = parseInt(data.UserEducations.results[j].DateEnd.substring(6, data.UserEducations.results[j].DateEnd.length - 2))

            data.UserEducations.results[j].DateStart = new Date(nParsedEducationDateStart);
            data.UserEducations.results[j].DateEnd = new Date(nParsedEducationDateEnd);
          }
        }
      }
      if (data.UserExperiences.results.length > 0) {
        for (let k = 0; k < data.UserExperiences.results.length; k++) {
          if (data.UserExperiences.results[k].DateStart !== null && data.UserExperiences.results[k].DateEnd !== null) {
            let nParsedExperienceDateStart = parseInt(data.UserExperiences.results[k].DateStart.substring(6, data.UserExperiences.results[k].DateStart.length - 2)),
              nParsedExperienceDateEnd = parseInt(data.UserExperiences.results[k].DateEnd.substring(6, data.UserExperiences.results[k].DateEnd.length - 2))

            data.UserExperiences.results[k].DateStart = new Date(nParsedExperienceDateStart);
            data.UserExperiences.results[k].DateEnd = new Date(nParsedExperienceDateEnd);
          }
        }
      }
      commit('SET_FORMATTED_DATE', data);
    }
  },
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

    // let lang = 'PL'
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
    dispatch,
    state
  }, userData) {
    let urlQuery = getters.getUrlQuery
    let userData2 = {};
    userData2.user = 'UIO';
    userData2.lang = 'PL';
    if(userData === undefined) {
     let userData = {
        user: 'UIO',
         lang: 'PL'
      }
    }
    // let c = userData;
    // let userData2 = {};
    // userData2.user = 'UIO';
    // userData2.lang = 'PL';
    userData.user = 'UIO'
    axios({
      method: 'GET',
      url: 'Users' + '(UserAlias=' + "'" + userData.user + "'," +  "Language='" + userData.lang + "')"  + urlQuery +  '&$expand=UserEducations,UserExperiences,UserCvProjects,UserSkills,UserLang,UserFiles,UserRole,UserAuth',
      headers: {
        "Content-type": "application/x-www-form-urlencoded; charset=utf-8"
      }
    }).then(res => {
      console.log(res)
      const oUserData = res.data.d,
        sUserId = 'UIO'
      dispatch('formatData', oUserData);
      let oFormattedUserData = state.userData;
      oFormattedUserData.imgUrl = "http://nw5.local.pl:8050/sap/opu/odata/sap/ZGW_INTRANET_SRV/AttachmentMedias(FileType='USER-PHOTO',Language='PL',UserAlias='" +
      sUserId + "')/$value"
      // localStorage.setItem('id', oFormattedUserData.UserAlias)
      localStorage.setItem('id', sUserId);
      dispatch('getUserFilesData')
      commit('SET_USER_AUTH', oFormattedUserData.UserAuth.results)
      commit('SET_USER_INFO', oFormattedUserData);
      commit('SET_USER_EDUCATION', oUserData.UserEducations.results);
      dispatch('setEduIsCurrentField');
      commit('SET_USER_EXPERIENCE', oUserData.UserExperiences.results);
      dispatch('setExpIsCurrentField');
      commit('SET_USER_SKILLS', oUserData.UserSkills.results);
      dispatch('adjustUserSkills', userData);
      commit('SET_USER_LANGS', oUserData.UserLang.results);
      dispatch('adjustLang');
      commit('SET_USER_PROJECTS_LIST', oUserData.UserCvProjects.results);
      dispatch('adjustProjects');
      dispatch('setProjectsIsCurrentField');
      commit('SET_NEW_USER_FILES_LIST', oUserData.UserFiles.results);
      // dispatch('checkStatus');
      commit('SET_USER_ROLE', oUserData.UserRole.results)
      commit('SET_DATA_LOADED', true)
    }).catch(error => {
      console.log(error);
    })
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
    }).catch(error => { })
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
    }).catch(error => { })
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
    }).catch(error => { })
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
    }).catch(error => { })
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
    return state.userAuth;
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
