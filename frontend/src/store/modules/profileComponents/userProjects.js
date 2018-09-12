import axios from 'axios'
import router from '@/router/index.js'
import moment from 'moment'
import odata from 'odata'
// import i18n from '../../lang/lang'
let utils = require('../../../utils')

const state = {
  showProjectError: false,
  errorProjectNo: null,
  ifModuleExist: null,
  ifIndustryExist: null,
  beforeEditingProjects: null,
  industryList: [],
  userProjectsList: [],
  object: {}
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
  SET_BEFORE_EDITING_PROJECTS(state, projects) {
    state.beforeEditingProjects = projects
  },
  SET_INDUSTRY_DESC_LIST(state, data) {
    state.industryList = data;
  },
  SET_OBJECT(state, data) {
    state.object = data;
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
  removeUserProjectsRow({
    commit,
    getters
  }, index) {

    let lang = 'PL';
    let user = 'UIO'
    const projects  = getters.getUserProjectsList,
    data = projects[index],
    url = "UserCvProjects(UserAlias='" + user + "',DateStart=datetime'" + moment(data.DateStart).format("YYYY-MM-DD") + "T00:00:00" + "',DateEnd=datetime'" +  moment(data.DateEnd).format("YYYY-MM-DD") + "T00:00:00" + "',ProjectName='" +  data.ProjectName + "',Language='" +  lang + "')";

    odata(url).remove().save(function (data) {
      projects.splice(index, 1);
      commit('SET_USER_PROJECTS_LIST', projects);
    }, function (status) {
      console.error(status);
    })
    // commit('SET_PROJECT_ERROR', false)
  },
  // saveUserProjectsPosition({
  //   dispatch,
  //   getters,
  //   commit
  // }, index) {
  //   const project = Object.assign({}, getters.getUserProjectsList[index])
  //   project.userId = localStorage.getItem('id'),
  //     project.index = index
  //   dispatch('checkUserProjectsPosition', project)
  //   if (getters.getErrorProjectNo !== project.index) {
  //     // request to backend,
  //     //projects are actual projects list after editing
  //     //commit ('SET_BEFORE_EDITING_PROJECTS', projects)
  //   }
  // },
  saveUserProjectsPosition({dispatch, getters,commit}, data) {
    // data.UserId = 'UIO';
    data.UserAlias = 'UIO';
    data.DateStart = utils.formatDateForBackend(data.DateStart);
    data.DateEnd = utils.formatDateForBackend(data.DateEnd);
    dispatch('formatToString', data);
    data.IsCurrent = data.IsCurrent ? 'X' : '-';
    dispatch('adjustProjects')
    odata('UserCvProjects').post(data).save(function (data) {
      console.log("halohalo");
    }, function (status) {
      console.error(status); 
    });
  },
  updateUserProjectsPosition({dispatch}, data) {
    const dataToSend = data;
    dataToSend.UserAlias = 'UIO';
    dataToSend.DateStart = utils.formatDateForBackend(dataToSend.DateStart);
    dataToSend.DateEnd = utils.formatDateForBackend(dataToSend.DateEnd);
    dataToSend.IsCurrent = dataToSend.IsCurrent ? 'X' : '-' 
    dataToSend.DateStartToChange = utils.formatDateForBackend(dataToSend.DateStartToChange)
    dataToSend.DateEndToChange = utils.formatDateForBackend(dataToSend.DateEndToChange)
    dispatch('formatProjectToString', dataToSend)
    const url = "UserCvProjects(UserAlias='" + dataToSend.UserAlias + "',DateStart=datetime'" + moment(dataToSend.DateStart).format("YYYY-MM-DD") + "T00:00:00" + "',DateEnd=datetime'" +  moment(dataToSend.DateEnd).format("YYYY-MM-DD") + "T00:00:00" + "',ProjectName='" +  dataToSend.ProjectName + "',Language='" +  dataToSend.Language + "')";
    odata(url).put(dataToSend).save(function (oData) {
      console.log("zamianka");
    }, function (status) {
      console.error(status); 
    });
  },
  formatProjectToString({}, dataToSend) {
    let object = {};
    object.Modules = dataToSend.Modules;
    object.Industries = dataToSend.Industries;
    let moduleString = '',
    industryString = '';

    for(let key in object) {
      for(let i = 0; i < object[key].length; i++) {
          if(object[key].length <= 1 ) {
              if(key == 'Modules'){
                  moduleString = object[key][i].id;
              } 
              if(key == 'Industries') {
                  industryString = object[key][i].id;
              }
          }
          else {
              if(key == 'Modules'){
                moduleString += object[key][i].id + '||';;
              } 
              if(key == 'Industries') {
                industryString += object[key][i].id + '||';;
              }
          }
      }
    }
    if(industryString.includes('||')) {
      object.Industries = industryString.slice(0, industryString.length-2);
      dataToSend.Industries = industryString.slice(0, industryString.length-2);
    } else {
      object.Industries = industryString;
      dataToSend.Industries = industryString;
    }
    if(moduleString.includes('||')) {
      object.Modules = moduleString.slice(0, moduleString.length-2);
      dataToSend.Modules = moduleString.slice(0, moduleString.length-2);
    }
    else {
      object.Modules = moduleString;
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
  addIndustry({
    commit,
    getters,
    dispatch
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
  removeIndustry({commit, getters}, data) {
    const projectsList = getters.getUserProjectsList,
    industries = projectsList[data.index].Industries
    for (let i = 0; i < industries.length; i++) {
      if (industries[i].id === data.industryId) {
        industries.splice(i, 1)
      }
    }
    commit('SET_USER_PROJECTS_LIST', projectsList)
    
  },
  getIndustries({commit, getters}, lang) {
    if(lang === undefined) {
      lang = "PL"
    }
    let urlQuery = getters.getUrlQuery
    axios({
      method: 'GET',
      url: "Industries" + urlQuery + "&$filter=Lang eq '" + lang + "'",
      headers: {
        "Content-type": "application/x-www-form-urlencoded; charset=utf-8"
      }
    }).then(res => {
      console.log(res.data.d.results);
      commit('SET_INDUSTRY_DESC_LIST', res.data.d.results);
    }).catch(error => { })
  },
  adjustProjects({commit, dispatch, getters}) {
    let projects = this.getters.getUserProjectsList;
    let fullProjects= [];
    const projectsKeys = {
      Industries: [],
      Modules: []
    }
    let index;

    for(let i = 0; i < projects.length; i++) {
      let adjustedProjects = new Object();
        adjustedProjects.Industries = [];
        adjustedProjects.Modules = [];
        for(let key in projectsKeys) {
            if(projects[i][key].includes('||')) {
                while(projects[i][key].length > 1) {
                    index = projects[i][key].indexOf('||');
                    if(index > 0) {
                      let object = new Object();
                        object.id = projects[i][key].slice(0, index);
                        dispatch('checkProjectKey', {key, object})
                          object = this.getters.getObject;
                        adjustedProjects[key].push(object);
                        index += 2;
                        projects[i][key] = projects[i][key].substr(index, projects[i][key].length)
                    } 
                    else {
                      let object = new Object();
                      object.id = projects[i][key];
                      dispatch('checkProjectKey', {key, object});
                      object = this.getters.getObject;
                        adjustedProjects[key].push(object);
                        projects[i][key] = [];
                    }
                } 
            }  
            else {
              let object = new Object();
              object.id = projects[i][key];
              dispatch('checkProjectKey', {key, object});
              object = this.getters.getObject;
                adjustedProjects[key].push(object);
                projects[i][key] = [];
            }
        }
        fullProjects[i] = adjustedProjects;
    }
    for(let i = 0; i < projects.length; i++) {
          projects[i].Industries = fullProjects[i].Industries;
          projects[i].Modules = fullProjects[i].Modules;
    } 
    commit('SET_USER_PROJECTS_LIST', projects); 
  },
  checkProjectKey({commit}, {key, object} ) {
    let modulesList = this.getters.getModulesList;
    let industryList = this.getters.getIndustryList;
    let obj;
  
    if([key] == "Industries") {
      obj = industryList.find(o => o.IndustryId === object.id)
      object.name = obj.IndustryName;
    }
    if([key] == "Modules") {
      obj = modulesList.find(o => o.Key === object.id)
      object.name = obj.Value;
    } 
    commit('SET_OBJECT', object); 
  },
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
  getIndustryExist(state){
    return state.ifIndustryExist
  },
  getErrorProjectNo(state) {
    return state.errorProjectNo
  },
  getBeforeEditingProjects(state) {
    return state.beforeEditingProjects
  },
  getObject(state) {
    return state.object;
  }
}

export default {
  state,
  mutations,
  actions,
  getters
}
