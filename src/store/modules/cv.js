import axios from 'axios'

const state = {
    cvElements: {
        photo: true,
        address: true,
        phone: true,
        date:true,
        name: true,
        language: localStorage.getItem('lang'),
        format: "DOCX",
        contractor: true,
        position: ""
    },
    cvFormats: ["DOCX"],
    showSelectCvDialog: false,
    dataToRead: ["NewToken", "Domains", "Industries", "UserData", "UserList", "Contractors", "Projects", "Languages", "SchoolDesc", "FieldOfStudy"]
};

const mutations = {
    SET_CV_ELEMENTS(state, data){
        state.cvElements = data
    },
    SET_SHOW_CV_DIALOG(state, show){
        state.showSelectCvDialog = show
    },
    SET_CV_DATA(state, data){
        state.cvData = data;
    }
};

const actions = {

    selectAllCvElements({getters, commit}) {
        let elements = getters.getCvElements,
            lang = elements.language,
            pos = elements.position,
            format = elements.format
        elements = {
                photo: true,
                address: true,
                phone: true,
                date:true,
                name: true,
                language: lang,
                format: format,
                contractor: true,
                position: pos
        }
        commit('SET_CV_ELEMENTS', elements);
    },
    deselectAllCvElements({getters, commit}) {
        let elements = getters.getCvElements,
        lang = elements.language,
        pos = elements.position,
        format = elements.format
        elements = {
                photo: false,
                address: false,
                phone: false,
                date:false,
                name: false,
                language: lang,
                format: format,
                contractor: false,
                position: pos
        }
        commit('SET_CV_ELEMENTS', elements);
    },
    submitCv({dispatch}, data) {
        let slugHeader = data.file.name + ';' + data.type + ';' + data.language + ';' + data.userId + ';' +  data.file.type

        axios({
          method: 'POST',
          url: 'AttachmentMedias',
          data: data.file,
          headers: {
            "Content-type": data.file.type,
            "X-Requested-With": "XMLHttpRequest",
            "Slug": slugHeader
          }
        }).then(res => {
          dispatch('getUserFilesData');
          let message = res.headers;
          dispatch('displayModal', message);
        }).catch(error => {
        })
      },
      updateCv({dispatch}, data) {
        let slugHeader = data.file.name + ';' + data.type + ';' + data.language + ';' + data.userId + ';' +  data.file.type;
        let url = "AttachmentMedias(FileType='" + data.type + "',Language='" + data.language + "',UserAlias='" + data.userId + "')/$value";

        axios({
          method: 'PUT',
          url: url,
          data: data.file,
          headers: {
            "Content-type": data.file.type,
            "X-Requested-With": "XMLHttpRequest",
            "Slug": slugHeader
          }
        }).then(res => {
          dispatch('getUserFilesData')
          let message = res.headers;
          dispatch('displayModal', message);
        }).catch(error => {
        })
        },
      deleteCv({commit, dispatch, getters}, data){
        let url = "AttachmentMedias(FileType='" + data.type + "',Language='" + data.language + "',UserAlias='" + data.userId + "')"  + "/$value";
        let sToken = getters.getToken;
        axios({
        url: url,
        method: 'delete',
        headers: {
            "Content-Type": "application/json",
            "X-Requested-With": "XMLHttpRequest",
            "Cache-Control": "no-cache",
            "x-csrf-token": sToken
        }
        }).then(res => {
            dispatch('getUserFilesData')
        }).catch(error => {
        })
      }
};

const getters = {
    getCvElements(state){
        return state.cvElements
    },
    getCvFormats(state){
        return state.cvFormats
    },
    getShowSelectCvDialog(state){
        return state.showSelectCvDialog
    },
    getCvToRead(state){
      return state.dataToRead;
    }
};

export default {
    state,
    mutations,
    actions,
    getters
}