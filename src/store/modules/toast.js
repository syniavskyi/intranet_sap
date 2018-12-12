const state = {
    showToast: false,
    timeoutRunning: false,
    showModal: false
}

const mutations = {
    SET_SHOW_MODAL(state, data) {
        state.showModal = data;
    }
}

const actions = {
    displayToast({dispatch}, time) {
        state.showToast = true
        if (!time) time = 4000
        if (!state.timeoutRunning) {
            setTimeout(() => { state.showToast = false
                               state.timeoutRunning = false;
                            }, time)
            state.timeoutRunning = true
        }
    },
    //modal is dialog with message logs from backned
    closeModal({commit}) {
        commit('SET_SHOW_MODAL', false)
    },
    displayModal({commit}, headers) {
          let jsonStr = headers["sap-message"];
          if(jsonStr) {
            try{
              let messageObj = JSON.parse(jsonStr);
              commit('SET_MESSAGE_LOG', messageObj.details);
              commit('SET_SHOW_MODAL', true);
             }
            catch(err){}
          }
    }
}

const getters = {
    getDisplayToast(state) {
        return state.showToast
    },
    getShowModal(state){
        return state.showModal;
    }
}

export default {
    state,
    mutations,
    actions,
    getters
}