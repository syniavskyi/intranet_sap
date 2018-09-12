import axios from 'axios'
import router from '@/router/index.js'
import i18n from '../../lang/lang'
import odata from 'odata'

let utils = require('../../utils')


const state = {
  saveChangesSuccess: true,
  uploadPhotoError: false,
  uploadFileError: false,
  languageList:[
    {id: 'PL', name: 'Polski'},
    {id: 'EN', name: 'Angielski'},
    {id: 'DE', name: 'Niemiecki'}
  ],
  cvLanguageList: [
    { id: 'en', description: i18n.t('select.cvLanguage.english') },
    { id: 'pl', description: i18n.t('select.cvLanguage.polish')  },
    { id: 'de', description: i18n.t('select.cvLanguage.german')  },
    { id: 'ru', description: i18n.t('select.cvLanguage.russian') }
],
userJobPositions: ["SAP Fiori Developer"],
showChangePasswordDialog: false
};

const mutations = {
  SET_SHOW_CHANGE_PASSWORD_DIALOG(state, show) {
    state.showChangePasswordDialog = show
  },
  SET_SAVE_CHANGES_STATE(state, isSuccess) {
    state.saveChangesSuccess = isSuccess;
  },
  SET_PHOTO_ERROR(state, isError) {
    state.uploadPhotoError = isError;
  },
  SET_FILE_ERROR(state, isError) {
    state.uploadFileError = isError;
  },
  SET_USER_JOB_POS(state,list){
    state.userJobPositions = list;
  }
};

const actions = {
  saveUserData({
    commit
  }, userData) {
    userData.Action = 'E'
    userData.Language = 'PL'
    delete userData.UserCvProjects
    delete userData.UserEducations
    delete userData.UserExperiences
    delete userData.imgUrl
    delete userData.UserSkills
    delete userData.UserLang
    userData.EmploymentDate = utils.formatDateForBackend(userData.EmploymentDate)
    
    const url = 'Users' + '(' + "UserAlias='"+ userData.UserAlias + "',Language='" + userData.Language +  "')"
    odata(url).put(userData).save(function (data) {
      console.log("changed");
    }, function (status) {
      console.error(status); 
    });
    commit('SET_USER_INFO', userData);
  },
  submitPhoto({commit}, data) {
    let slugHeader = data.file.name + ';' + data.type + ';' + data.language + ';' + data.userId + ';' +  data.file.type
        let url = 'http://nw5.local.pl:8050/sap/opu/odata/sap/ZGW_INTRANET_SRV/AttachmentMedias'
    
        axios({
          method: 'POST',
          url: '/AttachmentMedias',
          auth: {
            username: 'psy',
            password: 'ides01'
          },
          data: data.file,
          headers: {
            "Content-type": data.file.type,
            "X-Requested-With": "XMLHttpRequest",
            "Slug": slugHeader
          }
        }).then(res => {
          console.log(res);
        }).catch(error => { 
          console.log(error);
        })
  },

  submitPassword({commit, getters}, userData) {
    let urlQuery = getters.getUrlQuery
    userData.Action = 'C'
    const url = 'Users' + '(' + "UserAlias='"+ userData.UserAlias + "',Language='" + userData.Language +  "')" + urlQuery
    odata(url).put(userData).save(function (data) {
      console.log("changed");
    }, function (status) {
      console.error(status); 
    });
  },
 
  
  onTileEdit({}, data) {

  }
};

const getters = {
  isSaveChangesSuccess(state) {
    return state.saveChangesSuccess;
  },
  isSavePhotoError(state) {
    return state.isSavePhotoError;
  },
  isFileUploadError(state) {
    return state.isFileUploadError;
  },
  getLanguageList(state){
    return state.languageList;
  },
  getUserJobPositions(state){
    return state.userJobPositions;
  },
  getCvLanguageList(state){
    return state.cvLanguageList;
  },
  getShowSelectChangePasswordDialog(state){
    return state.showChangePasswordDialog
  }


};

export default {
  state,
  mutations,
  actions,
  getters
}
