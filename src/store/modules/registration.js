import axios from 'axios'

const state = {
  dataToRead: ["Industries", "Domains", "UserData", "NewToken"],
  registerData: {
    Fullname: "",
    Email: "",
    Role: "BTECH",
    DepartmentId: "",
    BranchId: "WRO",
    Language: "PL"
  }
};

const actions = {
  submitRegistration({
    commit, getters, dispatch
  }, data) {
    let registerData = getters.getRegistratinData;
    registerData.Action = "R";
    commit("SET_DISPLAY_LOADER", true);
    axios({
      url: 'Users',
      data: registerData,
      method: 'post',
      headers: {
        "Content-Type": "application/json",
        "X-Requested-With": "XMLHttpRequest",
        "Cache-Control": "no-cache",
        "x-csrf-token": getters.getToken
        // "Cookie": getters.getCookie
      }
    }).then(res => {
      commit("SET_DISPLAY_LOADER", false);
      commit("SET_DIALOG_CONFIRM", true);
      // let message = res.headers;
      // dispatch('displayModal', message);
    }).catch(error => {
      commit("SET_DISPLAY_LOADER", false);
      commit("SET_DIALOG_ERROR_STATUS", true);
    })
  },

  closeConfirmDialog({
    commit
  }){
    commit("SET_DIALOG_CONFIRM", true);
  }
};

const mutations = {
    SET_REGISTER_DATA(state, oData){
      state.registerData = oData;
    },
    SET_REGISTER_DEF_DATA(state){
      state.registerData = {
        Fullname: "",
        Email: "",
        Role: "ZINTRANET_BTECH_ALL",
        DepartmentId: "",
        BranchId: "WRO",
        Language: "PL"
      }
    }
};

const getters = {
  getRegisterToRead(state){
    return state.dataToRead;
  },
  getRegistratinData(state){
    return state.registerData;
  }
};


export default {
  state,
  actions,
  getters,
  mutations
}
