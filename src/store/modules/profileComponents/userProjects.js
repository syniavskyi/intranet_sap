import axios from 'axios'
import moment from 'moment'
import odata from 'odata'

let utils = require('../../../utils')

const state = {
  showProjectError: false,
  errorProjectNo: null,
  ifModuleExist: null,
  ifIndustryExist: null,
  industryList: [],
  userProjectsList: [],
  object: {},
  userProjectsListDfLang: [],
  showHintProject: {}
};

const mutations = {
  SET_USER_PROJECTS_LIST(state, list) {
    state.userProjectsList = list
  },
  SET_PROJECT_ERROR(state, isError) {
    state.showProjectError = isError
  },
  SET_MODULE_EXIST(state, ifExist) {
    state.ifModuleExist = ifExist
  },
  SET_INDUSTRY_EXIST(state, ifExist) {
    state.ifIndustryExist = ifExist
  },
  SET_ERROR_PROJECT_NO(state, number) {
    state.errorProjectNo = number
  },
  SET_INDUSTRY_DESC_LIST(state, data) {
    state.industryList = data;
  },
  SET_OBJECT(state, data) {
    state.object = data;
  },
  SET_USER_PROJECTS_LIST_DF_LANG(state, data) {
    state.userProjectsListDfLang = data;
  },
  SET_SHOW_HINT_PROJECT(state, data) {
    state.showHintProject = data;
  }
}

