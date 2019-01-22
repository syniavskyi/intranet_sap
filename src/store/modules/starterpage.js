import axios from 'axios'

const state = {
  buttonStateNew: true,
  buttonStateInfo: true,
  docListNew: [],
  docListInfo: [],
  listForStatus: [],
}

const mutations = {
  // check if all documents are filled
  SET_BUTTON_STATE_NEW(state, data) {
    state.buttonStateNew = data;
  },
  // docs for new user
  SET_DOC_LIST_NEW(state, data) {
    state.docListNew = data;
  },
  // informational documents
  SET_DOC_LIST_INFO(state, data) {
    state.docListInfo = data;
  },
  //doc info for new user
  SET_BUTTON_STATE_INFO(state, data) {
    state.buttonStateInfo = data;
  }
}

const actions = {
  // check if one of chheckboxes is not checked and set button to disabled
  checkListForNew({
    commit
  }, data) {
    var bState = false;
    for (let newData of data) {
      if (newData.Status) {
        bState = false;
      } else {
        return commit('SET_BUTTON_STATE_NEW', true)
      }
      commit('SET_BUTTON_STATE_NEW', bState);
    }
  },
  //same as above
  checkListForInfo({
    commit
  }, data) {
    var bState = false;
    for (let newData of data) {
      if (newData.Status) {
        bState = false;
      } else {
        return commit('SET_BUTTON_STATE_INFO', true);
      }
      commit('SET_BUTTON_STATE_INFO', bState);
    }
  },
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
    }).catch(error => {
    })
  }
}

const getters = {
  getButtonStateNew(state) {
    return state.buttonStateNew;
  },
  getButtonStateInfo(state) {
    return state.buttonStateInfo
  },
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
