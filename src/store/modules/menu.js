import axios from 'axios'
import router from '@/router/index.js'

const state = {
    showMenu: true,
    showMenuOverlay: false,
    menuAuth: ""
};

const mutations = {
    SET_DISPLAY_MENU (state, show) {
        state.showMenu = show
    },
    SET_MENU_OVERLAY (state, show) {
        state.showMenuOverlay = show
    },
    CLEAR_AUTH_DATA() {
        localStorage.clear();
        var cookies = document.cookie.split(";");
        for (var i = 0; i < cookies.length; i++) {
            var cookie = cookies[i];
            var eqPos = cookie.indexOf("=");
            var name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
            document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT";
        }

    },
    SET_MENU_AUTH(state, oAuth) {
        state.menuAuth = oAuth;
    }
};

const actions = {
    logout({commit}){
        // let URL2 = "?sap-user=''&sap-password=''&sap-language=''"
        var URL1 = window.location.origin + "/api/sap/public/bc/icf/logoff"
        axios.get(URL1).then(res => {
            // axios({
            //     method: 'get',
            //     url: URL2,
            //     statusCode: { 401: function() {
            //         //This empty handler function will prevent authentication pop-up in chrome/firefox
            //     } }
            //   }).then(res => {
            //     console.log(res)
            //     commit('CLEAR_AUTH_DATA');
            //   }).catch(error => {
            //     console.log(error)
            // })
            commit('CLEAR_AUTH_DATA');
            localStorage.setItem('authorized', "false")
            router.replace('/');
        }).catch(error => {
            localStorage.setItem('authorized', "false");
            commit('CLEAR_AUTH_DATA');
            router.replace('/');
            console.log(error)
        })
    },
    setSideMenu({}, obj) {
        if(obj.event) {
            /* If user clicks Hamburger Menu button in component header: MENU and OVERLAY are displayed for small screen devices */
            if (obj.window.matchMedia("(max-width:40rem)").matches && obj.event.type === "click") {
                state.showMenu =  true
                state.showMenuOverlay = true
            /* If user resizes app window: MENU and OVERLAY are automatically hidden for very small screen devices */
            } else if (obj.window.matchMedia("(max-width:40rem)").matches && obj.event.type === "resize") {
                state.showMenu =  false
                state.showMenuOverlay = false
            /* If user uses app on large screen device: MENU must always be visible and OVERLAY must never be visible  */
            } else  {
                state.showMenu = true; 
                state.showMenuOverlay = false;
            }
        /* On start of application on small screen device: display MENU and OVERLAY */ 
        } else if (obj.window.matchMedia("(max-width:40rem)").matches) {
            state.showMenu = true
            state.showMenuOverlay = true
        } 
    }
    
};

const getters = {
    getShowMenu(state){
        return state.showMenu
    },
    getShowMenuOverlay(state) {
        return state.showMenuOverlay
    },
    getMenuAuth(state){
        return state.menuAuth;
    }
};

export default {
    state,
    mutations,
    actions,
    getters
}