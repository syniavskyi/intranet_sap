import axios from 'axios'
import router from '@/router/index.js'
import i18n from '../../lang/lang'

const state = {
  saveChangesSuccess: true,
  uploadPhotoError: false,
  uploadFileError: false,
  showProjectError: false,
  errorProjectNo: null,
  ifModuleExist: null,
  beforeEditingProjects: null,
  industryList: [{
      id: 'FI',
      name: 'Bankowość i finanse'
    },
    {
      id: 'ADV',
      name: 'Branża reklamowa'
    },
    {
      id: 'CTG',
      name: 'Chałupnictwo'
    },
    {
      id: 'CON',
      name: 'Przemysł budowlany'
    }
  ],
  modulesList: [{
      id: 'FI',
      name: 'Finanse'
    },
    {
      id: 'SD',
      name: 'Sprzedaż i dystrybucja'
    },
    {
      id: 'MM',
      name: 'Zarządzanie materiałami'
    }
  ],
  experienceList: [{
    project: 'Nazwa projektu',
    contractor: '2',
    industry: 'FI',
    modules: [{
      id: 'SD'
    }],
    duration: {
      start: 'Wed May 02 2018 00:00:00 GMT+0200 (Środkowoeuropejski czas letni)',
      end: 'Thu May 17 2018 00:00:00 GMT+0200 (Środkowoeuropejski czas letni)'
    },
    descr: 'Opis wykonanych czynności'
  }]
};

const mutations = {
  SET_SAVE_CHANGES_STATE(state, isSuccess) {
    state.saveChangesSuccess = isSuccess
  },
  SET_PHOTO_ERROR(state, isError) {
    state.uploadPhotoError = isError
  },
  SET_FILE_ERROR(state, isError) {
    state.uploadFileError = isError
  },
  SET_EXP_LIST(state, list) {
    state.experienceList = list
  },
  SET_PROJECT_ERROR(state, isError) {
    state.showProjectError = isError
  },
  SET_MODULE_EXIST(state, ifExist) {
    state.ifModuleExist = ifExist
  },
  SET_ERROR_PROJECT_NO(state, number) {
      state.errorProjectNo = number
  },
  SET_BEFORE_EDITING_PROJECTS(state, projects){
      state.beforeEditingProjects = projects
  }

};

