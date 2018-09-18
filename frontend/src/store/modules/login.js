import axios from 'axios'
import router from '@/router/index.js'

const state = {
  loginError: false,
  sendEmailSuccess: false,
  sendEmailError: false,
  username: null,
  userId: null,
  urlQuery: null
}

const mutations = {
  SET_LOGIN_ERROR(state, isError) {
    state.loginError = isError
  },
  SET_EMAIL_SUCCESS(state, isSuccess) {
    state.sendEmailSuccess = isSuccess
  },
  SET_EMAIL_ERROR(state, isError) {
    state.sendEmailError = isError
  },
  GET_USER_ID(state, data) {
    state.userId = data;
  },
  SET_URL_QUERY(state, data) {
    state.urlQuery = data
  }
}

const actions = {
  login({
    commit,
    dispatch,
    getters
  }, authData) {
    // commit('CLEAR_AUTH_DATA');
    var params = new URLSearchParams()
    params.append('sap-user', authData.username)
    params.append('sap-password', authData.password)
    let url = '?sap-user=' + authData.username + '&sap-password=' + authData.password + '&sap-language=' +authData.language

    axios({
      method: 'get',
      url: url,
      headers: {
        "Content-type": "application/atom+xml; charset=utf-8",
        "X-CSRF-Token": "Fetch",
        "X-Requested-With" : "XMLHttpRequest",
        "DataServiceVersion" : "2.0"
      },
      data: params
    }).then(res => {
      localStorage.setItem('authorized', true)
      console.log(res)
      commit('SET_URL_QUERY', url)
      commit('SET_LOGIN_ERROR', false)
      // commit('AUTH_USER', res.data.access_token)
      // commit('DISPLAY_MENU', true)
      let userData = {
        user: authData.username,
        lang: authData.language
      } 
      dispatch('loadData', userData)
      if (getters.isDataLoaded){
        router.replace('/dashboard')
      }
      }).catch(error => {
      console.log(error)
      commit('SET_LOGIN_ERROR', true)
    })
  },
  showStarterPage({
    commit,
    state
  }) {
    var URL = '/api/users/' + state.userId + '/showStarterPage';

    axios.get(URL).then(res => {
      const data = res.data;

      // console.log(data);
      if (data) {
        router.replace('/starterpage')
      } else {
        router.replace('/dashboard')
      }
    })
  },
  tryAutoLogin({
    commit,
    dispatch
  }) {
    commit('SET_LOGIN_ERROR', false)
    const token = localStorage.getItem('token')
    if (!token) {
      return
    }
    const expirationDate = localStorage.getItem('expirationDate')
    const now = new Date()
    if (now >= expirationDate) {
      return
    }
    dispatch('loadData', token)
    commit('AUTH_USER', token)
    commit('DISPLAY_MENU', true);
    router.replace('/dashboard');
  },
  sendEmailWithPass({
    commit,
    dispatch,
    getters
  }, email) {
    dispatch('generatePassword')
    var params = new URLSearchParams()
    params.append('password', getters.hashedPassword)
    params.append('plain_password', getters.password)
    params.append('email', email)

    axios({
      method: 'post',
      url: '/api/user/password/reset',
      headers: {
        "Content-type": "application/x-www-form-urlencoded; charset=utf-8"
      },
      data: params
    }).then(res => {
      commit('SET_EMAIL_SUCCESS', true)
    }).catch(error => {
      commit('SET_EMAIL_ERROR', true)
      console.log(error)
    })
  },
}

const getters = {
  isAuthenticated(state) {
    return state.idToken !== null
  },
  isLoginError(state) {
    return state.loginError
  },
  isSendEmailSuccess(state) {
    return state.sendEmailSuccess
  },
  isSendEmailError(state) {
    return state.sendEmailError
  },
  getUrlQuery(state){
    return state.urlQuery
  }
}

export default {
  state,
  mutations,
  actions,
  getters
}



// getUserRole({commit}, access_token){
//     var URL = '/api/getCurrentRole?access_token=' + access_token
//     axios.get(URL).then(res => {
//         const role = res.data[0].authority
//         localStorage.setItem('userRole', role)
//         commit('SET_USER_ROLE', role)
//     }).catch(error => {
//         console.log(error)
//     })
// },
