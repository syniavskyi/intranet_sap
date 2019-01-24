const state = {
    showToast: false,
    timeoutRunning: false,
    showModal: false,
    headerModalClass: ''
}

const mutations = {
    SET_SHOW_MODAL(state, data) {
        state.showModal = data;
    },
    SET_HEADER_MODAL_CLASS(state, data) {
        state.headerModalClass = data;
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
    displayModal({commit, getters}, headers) {
        let jsonStr = headers["sap-message"];
        if(jsonStr) {
            try {
              let messageObj = JSON.parse(jsonStr);
              commit('SET_MESSAGE_LOG', messageObj.details);
              commit('SET_SHOW_MODAL', true);
              if(messageObj.details.find(o => o.severity === 'error')) {
                commit('SET_HEADER_MODAL_CLASS', 'modal-header-err');
              } else if(messageObj.details.find(o => o.severity === 'warning') ){
                commit('SET_HEADER_MODAL_CLASS', 'modal-header-war');
              } else {
                commit('SET_HEADER_MODAL_CLASS', 'modal-header-info');
              }
            }
            catch(err){}
        } else if (headers.status) {
            // if ()
        }
    }
}

const getters = {
    getDisplayToast(state) {
        return state.showToast
    },
    getShowModal(state){
        return state.showModal;
    },
    getHeaderModalClass(state) {
        return state.headerModalClass;
    }
}

export default {
    state,
    mutations,
    actions,
    getters
}