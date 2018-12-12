const state = {
    isDialogOpen: false,
    isError: false
}

const getters = {
    getDisplayConfirmDialog(state) {
        return state.isDialogOpen;
    },
    getDialogErrorStatus(state) {
        return state.isError;
    }
}

const mutations = {
    SET_DIALOG_CONFIRM(state, show) {
        state.isDialogOpen = show;
    },
    SET_DIALOG_ERROR_STATUS(state, data) {
        state.isError = data;
    }
}

export default {
    state,
    getters,
    mutations
}