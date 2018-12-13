import Vue from 'vue'
import VueI18n from 'vue-i18n'

import en from './i18n/en.json'
import pl from './i18n/pl.json'
import de from './i18n/de.json'
import ua from './i18n/ua.json'

Vue.use(VueI18n)

var userLang = localStorage.getItem('lang') || navigator.language || navigator.userLanguage; 
var locale = userLang.slice(0, 2).toLowerCase();

if (locale !== 'pl' && locale !== 'en' && locale !== 'de' && locale !== 'ua') {
    locale = 'en';
}

const messages = {
    pl: pl,
    en: en,
    de: de,
    ua: ua
}

const i18n = new VueI18n({
    locale,
    messages
})


export default i18n