import axios from 'axios'
import router from '@/router/index.js'

const state = {
  loginError: false,
  sendEmailSuccess: false,
  sendEmailError: false,
  username: null,
  userId: null
}

const mutations = {
  AUTH_USER(state, token) {
    state.idToken = token;
  },
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
  }
}

const actions = {
  login({
    commit,
    dispatch
  }, authData) {
    commit('CLEAR_AUTH_DATA');
    const md5 = require('js-md5')
    var hashedPassword = md5(authData.password)
    var params = new URLSearchParams()
    params.append('grant_type', 'password')
    params.append('username', authData.username)
    params.append('password', hashedPassword)
    axios({
      method: 'post',
      url: 'oauth/token',
      auth: {
        username: 'vuejs-client',
        password: 'password'
      },
      headers: {
        "Content-type": "application/x-www-form-urlencoded; charset=utf-8"
      },
      data: params
    }).then(res => {
      console.log(res)
      commit('SET_LOGIN_ERROR', false)
      commit('AUTH_USER', res.data.access_token)
      commit('DISPLAY_MENU', true)

      localStorage.setItem('token', res.data.access_token)
      dispatch('getUserId');
      dispatch('setExpirationDate', res.data.expires_in)
      dispatch('setLogoutTimer', res.data.expires_in)
      dispatch('loadData', res.data.access_token)

      router.replace('/dashboard')
    }).catch(error => {
      console.log(error)
      commit('SET_LOGIN_ERROR', true)
    })
  },
  getUserId({commit, dispatch}) {
    var URL = '/api/getIdByToken?access_token=' + localStorage.getItem('token');

    axios.get(URL).then(res => {
      const data = res.data;

      commit('GET_USER_ID', data);
      dispatch('showStarterPage');
    })
  },
  showStarterPage({commit, state}) {
    var URL = '/api/users/' + state.userId + '/showStarterPage';

    axios.get(URL).then(res => {
      const data = res.data;

      // console.log(data);
      if(data) {
        router.replace('/starterpage')
      } else {
        router.replace('/dashboard')
      }
    })
  },
  setLogoutTimer({
    commit,
    dispatch
  }, expirationTime) {
    setTimeout(() => {
      dispatch('logout')
    }, expirationTime * 1000)
  },
  setExpirationDate({
    commit
  }, expiresIn) {
    const now = new Date()
    const expirationDate = new Date(now.getTime() + expiresIn * 1000)
    localStorage.setItem('expirationDate', expirationDate);
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
