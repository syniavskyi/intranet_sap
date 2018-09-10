import axios from 'axios'
import router from '@/router/index.js'

const state = {
  buttonState: false,
  docListNew: [],
  docListInfo: [],
  listForStatus: [],
  docStatus: [],
  userId: ''
}

const mutations = {
  CHECK_LIST(state, data) {
    state.buttonState = data;
  },
  SET_DOC_LIST_NEW(state, data) {
    state.docListNew = data;
  },
  SET_DOC_LIST_INFO(state, data) {
    state.docListInfo = data;
  },
  // SET_LIST_FOR_STATUS(state, data) {
  //   state.listForStatus = data;
  // },
  GET_DOC_STATUS(state, data) {
    state.docStatus = data;
  },
  GET_USER_ID(state, data) {
    state.userId = data;
  }
}

const actions = {
  checkList({
    commit
  }, data) {
    var bState = false;

    for (var i = 0; i < data.length; i++) {
      if (data[i].Status) {
        bState = false;
      } else {
        return commit('CHECK_LIST', true)
      }
      commit('CHECK_LIST', bState);
    }
  },
  // nowe
  // checkStatus({commit, getters}, files) {
  //     let newUserFiles = getters.docListNew;
  //     for(let i = 0; i < newUserFiles.length; i++) {
  //       if(newUserFiles[i].Status === 'X') {
  //         newUserFiles[i].Status = true;
  //       }
  //       else {
  //         newUserFiles[i].Status = false;
  //       }
  //     }
  //     commit('SET_NEW_USER_FILES_LIST', newUserFiles);
  // },
  checkStatus({commit, getters}, files) {
    // let newUserFiles = getters.docListNew;
    for(let i = 0; i < files.length; i++) {
      if(files[i].Status === 'X') {
        files[i].Status = true;
      }
      else {
        files[i].Status = false;
      }
    }
    // commit('SET_NEW_USER_FILES_LIST', files);
},
   // nowe
getNewDocs({commit, getters, dispatch}) {
    let urlQuery = getters.getUrlQuery
    let query = "?sap-user=psy&sap-password=ides01&sap-language=pl"
    let user = 'UIO'
    axios({
      method: 'GET',
      url: 'Attachments'  + query + "&$filter=FileId eq 'new' and UserAlias eq '" + user + "'",
      headers: {
        "Content-type": "application/x-www-form-urlencoded; charset=utf-8"
      }
    }).then(res => {
      let oAttachments = res.data.d.results;
      commit('SET_DOC_LIST_NEW', oAttachments);
      dispatch('checkStatus', oAttachments);
    }).catch(error => {
      console.log(error);
    })
  },
  getInfoDocs({commit, getters, dispatch}) {
    let urlQuery = getters.getUrlQuery
    let query = "?sap-user=psy&sap-password=ides01&sap-language=pl"
    let user = 'UIO'
    axios({
      method: 'GET',
      url: 'Attachments'  + query + "&$filter=FileId eq 'info' and UserAlias eq '" + user + "'",
      headers: {
        "Content-type": "application/x-www-form-urlencoded; charset=utf-8"
      }
    }).then(res => {
      let oAttachments = res.data.d.results;
      commit('SET_DOC_LIST_INFO', oAttachments);
      dispatch('checkStatus', oAttachments);
    }).catch(error => {
      console.log(error);
    })
  },
  getDocsStatus({
    commit,
    state
  }) {
    var URL = '/api/users/' + state.userId + '/userStarterPage';
    axios.get(URL).then(res => {
      const data = res.data,
        aData = [];

        for(let key in data) {
          const docStatus = data[key];

          aData.push(docStatus);
        }
        commit('GET_DOC_STATUS', aData);
    })
  },
  saveDocs({commit, state, dispatch}, data) {
    var URL = '/api/users/' + state.userId + '/userStarterPage/create';
    axios.post(URL, {
      userGroup: "WRK",
      docId: data.data.id,
      status: data.data.status
    }).then(function(response){
      console.log(response);
      dispatch("getDocsStatus");
    }).catch(function(error) {
      console.log(error);
    });
  },
  sentDocuments({commit, state}){
    let formData = new FormData();
      formData.append('id', state.userId);
      axios({
        method: 'post',
        url: 'api/users/userStarterPage/disableStarterPage',
        headers: { "Content-type": "multipart/form-data" },
        data: formData
    }).then(res => {
        console.log(res)
        router.replace('/dashboard')
    }).catch(error => {
        console.log(error)
    })
  },
}

const getters = {
  returnCheckList(state) {
    return state.buttonState;
  },
  docListNew(state) {
    return state.docListNew;
  },
  docListInfo(state) {
    return state.docListInfo;
  },
  // getListForStatus(state) {
  //   return state.listForStatus;
  // },
  docStatusList(state) {
    return state.docStatus;
  }
}

export default {
  state,
  mutations,
  actions,
  getters
}
