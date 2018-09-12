import axios from 'axios'
import moment from 'moment'
import router from '@/router/index.js'
import odata from 'odata'
// import i18n from '../../lang/lang'

let utils = require('../../../utils')

const state = {
    userExperience: [],
    showExperienceError: false
}

const mutations = { 
    SET_USER_EXPERIENCE(state, list, moment) {
        state.userExperience = list
    },
    SET_EXPERIENCE_ERROR(state, isError) {
        state.showExperienceError = isError
    }
}

const actions = {
    addUserExperience({getters, commit}){
        const userExp = getters.getUserExperience
        userExp.push({
            DateStart: null,
            DateEnd: null,
            Employer: null,
            WorkPos: null,
            IsCurrent: false,
            Duplicated: null,
            WorkPosToChange: null,
            EmployerToChange: null,
            DateStartToChange: null,
            DateEndToChange: null,
            Duplicated: null,
            Language: null

        })
    },
    removeUserExperience({getters}, index){
        const userExp = getters.getUserExperience,      
        data = userExp[index]

        data.Language = 'PL'
        data.UserAlias = 'UIO'
        
        const url = 'UserExperiences' + '(' + "UserAlias='"+ data.UserAlias + "',Language='" + data.Language + "',WorkPos='" + data.WorkPos + "',Employer='" + data.Employer + "',DateStart=datetime'" + moment(data.DateStart).format("YYYY-MM-DD") + "T00:00:00')"
  
        odata(url).remove().save(function (data) {
          console.log("removed");
          userExp.splice(index, 1)
        }, function (status) {
          console.error(status); 
        });
    },
    saveNewUserExp({getters}, data) {
        data.UserAlias = 'UIO'
        data.DateStart = utils.formatDateForBackend(data.DateStart)
        data.DateEnd = utils.formatDateForBackend(data.DateEnd)
        data.IsCurrent = data.IsCurrent ? 'X' : '-'
        odata('UserExperiences').post(data).save(function (data) {
          console.log("Working");
        }, function (status) {
          console.error(status); 
        });
    },
    updateUserExp({getters}, data){
        data.UserAlias = 'UIO'

        data.DateStart = utils.formatDateForBackend(data.DateStart)
        data.DateEnd = utils.formatDateForBackend(data.DateEnd)
        data.IsCurrent = data.IsCurrent ? 'X' : '-'
    
        const url = 'UserExperiences' + '(' + "UserAlias='"+ data.UserAlias + "',WorkPos='" + data.WorkPosToChange + "',Employer='" + data.EmployerToChange + "',Language='" + data.Language + "',DateStart=datetime'" + moment(data.DateStartToChange).format("YYYY-MM-DD") + "T00:00:00')"
        
        data.DateStartToChange = utils.formatDateForBackend(data.DateStartToChange)
        data.DateEndToChange = utils.formatDateForBackend(data.DateEndToChange)
        
        odata(url).put(data).save(function (data) {
          console.log("changed");
        }, function (status) {
          console.error(status); 
        });
    },

}

const getters = {
    getUserExperience(state) {
        return state.userExperience
    }
}

export default {
    state,
    mutations,
    actions,
    getters
}