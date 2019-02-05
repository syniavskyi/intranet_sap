import axios from 'axios'
import router from '@/router/index.js'

const state = {
    showMenu: true,
    showMenuOverlay: false,
    menuAuth: "",
    menuClicked: false
};

const mutations = {
    SET_DISPLAY_MENU (state, show) {
        state.showMenu = show
    },
    SET_MENU_OVERLAY (state, show) {
        state.showMenuOverlay = show
    },
    SET_MENU_AUTH(state, oAuth) {
        state.menuAuth = oAuth;
    },
    SET_MENU_CLICKED(state, bool) {
        state.menuClicked = bool
    } 
};

const actions = {
    logout({dispatch}){
        var URL1 = window.location.origin + "/api/sap/public/bc/icf/logoff"
        axios.get(URL1).then(res => {
            dispatch('clearAuthData');
            localStorage.setItem('authorized', "false")
            router.replace('/');
        }).catch(error => {
            localStorage.setItem('authorized', "false");
            dispatch('clearAuthData');
            router.replace('/');
        })
            localStorage.setItem('authorized', "false");
            dispatch('clearAuthData');
            router.replace('/');
    },
    setSideMenu({commit}, obj) {
        if(obj.event) {
            /* If user clicks Hamburger Menu button in component header: MENU and OVERLAY are displayed for small screen devices */
            if (obj.window.matchMedia("(max-width:40rem)").matches && obj.event.type === "click") {
                if (getters.getMenuClicked) {
                    commit('SET_DISPLAY_MENU', true)
                    commit('SET_MENU_OVERLAY', true)
                }
            /* If users scrolls on small screen device and Link Bar gets hidden it emits a resize event, than it is checked if user opened menu with a Button to prevent hiding menu on page/menu scroll */
            } else if (obj.window.matchMedia("(max-width:40rem)").matches && obj.event.target.screen.orientation.type === "portrait-primary" && obj.event.type === "resize") { 
                if (getters.getMenuClicked === true) {
                    commit('SET_DISPLAY_MENU', true)
                    commit('SET_MENU_OVERLAY', true)
                } else if (getters.getMenuClicked === false) {
                    commit('SET_DISPLAY_MENU', false)
                    commit('SET_MENU_OVERLAY', false)
                }
            /* On resize event on large screen devices always display MENU and never display OVERLAY */
            } else if (obj.window.matchMedia("(min-width:40rem)").matches && obj.event.target.screen.orientation.type === "landscape-primary" && obj.event.type === "resize") {
                commit('SET_DISPLAY_MENU', true)
                commit('SET_MENU_OVERLAY', false)
            /* On resize event on large screen devices always hide MENU and OVERLAY */
            } else if (obj.window.matchMedia("(max-width:40rem)").matches && obj.event.target.screen.orientation.type === "landscape-primary" && obj.event.type === "resize") {
                commit('SET_DISPLAY_MENU', false)
                commit('SET_MENU_OVERLAY', false)
            }
        /* on small and large screen devices and tiny browser Width always initially Hide menu and Overlay  */
        } else if ((obj.window.matchMedia("(max-width:40rem)").matches && obj.window.screen.orientation.type === "portrait-primary") || 
                    (obj.window.matchMedia("(max-width:40rem)").matches && obj.window.screen.orientation.type === "landscape-primary")) {
            commit('SET_DISPLAY_MENU', false)
            commit('SET_MENU_OVERLAY', false)
        }
    }, clearAuthData() {
        localStorage.clear();
        var cookies = document.cookie.split(";");
        for (var i = 0; i < cookies.length; i++) {
            var cookie = cookies[i];
            var eqPos = cookie.indexOf("=");
            var name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
            document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT";
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
    },
    getMenuClicked(state) {
        return state.menuClicked
    }
};

export default {
    state,
    mutations,
    actions,
    getters
}