import axios from 'axios'

const state = {
  loginForgotPassModal: false,
  loginError: false,
  sendEmailSuccess: false,
  sendEmailError: false,
  username: null,
  urlQuery: null,
  password: null,
  hashedPassword: null,
  token: '',
  cookie: '',
  dataToRead: ["Adverts", "Events"]
}

const mutations = {
  SET_LOG_FORGOT_PASS_MODAL(state, show) {
    state.loginForgotPassModal = show
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
  SET_URL_QUERY(state, data) {
    state.urlQuery = data
  },
  SET_PASSWORD(state, data) {
    state.password = data;
  },
  SET_HASHED_PASSWORD(state, password) {
    state.hashedPassword = password;
  },
  SET_LOGIN_ALIAS(state, data) {
    state.username = data;
  },
  SET_TOKEN(state, data) {
    state.token = data;
  },
  SET_COOKIE(state, data) {
    state.cookie = data;
  }
}

const actions = {
  login({
    commit,
    dispatch,
    getters
  }, authData) {
    let url = `?sap-user=${authData.username}&sap-password=${authData.password}&sap-language=${authData.language}`;
    commit('SET_LOGIN_ALIAS', authData.username.toUpperCase());
    axios({
      method: 'get',
      url: url,
      headers: {
        "Content-type": "application/x-www-form-urlencoded; charset=utf-8",
        "X-CSRF-Token": "Fetch",
        "X-Requested-With": "XMLHttpRequest",
        "Cache-Control": "no-cache"
      }
    }).then(res => {
      localStorage.setItem('authorized', true);
      localStorage.setItem('id', authData.username.toUpperCase());
      localStorage.setItem('lang', authData.language.toUpperCase());
      commit('SET_URL_QUERY', url);
      commit('SET_LOGIN_ERROR', false);
      let sToken = res.request.getResponseHeader('x-csrf-token');
      commit('SET_TOKEN', sToken);
      commit('SET_COOKIE', res.request.getResponseHeader("Cookie"));

      commit('SET_PROMISE_TO_READ', getters.getDataToRead );

      let userData = {
          // user: authData.username,
          // lang: authData.language,
          changePage: true
      };
      dispatch('getData', userData);
    }).catch(error => {
      console.log(error);
      commit('SET_LOGIN_ERROR', true);
      commit('SET_DISPLAY_LOADER', false);
    })
  },
  sendEmailWithPass({
    commit, dispatch
  }, email) {
    axios({
      method: 'post',
      url: '/api/user/password/reset',
      headers: {
        "Content-type": "application/x-www-form-urlencoded; charset=utf-8"
      },
      data: params
    }).then(res => {
      commit('SET_EMAIL_SUCCESS', true);
      let message = res.headers;
      dispatch('displayModal', message);
    }).catch(error => {
      commit('SET_EMAIL_ERROR', true);
      console.log(error)
    })
  },
  generatePassword({
    commit
  }) {
    const md5 = require('js-md5')

    var nLength = 8,
      sCharset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+~`|}{[]\:;?><,./-=",
      sRetVal = "";

    for (var i = 0, n = sCharset.length; i < nLength; ++i) {
      sRetVal += sCharset.charAt(Math.floor(Math.random() * n));
    }

    var hash = md5(sRetVal)
    commit('SET_HASHED_PASSWORD', hash)
    commit('SET_PASSWORD', sRetVal)
  }
}

const getters = {
  getLoginPassModal(state) {
    return state.loginForgotPassModal
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
  getUrlQuery(state) {
    return state.urlQuery
  },
  password(state) {
    return state.password;
  },
  hashedPassword(state) {
    return state.hashedPassword;
  },
  getLoginAlias(state) {
    return state.username;
  },
  getToken(state) {
    return state.token;
  },
  getCookie(state) {
    if(state.cookie){
      return state.cookie;
    } else {
      return document.cookie;
    }
  },
  getDataToRead(state){
    return state.dataToRead;
  }
}

export default {
  state,
  mutations,
  actions,
  getters
}
