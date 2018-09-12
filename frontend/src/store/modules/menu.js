import axios from 'axios'
import router from '@/router/index.js'

const state = {
    showMenu: true
};

const mutations = {
    SET_DISPLAY_MENU (state, show) {
        state.showMenu = show
    }
};

const actions = {
    logout({commit}){
        let URL2 = "?sap-user=''&sap-password=''&sap-language=''"
        var URL1 = " http://nw5.local.pl:8050/sap/public/bc/icf/logoff"
        axios.get(URL1).then(res => {
            axios({
                method: 'get',
                url: URL2,
                statusCode: { 401: function() {
                    //This empty handler function will prevent authentication pop-up in chrome/firefox
                } }
              }).then(res => {
                console.log(res)
                commit('CLEAR_AUTH_DATA');
              }).catch(error => {
                console.log(error)
            })
            localStorage.setItem('authorized', false)
            router.replace('/');
        }).catch(error => {
            console.log(error)
        })
    },
};

const getters = {
    getShowMenu(state){
        return state.showMenu
    }
};

export default {
    state,
    mutations,
    actions,
    getters
}