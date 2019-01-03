import axios from 'axios'
import moment from 'moment'
let utils = require('../../../utils')

const state = {
   userAvail: [],
   newLeaveForUser: {
       TypeId: null,
       UserId: null,
       StatusId: null,
       DateStart: null,
       DateEnd: null
   },
   newHoliday: {},
   cityToHolidayRequest: ['Dąbrowa Górnicza', 'Katowice', "Warszawa", "Wrocław"],
   typesToHolidayRequest: ["Bezpłatny", "Okolicznościowy", "Opieka nad dzieckiem", "Wypoczynkowy", "Za inny dzień"]
};

const mutations = {
    // set list with user availability
    SET_USER_AVAIL(state, userAvail) {
        state.userAvail = userAvail
    },
    // set data to holiday request
    SET_NEW_HOLIDAY(state, data) {
        state.newHoliday = data
    }
};

const actions = {
    getUserAvail({}, userId) { 
     //get user availability for calendar and editing availability 
            return axios({
              method: 'GET',
              url: "UserAvailabilities?$filter=UserId eq '" + userId + "'",
              headers: {
                "Content-type": "application/x-www-form-urlencoded; charset=utf-8"
              }
            });
    },
    formatUserLeaves({commit, getters}, userAvail){
        // set projects data with props for calendar 
            const typesList = getters.getAvailType
                for (let i=0; i<userAvail.length; i++) {
                    for (let j=0; j<typesList.length; j++){
                        if (userAvail[i].TypeId === typesList[j].Key) {
                            userAvail[i].TypeName = typesList[j].Value
                        } 
                    }
                }
                for (let i=0; i<userAvail.length; i++) {
                  let avail = userAvail[i]
                  avail.Color = userAvail[i].StatusId === 'PL' ? '#fde692' : '#cff09e'
                  avail.Order = userAvail[i].StatusId === 'PL' ? 1 : 2
                  avail.EntryId = i
                  avail.DateStart = utils.dateStringToObj(avail.DateStart)
                  avail.DateEnd = utils.dateStringToObj(avail.DateEnd)
                }
                commit('SET_USER_AVAIL', userAvail)
                commit('SET_DISPLAY_LOADER', false)

        },
    removeUserAvail({commit, getters, dispatch}, data) {
    let sToken = getters.getToken;    
        let url = "UserAvailabilities(UserId='" + data.UserId + "',TypeId='" + data.TypeId + "',DateStart=datetime'" + moment(data.DateStart).format("YYYY-MM-DD") + "T00:00:00" + "',DateEnd=datetime'" + moment(data.DateEnd).format("YYYY-MM-DD") + "T00:00:00')";
        axios({
        url: url,
        method: 'delete',
        headers: {
            "Content-Type": "application/json",
            "X-Requested-With": "XMLHttpRequest",
            "Cache-Control": "no-cache",
            "x-csrf-token": sToken
        }
        }).then(res => {
            dispatch('hideAllMessages')
            commit('SET_REMOVE_ERROR', false)
            commit('SET_REMOVE_SUCCESS', true)
            let message = res.headers;
            dispatch('displayModal', message);
        }).catch(error => {
            dispatch('hideAllMessages');
            commit('SET_REMOVE_ERROR', true)
            commit('SET_REMOVE_SUCCESS', false)
        })
    },
    addUserLeave({commit, getters, dispatch}) {
        if(!getters.getNewLeaveForUser.StatusId) {
            getters.getNewLeaveForUser.StatusId = "PL";
        }
        let data  = JSON.parse(JSON.stringify(getters.getNewLeaveForUser)),
             url = 'UserAvailabilities',
             sToken = getters.getToken;
        axios({
          url: url,
          method: 'post',
          data: data,
          headers: {
              "Content-Type": "application/json",
              "X-Requested-With": "XMLHttpRequest",
              "Cache-Control": "no-cache",
              "x-csrf-token": sToken
          }
        }).then(res => {
            getters.getUserAvail.push(data);
            let message = res.headers;
            dispatch('displayModal', message);
            commit("SET_PROMISE_TO_READ", ["NewToken", "Availabilities"]);
            dispatch('getData');
          }).catch(error => {
        })
    },
    updateUserAvail({commit, getters, dispatch}, data) {
        let sToken = getters.getToken;
        data.DateStart = utils.formatDateForBackend(data.DateStart);
        data.DateEnd = utils.formatDateForBackend(data.DateEnd);
        data.DateStartToChange = utils.formatDateForBackend(data.DateStartToChange);
        data.DateEndToChange = utils.formatDateForBackend(data.DateEndToChange);
        delete data.Color;
        delete data.EntryId;
        delete data.Order;
        delete data.TypeName;
        let url = "UserAvailabilities(UserId='" + data.UserId + "',TypeId='" + data.TypeId + "',DateStart=datetime'" + moment(data.DateStartToChange).format("YYYY-MM-DD") + "T00:00:00" + "',DateEnd=datetime'" + moment(data.DateEndToChange).format("YYYY-MM-DD") + "T00:00:00')"
        axios({
        url: url,
        method: 'put',
        data: data,
        headers: {
            "Content-Type": "application/json",
            "X-Requested-With": "XMLHttpRequest",
            "Cache-Control": "no-cache",
            "x-csrf-token": sToken
        }
        }).then(res => {
            let message = res.headers;
            dispatch('displayModal', message);
            commit("SET_PROMISE_TO_READ", ["NewToken", "Availabilities"]);
            dispatch('getData');
        }).catch(error => {
        })
        }
};

const getters = {
    getUserAvail(state){
        return state.userAvail
    },
    getNewLeaveForUser(state){
        return state.newLeaveForUser
    },
    getCityToHolidayRequest(state) {
        return state.cityToHolidayRequest;
    },
    getTypesToHolidayRequest(state) {
        return state.typesToHolidayRequest;
    },
    getHoliday(state) {
        return state.newHoliday;
    }
};

export default {
    state,
    mutations,
    actions,
    getters
}