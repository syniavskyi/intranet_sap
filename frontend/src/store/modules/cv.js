import axios from 'axios'
import odata from 'odata'

const state = {
    cvElements: {
        photo: true,
        address: true,
        phone: true,
        date:true,
        name: true,
        language: null,
        format: null,
        contractor: true,
        position: null
    },
    cvFormats: ["DOCX", "DOC", "PDF"],
    showSelectCvDialog: false
};

const mutations = {
    SET_CV_ELEMENTS(state, data){
        state.cvElements = data
    },
    SET_SHOW_CV_DIALOG(state, show){
        state.showSelectCvDialog = show
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
    submitCv({
        commit, dispatch, getters
      }, data) {
        let urlQuery = getters.getUrlQuery
        let slugHeader = data.file.name + ';' + data.type + ';' + data.language + ';' + data.userId + ';' +  data.file.type
    
        axios({
          method: 'POST',
          url: 'AttachmentMedias' + urlQuery,
          data: data.file,
          headers: {
            "Content-type": data.file.type,
            "X-Requested-With": "XMLHttpRequest",
            "Slug": slugHeader
          }
        }).then(res => {
          console.log(res);
          dispatch('getUserFilesData')
        }).catch(error => { 
          console.log(error);
        })
      },
      updateCv({
        commit, dispatch, getters
      }, data) {
        let urlQuery = getters.getUrlQuery
        let slugHeader = data.file.name + ';' + data.type + ';' + data.language + ';' + data.userId + ';' +  data.file.type
        let url = "AttachmentMedias(FileType='" + data.type + "',Language='" + data.language + "',UserAlias='" + data.userId + "')"   + "/$value"+ urlQuery
    
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
          console.log(res);
          dispatch('getUserFilesData')
        }).catch(error => { 
          console.log(error);
        })
        },
      deleteCv({commit, dispatch, getters}, data){
        let urlQuery = getters.getUrlQuery
        let url = "AttachmentMedias(FileType='" + data.type + "',Language='" + data.language + "',UserAlias='" + data.userId + "')"  + "/$value"  + urlQuery
        odata(url).remove().save(function (data) {
            console.log("removed");
            dispatch('getUserFilesData')
          }, function (status) {
            console.error(status); 
          });
      },
      loadDataForCv({commit, dispatch}, data) {

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
      }
};

export default {
    state,
    mutations,
    actions,
    getters
}