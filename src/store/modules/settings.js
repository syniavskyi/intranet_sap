import {
  app
} from '../../main'
import i18n from '../../lang/lang'

const state = {
  languageList: [{
      id: 'en',
      description: i18n.t('select.language.english')
    },
    {
      id: 'pl',
      description: i18n.t('select.language.polish')
    }
  ],
  loginLanguage: '',
  selectedCvLang: ''
}

const mutations = {
  SET_LANG(state, language) {
    app.$i18n.locale = language;
    state.selectedCvLang = language;
  },
  SET_LANG_LIST(state, list) {
    state.languageList = list;
  },
  SET_LOGIN_LANGUAGE(state, language) {
    state.loginLanguage = language;
  }
  // login language is not changing after logging into application, but 
  // set_lang mutation is changing language in which app is curretly displayed
}

const actions = {
  setLanguage({
    commit,
    getters
  }, language) {
    commit('SET_LOGIN_LANGUAGE', language);
    commit('SET_LANG', language);
    var newList = [{
        id: 'en',
        description: i18n.t('select.language.english')
      },
      {
        id: 'pl',
        description: i18n.t('select.language.polish')
      }
    ]
    commit('SET_LANG_LIST', newList);
  },
}

const getters = {
  getLanguageList(state) {
    return state.languageList;
  },
  getLoginLanguage(state) {
    return state.loginLanguage;
  },
  getSelectedCvLang(state) {
    return state.selectedCvLang;
  }
}

export default {
  state,
  mutations,
  actions,
  getters
}
