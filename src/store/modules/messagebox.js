const state = {
    isMessageBoxOpen: false
}

const getters = {
    getDisplayMessageBox(state) {
        return state.isMessageBoxOpen;
    }
}

const mutations = {
    SET_MESSAGE_BOX(state, show) {
        state.isMessageBoxOpen = show;
    }
}

export default {
    state,
    getters,
    mutations
}
