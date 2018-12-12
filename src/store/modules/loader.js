const state = {
    showLoader: false,
    showAdvertsLoader: false
}

const mutations = {
    SET_DISPLAY_LOADER({mutation}, show) {
        state.showLoader = show;
    },
    SET_ADVERTS_LOADER({mutation}, show){
        state.showAdvertsLoader = show;
    }
}

const getters = {
    getDisplayLoader(state) {
        return state.showLoader
    },
    getAdvertsLoader(state){
        return state.showAdvertsLoader;
    }
}

export default {
    state,
    mutations,
    getters
}