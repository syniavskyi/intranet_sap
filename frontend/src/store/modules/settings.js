import { app } from '../../main'
import i18n from '../../lang/lang'

const state = {
    languageList: [
        { id: 'en', description: i18n.t('select.language.english') },
        { id: 'pl', description: i18n.t('select.language.polish')  }
    ]
}

const mutations = {
    SET_LANG(state, language) {
        app.$i18n.locale = language
    },
    SET_LANG_LIST(state, list) {
       state.languageList = list
    }
}

const actions = {
    setLanguage({commit, getters}, language) {
        commit('SET_LANG', language)
        var newList = [
            { id: 'en', description: i18n.t('select.language.english') },
            { id: 'pl', description: i18n.t('select.language.polish')  }
        ]
        commit('SET_LANG_LIST', newList)
    }
}

const getters = {
    languageList(state) {
        return state.languageList
    }
}

export default {
    state,
    mutations,
    actions,
    getters
}