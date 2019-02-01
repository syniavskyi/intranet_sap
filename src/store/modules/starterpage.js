import axios from 'axios'

const state = {
  docListNew: [],
  docListInfo: [],
  listForStatus: [],
}

const mutations = {
  // docs for new user
  SET_DOC_LIST_NEW(state, data) {
    state.docListNew = data;
  },
  // informational documents
  SET_DOC_LIST_INFO(state, data) {
    state.docListInfo = data;
  }
}

const actions = {
  // change Status from X/- to true/false
  checkStatus({}, files) {
    for(let index in files) {
      files[index].Status = files[index].Status === 'X' ? true : false
    }
  },
  // get docs for new user
  getNewDocs({}) {
    let user = localStorage.getItem("id");
    return axios({
      method: 'GET',
      url: "Attachments?$filter=FileId eq 'new' and UserAlias eq '" + user + "'",
      headers: {
        "Content-type": "application/x-www-form-urlencoded; charset=utf-8"
      }
    })
  },
  // get informational docs
  getInfoDocs({}) {
    let user = localStorage.getItem("id");
    return axios({
      method: 'GET',
      url: "Attachments?$filter=FileId eq 'info' and UserAlias eq '" + user + "'",
      headers: {
        "Content-type": "application/x-www-form-urlencoded; charset=utf-8"
      }
    })
  },
  // edit the document with the given id: info or new
  editSingleNewDoc({getters, dispatch}, data) {
    let sToken = getters.getToken;
    const editData = {
      FileId: data.FileId,
      Language: 'PL',
      UserAlias: localStorage.getItem("id"),
      Status: data.Status ? 'X' : '-'
    }
    let url = "UserFiles(UserAlias='" + editData.UserAlias + "',Language='" + editData.Language + "',FileId='" + editData.FileId + "')";
    axios({
      url: url,
      method: 'put',
      data: editData,
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
  deleteNewFile({getters, dispatch}) {
        let sToken = getters.getToken;
        let user = localStorage.getItem("id");
        let url = "UserFiles(UserAlias='" + user + "',Language='PL',FileId='NEW')";
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
            let message = res.headers;
            dispatch('displayModal', message);
            dispatch('getData', null)
        }).catch(error => {
        })
  },
  deleteInfoFile({getters, dispatch}) {
    let user = localStorage.getItem("id");
    let sToken = getters.getToken;
    let url = "UserFiles(UserAlias='" + user + "',Language='PL',FileId='INFO')";
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
        let message = res.headers;
        dispatch('displayModal', message);
        // this.$store.commit("SET_PROMISE_TO_READ", ["UserData", "StarterDocsInfo", "StarterDocsNew", "NewToken"]);
        dispatch('getData', null);
    }).catch(error => {
    })
  }
}

const getters = {
  getDocListNew(state) {
    return state.docListNew;
  },
  getDocListInfo(state) {
    return state.docListInfo;
  }
}

export default {
  state,
  mutations,
  actions,
  getters
}
