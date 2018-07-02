import axios from 'axios'
import router from '@/router/index.js'

const state = {
    idToken: null,
    password: '',
    hashedPassword: '',
    userRole: ''    
}

const mutations = {
    CLEAR_AUTH_DATA (state){
        state.idToken = null;
    },
    SET_PASSWORD (state, data) {
        state.password = data;
    },
    SET_USER_ROLE (state, role) {
        state.userRole = role;
    },
    SET_HASHED_PASSWORD (state, password) {
        state.hashedPassword = password
    }    
}

const actions = {
        generatePassword({commit, state}) {
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
    password(state) {
        return state.password;
    },
    hashedPassword(state) {
        return state.hashedPassword;
    }
}
const createRateDate = function(rateDate) {
    let day = parseFloat(moment(rateDate).format('D')),
      month = parseFloat(moment(rateDate).format('M')),
      dayOfWeek = parseFloat(moment(rateDate).weekday())
        
    if (dayOfWeek === 6) {
      if (day !== 1 ) {
        day = day - 1 
        rateDate.setDate(day)
      } else {
        rateDate = new Date(rateDate.getFullYear(), rateDate.getMonth() - 1, 0)
      }
    } else if (dayOfWeek === 0) {
      if (day !== 1 ) {
        day = day - 2 
        rateDate.setDate(day)
      } else {
        rateDate = new Date(rateDate.getFullYear(), rateDate.getMonth() - 1, 0)
        day = moment(rateDate).format('D')
        day = day - 1 
        rateDate.setDate(day)
      }
    }
  
    return rateDate
  }

export default {
    actions,
    mutations,
    state,
    getters,
    createRateDate
}


        // const bcrypt = require('bcryptjs')
        // bcrypt.genSalt(10, (error, salt) => {
        //     bcrypt.hash(sRetVal, salt, (err, hash) => {
        //         console.log(hash)
        //         commit('SET_HASHED_PASSWORD', hash)
        //     })
        // })