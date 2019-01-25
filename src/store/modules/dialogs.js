import router from '@/router/index.js';
const state = {
  warningDialog: false,
  leavePageDialog: false,
  leavePageFlag: false,
  nextPath: "",
  sessionLogout: false,
  photoToLargeDialog: false,
  axiosInterceptorErr: false
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
  }
}

const actions = {
  resolvePageLeave({
    commit,
    getters
  }) {
    commit('SET_LEAVE_PAGE_DIALOG', false)
    commit('SET_LEAVE_PAGE_FLAG', true)
    router.replace(getters.getNextPath)
  },
  rejectPageLeave({
    commit
  }) {
    commit('SET_LEAVE_PAGE_DIALOG', false)
    commit('SET_LEAVE_PAGE_DIALOG', false)
  },
  logoutSession({
    commit
  }, setStatus) {
    commit('SET_SESSION_LOGOUT', setStatus)
  }
}
const getters = {
  getWarningDialog: state => {
    return state.warningDialog
  },
  getLeavePageDialog: state => {
    return state.leavePageDialog
  },
  getLeavePageFlag: state => {
    return state.leavePageFlag
  },
  getNextPath: state => {
    return state.nextPath
  },
  getSessionStatus: state => state.sessionLogout,
  getSubmitPhotoErr: state => state.photoToLargeDialog,
  getAxiosInterceptorModal: state => state.axiosInterceptorErr
}

export default {
  state,
  getters,
  mutations,
  actions
}