const actions = {
  saveContactData({
    commit
  }, userData) {
    commit('SET_USER_DATA', userData)
    var params = new URLSearchParams()
    params.append('id', localStorage.getItem('id'))
    params.append('address', encodeURI(userData.address))
    params.append('phone', userData.phone)
    params.append('email', userData.email)
    params.append('skypeId', userData.skype)
    params.append('slackId', userData.slack)

    axios({
      method: 'post',
      url: '/api/user/edit/contactNew/',
      headers: {
        "Content-type": "application/x-www-form-urlencoded; charset=utf-8"
      },
      data: params
    }).then(res => {
      commit('SET_SAVE_CHANGES_STATE', true)
      console.log(res)
    }).catch(error => {
      commit('SET_SAVE_CHANGES_STATE', false)
      console.log(error)
    })
  },
  saveUserData({
    commit
  }, userData) {
    commit('SET_USER_DATA', userData)
    var params = new URLSearchParams()
    params.append('id', localStorage.getItem('id'))
    params.append('currentProject', encodeURI(userData.currentProject))
    params.append('employmentDate', userData.employmentDate)
    params.append('state', encodeURI(userData.state))
    params.append('branch', encodeURI(userData.branch))
    params.append('section', encodeURI(userData.section))
    params.append('position', encodeURI(userData.position))
    axios({
      method: 'post',
      url: '/api/user/edit/detail',
      headers: {
        "Content-type": "application/x-www-form-urlencoded; charset=utf-8"
      },
      data: params
    }).then(res => {
      commit('SET_SAVE_CHANGES_STATE', true)
      commit('SET_SENIORITY', res.data)
      console.log(res)
    }).catch(error => {
      commit('SET_SAVE_CHANGES_STATE', false)
      console.log(error)
    })
  },

  submitPhoto({
    commit
  }, data) {
    let formData = new FormData()
    formData.append('file', data.file)
    formData.append('id', data.id)
    axios({
      method: 'post',
      url: '/api/files/uploadImage',
      headers: {
        "Content-type": "multipart/form-data"
      },
      data: formData
    }).then(res => {
      console.log(res)
      commit('SET_PHOTO', res.data.fileDownloadUri)
      commit('SET_PHOTO_ERROR', false)
    }).catch(error => {
      commit('SET_PHOTO_ERROR', true)
      console.log(error)
    })
  },
  submitCv({
    commit
  }, data) {
    let formData = new FormData()
    formData.append('file', data.file)
    formData.append('id', data.id)
    axios({
      method: 'post',
      url: '/api/files/uploadFile',
      headers: {
        "Content-type": "multipart/form-data"
      },
      data: formData
    }).then(res => {
      commit('SET_CV', res.data.fileDownloadUri)
      commit('SET_FILE_ERROR', false)
      console.log(res)
    }).catch(error => {
      console.log(error)
      commit('SET_FILE_ERROR', false)
    })
  },
  addExpRow({
    commit,
    getters
  }) {
    const expList = getters.getExperienceList
    expList.push({
      project: null,
      descr: null,
      contractor: null,
      industry: null,
      modules: []
    })
    commit('SET_EXP_LIST', expList)
    commit('SET_PROJECT_ERROR', false)
  },
  removeExpRow({
    commit,
    getters
  }, index) {
    const expList = getters.getExperienceList
    expList.splice(index, 1)
    commit('SET_EXP_LIST', expList)
    commit('SET_PROJECT_ERROR', false)
  },
  saveExpPosition({
    dispatch,
    getters,
    commit
  }, index) {
    const experience = Object.assign({}, getters.getExperienceList[index])
    experience.userId = localStorage.getItem('id'),
    experience.index = index
    dispatch('checkExpPosition', experience)
    if (getters.getErrorProjectNo !== experience.index){
        // request to backend,
        //projects are actual projects list after editing
        //commit ('SET_BEFORE_EDITING_PROJECTS', projects)
    }
  },
  checkExpPosition({
    commit
  }, experience) {
    for (let key in experience) {
      if (!experience[key]) {
        if (key === "endDate" && experience.isCurrent === true ) {
          commit('SET_PROJECT_ERROR', false)
        } else if (key === "index") {
          commit('SET_PROJECT_ERROR', false)
        }else {
          commit('SET_PROJECT_ERROR', true)
          commit('SET_ERROR_PROJECT_NO', experience.index + 1 )
          return
        }
      } else {
        commit('SET_PROJECT_ERROR', false)
      }
    }
  },
  addModule({
    commit,
    getters
  }, data) {
    const expList = getters.getExperienceList,
      modules = expList[data.index].modules

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
      expList[data.index].modules.push({
        id: data.moduleId
      })
      commit('SET_EXP_LIST', expList)
    }
  },
  removeModule({
    commit,
    getters
  }, data) {
    const expList = getters.getExperienceList,
      modules = expList[data.index].modules
    for (let i = 0; i < modules.length; i++) {
      if (modules[i].id === data.moduleId) {
        modules.splice(i, 1)
      }
    }
    commit('SET_EXP_LIST', expList)
  }

};

const getters = {
  isSaveChangesSuccess(state) {
    return state.saveChangesSuccess
  },
  isSavePhotoError(state) {
    return state.isSavePhotoError
  },
  isFileUploadError(state) {
    return state.isFileUploadError
  },
  getIndustryList(state) {
    return state.industryList
  },
  getModulesList(state) {
    return state.modulesList
  },
  getExperienceList(state) {
    return state.experienceList
  },
  getShowProjectError(state) {
    return state.showProjectError
  },
  getModuleExist(state) {
    return state.ifModuleExist
  },
  getErrorProjectNo(state){
      return state.errorProjectNo
  },
  getBeforeEditingProjects(state){
      return state.beforeEditingProjects
  }
};

export default {
  state,
  mutations,
  actions,
  getters
}
