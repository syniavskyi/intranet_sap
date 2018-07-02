import axios from 'axios'
import router from '@/router/index.js'

const state = {
    showMenu: true
};

const mutations = {
    DISPLAY_MENU (state, show) {
        state.showMenu = show
    }
};

const actions = {
    logout({commit}){
        var token = localStorage.getItem('token')
        var URL = '/api/logout?access_token=' + token
        axios.get(URL).then(res => {
            console.log(res)
            commit('CLEAR_AUTH_DATA');
            localStorage.removeItem('expirationDate')
            localStorage.removeItem('username')
            localStorage.removeItem('role')
            localStorage.removeItem('token')
            commit('DISPLAY_MENU', false);
            router.replace('/');
        }).catch(error => {
            console.log(error)
        })
    },
};

const getters = {
    showMenu(state){
        return state.showMenu
    }
};

export default {
    state,
    mutations,
    actions,
    getters
}