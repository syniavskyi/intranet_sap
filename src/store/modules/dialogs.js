import router from '@/router/index.js';
const state = {
  warningDialog: false,
  leavePageDialog: false,
  leavePageFlag: false,
  nextPath: "",
  sessionLogout: false,
  photoToLargeDialog: false,
  axiosInterceptorErr: false,
  showCV: false //show cv dialog
}

const mutations = {
  SET_WARNING_DIALOG(state, show) {
    state.warningDialog = show
  },
  SET_LEAVE_PAGE_DIALOG(state, show) {
    state.leavePageDialog = show
  },
  SET_LEAVE_PAGE_FLAG(state, leave) {
    state.leavePageFlag = leave
  },
  SET_NEXT_PATH(state, data) {
    state.nextPath = data;
  },
  SET_SESSION_LOGOUT(state, status) {
    state.sessionLogout = status
  },
  SET_SUBMIT_PHOTO_ERR_DIALOG(state, show) {
    state.photoToLargeDialog = show
  },
  SET_AXIOS_INTERCEPTOR_MODAL(state, show) {
    state.axiosInterceptorErr = show
  },
  SET_SHOW_CV(state, data) { //cv dialog, check if is clicked
    state.showCV = data
  }
}

const actions = {
  resolvePageLeave({
    commit,
    getters
  }) {
    commit('SET_LEAVE_PAGE_DIALOG', false)
    commit('SET_LEAVE_PAGE_FLAG', true)
    getters.showCV ? router.replace(getters.getNextPath) : commit("SET_SHOW_CV_DIALOG", true);
    commit('SET_SHOW_CV', false)
  },
  rejectPageLeave({
    commit
  }) {
    commit('SET_LEAVE_PAGE_DIALOG', false)
    commit('SET_LEAVE_PAGE_DIALOG', false)
    commit('SET_SHOW_CV', false)
  },
  logoutSession({
    commit
  }, setStatus) {
    commit('SET_SESSION_LOGOUT', setStatus)
  }
}
const getters = {
  getWarningDialog: state => state.warningDialog,
  getLeavePageDialog: state => state.leavePageDialog,
  getLeavePageFlag: state => state.leavePageFlag,
  getNextPath: state => state.nextPath,
  getSessionStatus: state => state.sessionLogout,
  getSubmitPhotoErr: state => state.photoToLargeDialog,
  getAxiosInterceptorModal: state => state.axiosInterceptorErr,
  getShowCV: state => state.showCV
}

export default {
  state,
  getters,
  mutations,
  actions
}
