import axios from 'axios'
import i18n from '../../lang/lang'

let utils = require('../../utils')

const state = {
  saveChangesSuccess: true,
  uploadPhotoError: false,
  uploadFileError: false,
  cvLanguageList: [{
      id: 'en',
      description: i18n.t('select.cvLanguage.english')
    },
    {
      id: 'pl',
      description: i18n.t('select.cvLanguage.polish')
    },
    {
      id: 'de',
      description: i18n.t('select.cvLanguage.german')
    },
    {
      id: 'ru',
      description: i18n.t('select.cvLanguage.russian')
    }
  ],
  showChangePasswordDialog: false,
  disabledBtnToEdit: false,
  dataToRead: ["NewToken", "Domains", "FieldOfStudy", "SchoolDesc", "Industries", "UserData", "UserList", "Contractors", "Projects", "Languages", "ContractorsBranchesSet"],
  workTime: {
    "Full": i18n.t("label.fulltime"),
    "1/2": "1/2",
    "1/3": "1/3",
    "2/3": "2/3",
    "1/4": "1/4",
    "3/4": "3/4",
    "1/5": "1/5",
    "2/5": "2/5",
    "3/5": "3/5",
    "4/5": "4/5",
    "B2B": "B2B"
  },
  hasDataChangeProf: {
    changed: false,
    editMode: false
  } // check if data was changes in profile componentss
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
  SET_DISABLED_BTN_TO_EDIT(state, data) {
    state.disabledBtnToEdit = data;
  },
  SET_WORK_TIME(state){
    state.workTime["Full"] = i18n.t("label.fulltime");
  },
  SET_DATA_CHANGE_PROF(state, data) {
    state.hasDataChangeProf = data;
  }
};

const actions = {
  saveUserData({
    commit, getters, dispatch
  }, userData) {
    userData.Action = 'E'
    userData.Language = 'PL'

    // Temporary, needed to be change to array.splice()
    delete userData.UserCvProjects;
    delete userData.UserEducations;
    delete userData.UserExperiences;
    delete userData.imgUrl;
    delete userData.UserSkills;
    delete userData.UserLang;
    delete userData.UserAuth;
    delete userData.UserFiles;

    userData.EmploymentDate = utils.formatDateForBackend(userData.EmploymentDate);
    userData.DateBirth = utils.formatDateForBackend(userData.DateBirth);

    delete userData.UserExperience2;

    const url = `Users(UserAlias='${userData.UserAlias}',Language='${userData.Language}')`;
    let sToken = getters.getToken;
    axios({
      method: 'PUT',
      url: url,
      data: userData,
      // withCredentials: true,
      headers: {
        "Content-Type": "application/json",
        "X-Requested-With": "XMLHttpRequest",
        "Cache-Control": "no-cache",
        "x-csrf-token": sToken
        // "Cookie": getters.getCookie
      }
    }).then(res => {
      let message = res.headers;
      dispatch('displayModal', message);
    }).catch(error => {
    })
  },
  submitPhoto({
    commit, getters, dispatch
  }, data) {
    let slugHeader = data.file.name + ';' + data.type + ';' + data.language + ';' + data.userId + ';' + data.file.type;
    commit('SET_DISPLAY_LOADER', true)
    axios({
      method: 'POST',
      url: 'AttachmentMedias',
      data: data.file,
      headers: {
        "Content-type": data.file.type,
        "X-Requested-With": "XMLHttpRequest",
        "Slug": slugHeader,
        "x-csrf-token": getters.getToken
      }
    }).then(function(res) {
      commit('SET_DISPLAY_LOADER', false)
      let message = res.headers;
      dispatch('displayModal', message);
      dispatch('loadUserPhoto', data.userId); 
    }).catch(function(error) {
      commit('SET_DISPLAY_LOADER', false)
      if (error.status === 413) {
        commit('SET_SUBMIT_PHOTO_ERR_DIALOG', true)
      }
    })
  },

  submitPassword({
    getters, dispatch
  }, userData) {
    userData.Action = 'C'
    const url = 'Users' + '(' + "UserAlias='" + userData.UserAlias + "',Language='" + userData.Language + "')"
    let sToken = getters.getToken;
    let userDataToSend = { ... userData };
    axios.defaults.withCredentials = true
    delete userDataToSend.UserSkills
    delete userDataToSend.UserLang
    delete userDataToSend.UserFiles
    delete userDataToSend.UserExperiences
    delete userDataToSend.UserEducations
    delete userDataToSend.UserCvProjects
    delete userDataToSend.UserAuth
    userDataToSend.EmploymentDate = utils.formatDateForBackend(userData.EmploymentDate);
    userDataToSend.DateBirth = utils.formatDateForBackend(userData.DateBirth);
    axios({
      url: url,
      method: 'put',
      data: userDataToSend,
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

  onLightUp({}, el) {
    const shadow = "0px 0px 20px orange";
    if (el.style) {
      el.style.boxShadow = shadow;
    }
  },
  onLightOut({}, el) {
    const shadow = "0px 0px 10px grey";
    if (el.style) {
      el.style.boxShadow = shadow;
    }
  }
};

const getters = {
  getSaveChangesSuccess(state) {
    return state.saveChangesSuccess;
  },
  getSavePhotoError(state) {
    return state.isSavePhotoError;
  },
  getFileUploadError(state) {
    return state.isFileUploadError;
  },
  getCvLanguageList(state) {
    return state.cvLanguageList;
  },
  getShowSelectChangePasswordDialog(state) {
    return state.showChangePasswordDialog
  },
  getProfileToRead(state){
    return state.dataToRead;
  },
  getDisabledBtnToEdit(state) {
    return state.disabledBtnToEdit;
  },
  getWorkTime(state){
    return state.workTime;
  },
  getDataChangedProf(state) {
    return state.hasDataChangeProf;
  }
};

export default {
  state,
  mutations,
  actions,
  getters
}