const actions = {
  addUserProjectsRow({
    commit,
    getters
  }) {
    const projectsList = getters.getUserProjectsList
    projectsList.push({
      ProjectName: null,
      ContractorName: null,
      Industries: [],
      Modules: [],
      DateStart: null,
      DateEnd: null,
      IsCurrent: false,
      Description: null
    })
    commit('SET_USER_PROJECTS_LIST', projectsList)
    commit('SET_PROJECT_ERROR', false)
  },
  saveUserProjectsPosition({
    dispatch, getters
  }, data) {
    getters.getSelectedForCvUser ? data.UserAlias = getters.getSelectedForCvUser : data.UserAlias = localStorage.getItem("id");
    data.DateStart = utils.formatDateForBackend(data.DateStart);
    data.DateEnd = utils.formatDateForBackend(data.DateEnd);
    dispatch('formatProjectToString', data);
    data.IsCurrent = data.IsCurrent ? 'X' : '-';
    data.Language = localStorage.getItem('lang');
    let sToken = getters.getToken;
    delete data.User;
    let url = 'UserCvProjects';
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
        console.log(error);
    })
  },
  updateUserProjectsPosition({getters,
    dispatch
  }, data) {
    const dataToSend = data;
    getters.getSelectedForCvUser ? dataToSend.UserAlias = getters.getSelectedForCvUser : dataToSend.UserAlias = localStorage.getItem("id");
    dataToSend.DateStart = utils.formatDateForBackend(dataToSend.DateStart);
    dataToSend.DateEnd = utils.formatDateForBackend(dataToSend.DateEnd);
    dataToSend.IsCurrent = dataToSend.IsCurrent ? 'X' : '-';
    dataToSend.DateStartToChange = utils.formatDateForBackend(dataToSend.DateStartToChange);
    dataToSend.DateEndToChange = utils.formatDateForBackend(dataToSend.DateEndToChange);
    dataToSend.Language = localStorage.getItem('lang');
    delete dataToSend.User;
    dispatch('formatProjectToString', dataToSend);
    let urlD = `UserCvProjects(UserAlias='${dataToSend.UserAlias}',DateStart=datetime'${moment(dataToSend.DateStart).format("YYYY-MM-DD")}T00:00:00',DateEnd=datetime'${moment(dataToSend.DateEnd).format("YYYY-MM-DD")}T00:00:00,ProjectName='${dataToSend.ProjectName},Language='${dataToSend.Language}')`;
    let urlU = "UserCvProjects(UserAlias='" + dataToSend.UserAlias + "',DateStart=datetime'" + moment(dataToSend.DateStartToChange).format("YYYY-MM-DD") + "T00:00:00" + "',DateEnd=datetime'" + moment(dataToSend.DateEndToChange).format("YYYY-MM-DD") + "T00:00:00" + "',ProjectName='" + dataToSend.ProjectName + "',Language='" + dataToSend.Language + "')";
    let sToken = getters.getToken;
    axios({
      url: dataToSend.Action === 'D' ? urlD : urlU,
      method: 'put',
      data: dataToSend,
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
  // format project from array with objects to string
  formatProjectToString({}, dataToSend) {
    let object = {};
    object.Modules = dataToSend.Modules;
    object.Industries = dataToSend.Industries;
    let moduleString = '',
      industryString = '';

    for (let key in object) {
      for (let i = 0; i < object[key].length; i++) {
        if (object[key].length <= 1) {
          if (key == 'Modules') {
            moduleString = object[key][i].id;
          }
          if (key == 'Industries') {
            industryString = object[key][i].id;
          }
        } else {
          if (key == 'Modules') {
            moduleString += object[key][i].id + '||';;
          }
          if (key == 'Industries') {
            industryString += object[key][i].id + '||';;
          }
        }
      }
    }
    if (industryString.includes('||')) {
      dataToSend.Industries = industryString.slice(0, industryString.length - 2);
    } else {
      dataToSend.Industries = industryString;
    }
    if (moduleString.includes('||')) {
      dataToSend.Modules = moduleString.slice(0, moduleString.length - 2);
    } else {
      dataToSend.Modules = moduleString;
    }
  },
  // checkUserProjectsPosition({
  //   commit
  // }, project) {
  //   for (let key in project) {
  //     if (!project[key]) {
  //       if (key == "DateEnd" && project.isCurrent === true) {
  //         commit('SET_PROJECT_ERROR', false)
  //       } else if (key == "index") {
  //         commit('SET_PROJECT_ERROR', false)
  //       } else {
  //         commit('SET_PROJECT_ERROR', true)
  //         commit('SET_ERROR_PROJECT_NO', project.index + 1)
  //         return
  //       }
  //     } else {
  //       commit('SET_PROJECT_ERROR', false)
  //     }
  //   }
  // },
  // add new sap module
  addModule({
    commit,
    getters
  }, data) {
    const projectsList = getters.getUserProjectsList,
      modules = projectsList[data.index].Modules;

    if (modules.length !== 0) {
      for (let i = 0; i < modules.length; i++) {
        if (modules[i].id === data.moduleId) {
          commit('SET_MODULE_EXIST', true)
          return
        } else {
          commit('SET_MODULE_EXIST', false)
        }
      }
    } else {
      commit('SET_MODULE_EXIST', false)
    }

    if (getters.getModuleExist === false) {
      projectsList[data.index].Modules.push({
        id: data.moduleId
      })
      commit('SET_USER_PROJECTS_LIST', projectsList)
    }
  },
  removeModule({
    commit,
    getters
  }, data) {
    const projectsList = getters.getUserProjectsList,
      modules = projectsList[data.index].Modules
    for (let i = 0; i < modules.length; i++) {
      if (modules[i].id === data.moduleId) {
        modules.splice(i, 1)
      }
    }
    commit('SET_USER_PROJECTS_LIST', projectsList)
  },
  //add new industry
  addIndustry({
    commit,
    getters,
  }, data) {
    const projectsList = getters.getUserProjectsList,
      industries = projectsList[data.index].Industries;
    let obj,
      industryList = this.getters.getIndustryList;

    if (industries.length !== 0) {
      for (let i = 0; i < industries.length; i++) {
        if (industries[i].id === data.industryId) {
          commit('SET_INDUSTRY_EXIST', true)
          return
        } else {
          commit('SET_INDUSTRY_EXIST', false)
        }
      }
    } else {
      commit('SET_INDUSTRY_EXIST', false)
    }

    if (getters.getIndustryExist === false) {
      obj = industryList.find(o => o.IndustryId === data.industryId)
      projectsList[data.index].Industries.push({
        id: data.industryId,
        name: obj.IndustryName
      })
      commit('SET_USER_PROJECTS_LIST', projectsList)
      // dispatch('adjustProjects');
    }
  },
  removeIndustry({
    commit,
    getters
  }, data) {
    const projectsList = getters.getUserProjectsList,
      industries = projectsList[data.index].Industries
    for (let i = 0; i < industries.length; i++) {
      if (industries[i].id === data.industryId) {
        industries.splice(i, 1)
      }
    }
    commit('SET_USER_PROJECTS_LIST', projectsList)

  },
  // get industries name from text table
  getIndustries({
    getters
  }, userData) {
    //set hint in diffrent languge to help filling data in profile
    let lang;
    if(getters.getDataForHint) {
      lang = localStorage.getItem('lang').toUpperCase() === 'PL' ? lang = "EN" : lang = "PL";
    } else {
      lang = userData.cvLang;
        if (userData.cvLang === undefined) {
          lang = "PL";
        }
    }

    return axios({
      method: 'GET',
      url: `Industries?$filter=Lang eq '${lang}'`, 
      headers: {
        "Content-type": "application/x-www-form-urlencoded; charset=utf-8"
      }
    })
  },
  // format project from string to array with objects, adding industry description 
  adjustProjects({
    commit,
    dispatch
  }) {
    let projects = this.getters.getUserProjectsList;
    let fullProjects = [];
    const projectsKeys = {
      Industries: [],
      Modules: []
    }
    let index, object, adjustedProjects;

    for(let i = 0; i < projects.length; i++){
      adjustedProjects = {
        Industries: [],
        Modules: []
      };
      // go through all projects
      for (let key in projectsKeys) {
        if (projects[i][key]) {
          if (projects[i][key].includes('||')) {
            do {
              index = projects[i][key].indexOf('||');
              if (index > 0) {
                object = {
                  id: projects[i][key].slice(0, index)
                }
                dispatch('checkProjectKey', {key, object });
                adjustedProjects[key].push(object);
                index += 2;
                projects[i][key] = projects[i][key].substr(index, projects[i][key].length);
              } else {
                object = { id: projects[i][key] };
                dispatch('checkProjectKey', { key, object });
                object = this.getters.getObject;
                adjustedProjects[key].push(object);
                projects[i][key] = [];
              }
            }
            while(projects[i][key].length > 1);
          }
          else {
            object = {
              id: projects[i][key]
            }
            dispatch('checkProjectKey', { key, object });
            object = this.getters.getObject;
            adjustedProjects[key].push(object);
            projects[i][key] = [];
          }
        }
      }
      fullProjects[i] = adjustedProjects;
    }
    for (let i = 0; i < projects.length; i++) {
      projects[i].Industries = fullProjects[i].Industries;
      projects[i].Modules = fullProjects[i].Modules;
    }
    commit('SET_USER_PROJECTS_LIST', projects);
  },
  // find industry description, method for adjustProjects function
  checkProjectKey({
    commit
  }, {
    key,
    object
  }) {
    let modulesList = this.getters.getModulesList;
    let industryList = this.getters.getIndustryList;
    let obj;

    if ([key] == "Industries") {
      if(industryList.length > 0){
        obj = industryList.find(o => o.IndustryId === object.id)
        object.name = obj.IndustryName;
      }
    }
    if ([key] == "Modules") {
      if(modulesList.length > 0){
        obj = modulesList.find(o => o.Key === object.id)
        object.name = obj.Value;
      }
    }
    commit('SET_OBJECT', object);
  },
    showHintFnProject({commit}, data) {
      let oData = {
        show: data.show,
        index: data.index
      }
      commit("SET_SHOW_HINT_PROJECT", oData);
    }
}

const getters = {
  getIndustryList(state) {
    return state.industryList
  },
  getUserProjectsList(state) {
    return state.userProjectsList
  },
  getShowProjectError(state) {
    return state.showProjectError
  },
  getModuleExist(state) {
    return state.ifModuleExist
  },
  getIndustryExist(state) {
    return state.ifIndustryExist
  },
  getErrorProjectNo(state) {
    return state.errorProjectNo
  },
  getObject(state) {
    return state.object;
  },
  getUserProjectsListDfLang(state) {
    return state.userProjectsListDfLang;
  },
  getShowHintProject(state) {
    return state.showHintProject;
  }
}

export default {
  state,
  mutations,
  actions,
  getters
}
