const state = {
    warningDialog: false,
    leavePageDialog: false,
    leavePageFlag: null
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
    }
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
    }
}

const actions = {
    resolvePageLeave({commit}) {
        commit('SET_LEAVE_PAGE_DIALOG', false)
        return true
    },
    rejectPageLeave({commit}) {
        commit('SET_LEAVE_PAGE_DIALOG', false)
        return false
    },
    leavePageProfile() {
        return new Promise((fnResolve, fnReject) => {
            this.resolvePageLeave = fnResolve
            this.rejectPageLeave = fnReject
        })
    }
}

export default {
    state,
    getters,
    mutations
}