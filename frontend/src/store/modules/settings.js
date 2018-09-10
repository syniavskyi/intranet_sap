import { app } from '../../main'
import i18n from '../../lang/lang'

const state = {
    languageList: [
        { id: 'en', description: i18n.t('select.language.english') },
        { id: 'pl', description: i18n.t('select.language.polish')  }
    ],
    postHtmlForRequest: '</m:properties></content></entry>',
    preHtmlForRequest: '<?xml version="1.0" encoding="utf-8"?>'
                        +'<entry xml:base="http://nw5.local.pl:8050/sap/opu/odata/SAP/ZGW_INTRANET_SRV/" xmlns="http://www.w3.org/2005/Atom" xmlns:m="http://schemas.microsoft.com/ado/2007/08/dataservices/metadata" xmlns:d="http://schemas.microsoft.com/ado/2007/08/dataservices">'
                        +'<content type="application/xml">'
                        +'<m:properties>',
    loginLanguage: ''    
}

const mutations = {
    SET_LANG(state, language) {
        app.$i18n.locale = language;
    },
    SET_LANG_LIST(state, list) {
       state.languageList = list;
    },
    SET_LOGIN_LANGUAGE(state, language) {
        state.loginLanguage = language;
    }
}

const actions = {
    setLanguage({commit, getters}, language) {
        commit('SET_LOGIN_LANGUAGE', language);
        commit('SET_LANG', language);
        var newList = [
            { id: 'en', description: i18n.t('select.language.english') },
            { id: 'pl', description: i18n.t('select.language.polish')  }
        ]
        commit('SET_LANG_LIST', newList);
    },
}

const getters = {
    languageList(state) {
        return state.languageList;
    },
    getPreHtmlForRequest(state){
        return state.preHtmlForRequest;
    },
    getPostHtmlForRequest(state){
        return state.postHtmlForRequest;
    },
    getLoginLanguage(state) {
        return state.loginLanguage;
    }
}

export default {
    state,
    mutations,
    actions,
    getters
}