import axios from 'axios'
import router from '@/router/index.js'
import { stat } from 'fs';
import jsontoxml from 'jsontoxml'
import js2xml from 'js2xmlparser'
import moment from 'moment'

const state = {
  priorityColor: '',
  selectedDate: null,
  addEvent: {
    EventName: '',
    EventTime: null,
    DateFrom: null,
    DateTo:  null,
    Description:  '',
    Priority:  '',
    EventType:  '',
    TargetGroup:  '',
    EventPrivacy:  '',
    color: '',
    EventTypeName: '' 
  },
  clearedFilters: {
    branch: null,
    department: null,
    employee: null
  },
  // event: {},
  aEvents: [],
  aPriority: [],
  aEventType: [],
  editedData: {}
};

const mutations = {
  SET_COLOR_PRIORITY(state, data) {
    state.priorityColor = data;
  },
//   SET_EVENT(state, data) {
//     state.event = data;
// },
  SET_EVENTS(state, data) {
    state.aEvents = data;
  },
  SET_PRIORITY(state, data) {
    state.aPriority = data;
  },
  SET_EVENT_TYPE(state, data) {
    state.aEventType = data;
  },
  SET_DATE_FROM(state, data) {
    state.selectedDate = data;
  },
  CLEAR_DATA(state, data) {
    state.addEvent = data;
  },
  SET_CLEARED_FILTERS(state, data) {
    state.clearedFilters = data;
  }
}

const actions = {
  setColorPriority({getters, commit}) {
    let color = '';
    let prior = getters.addEvent.Priority;

    switch(prior) {
      case 'L':
        color = '#fde997';
        break;
      case 'M':
        color = '#fc9354';
        break;
      case 'H':
        color = '#ff6666';
        break;
      default:
        color: 'blue';
    }
    commit('SET_COLOR_PRIORITY', color);
  },
//   getEvent({commit}) {
//     axios({
//       method: 'GET',
//       url: 'Events' + '(' + "'006'" + ')',
//       auth: {
//         username: 'psy',
//         password: 'ides01'
//       },
//       headers: {
//         "Content-type": "application/x-www-form-urlencoded; charset=utf-8"
//       }
//     }).then(res => {
//       let oEvent = res.data.d.results;
//       oEvent.EventTime = oEvent.slice(2, 4) + ':' + oEvent.slice(5, 7) + ':' + oEvent.slice(8, 10)
//       commit('SET_EVENT', oEvent);
//     }).catch(error => { 
//       console.log(error);
//      })
// },
getEvents({commit, dispatch, getters}) {
  let urlQuery = getters.getUrlQuery
    axios({
      method: 'GET',
      url: 'Events' + urlQuery,
      headers: {
        "Content-type": "application/x-www-form-urlencoded; charset=utf-8"
      }
    }).then(res => {
      let oEvents = res.data.d.results;
      commit('SET_EVENTS', oEvents);
      dispatch('convertDate');
      dispatch('setColor')
    }).catch(error => { 
      console.log(error);
    })
},
convertDate({getters, commit}) {
  let oEvents = getters.events;
  for(let i = 0; i<oEvents.length; i++) {
      let milisc = parseInt(oEvents[i].DateFrom.slice(6, oEvents[i].DateFrom.length - 2));
      oEvents[i].DateFrom = new Date(milisc);
      let format = oEvents[i].EventTime.slice(2, 4) + oEvents[i].EventTime.slice(5, 7) + oEvents[i].EventTime.slice(8, 10);
      oEvents[i].EventTime = moment(format, "hmm").format('HH:mm:ss');
      // oEvents[i].EventTime.slice(2, 4) + ':' + oEvents[i].EventTime.slice(5, 7) + ':' + oEvents[i].EventTime.slice(8, 10);
      //  let w = oEvents[14].EventTime.slice(2, 4) + oEvents[14].EventTime.slice(5, 7) + oEvents[14].EventTime.slice(8, 10);
      // let r = moment(w).format('LTS');
      // let s = moment(w, "hmm").format("HH:mm");
    if(oEvents[i].DateTo) {
      let miliscTo = parseInt(oEvents[i].DateTo.slice(6, oEvents[i].DateTo.length - 2));
      oEvents[i].DateTo = new Date(miliscTo);
    } 
    else {
      oEvents[i].DateTo =  oEvents[i].DateFrom;
    }
  }
  commit('SET_EVENTS', oEvents);
},
setColor({commit, getters}){
     const aEvents = getters.events;
     for(let i = 0; i<aEvents.length; i++) {
        if(aEvents[i].Priority == "L") {
            aEvents[i].color = '#fde997';
          } else if (aEvents[i].Priority == "M") {
            aEvents[i].color =='#fc9354';
          } else {
             aEvents[i].color = '#ff6666';
          }
        }
     commit('SET_EVENTS', aEvents);
  },
  addNewEvent({getters, dispatch}) {
     const eventData = getters.addEvent
     eventData.DateFrom = getters.getSelectedDate;
     if(!eventData.DateTo) {
      eventData.DateTo = eventData.DateFrom;
    } 
    dispatch('setColorPriority');
    
    const   props = {
       "d:CreatedBy": '',
       "d:EventName": eventData.EventName,
       "d:Description": eventData.Description,
       "d:EventTime": eventData.EventTime,
       "d:EventTypeName": eventData.EventTypeName,
       "d:PriorityValue":'',
       "d:DateFrom": '2018-08-02T00:00:00',
       "d:EventPrivacy": 'PRV',
       "d:TargetGroup":'',
       "d:Branch": '',
       "d:Department": 'Fiori',
       "d:DateTo": '2018-08-02T00:00:00',
       "d:Employee": '',
       "d:Priority": 'M',
       "d:EventType": 'TRN'
       }

     let xml = js2xml.parse("m:properties", props)

     let xmlRequest = getters.getPreHtmlForRequest + xml + getters.getPostHtmlForRequest

     axios({
      method: 'POST',
      url: '/Events',
      auth: {
        username: 'psy',
        password: 'ides01'
      },
      // data: bodyFormData,
      data: xmlRequest,
      headers: {
        "Content-Type": "application/atom+xml; type=entry; charset=utf-8",
        "X-Requested-With": "XMLHttpRequest"
      },

      // config: { headers: {'Content-Type': 'multipart/form-data' }}
    }).then(res => {
      let c = res.config;
    }).catch(error => { 
      console.log(error);
    })
     state.addEvent.color = state.priorityColor
     state.aEvents.push(eventData);
      
  },
  editEvent({commit, getters, dispatch}) {
    let editedData = getters.addEvent;
    let aEvents = getters.events;
    let pos = aEvents.findIndex(x => x.EventId === editedData.EventId);
    aEvents[pos] = editedData;
    dispatch('getEvents');
    commit('SET_EVENTS', aEvents);
    axios({
      method: 'PUT',
      url: 'Events' + "('" + editedData.EventId + "')",
      //  auth: {
      //   username: 'psy',
      //   password: 'ides01'
      // }
      // CreatedBy: editedData.CreatedBy,
      // DateFrom: editedData.DateFrom, 
      // EventPrivacy: editedData.EventPrivacy,
      // EventId: editedData.EventId,
      // Branch: editedData.Branch,
      // Description: editedData.Description,
      // Department: editedData.Department,
      // EventName: editedData.EventName,
      // DateTo: editedData.DateTo,
      // Employee: editedData.Employee,
      // EventTime: editedData.EventTime,
      // Priority: editedData.Priority,
      // EventType: editedData.EventType,
      // auth: {
      //   username: 'psy',
      //   password: 'ides01'
      // },
      // headers: {
      //   "Content-type": "application/x-www-form-urlencoded; charset=utf-8"
      // }
    }).then(res => {
      // i co dalej
      // let aPriority = res.data.d.results;
      // dispatch('getEvents')
      // commit('SET_PRIORITY', aPriority);
    }).catch(error => { 
      console.log(error);
    })

  },
  removeEvent({commit, state}) {
    // let editedData = state.addEvent;
    // let aEvents = state.aEvents;
    // let pos = aEvents.findIndex(x => x.EventId === editedData.EventId);
    // let pos2 = aEvents.find(x => x.EventId === editedData.EventId).foo;
    axios({
      method: 'DELETE',
      url: 'Events' + "('" + '004' + "')",
      auth: {
        username: 'psy',
        password: 'ides01'
      },
      headers: {
        "Content-type": "application/x-www-form-urlencoded; charset=utf-8"
      }
    }).then(res => {
      console.log(res)
        // state.aEvents.splice(pos, 1);
    }).catch(error => { 
      console.log(error);
    })
  },
  clearForm({commit}) {
    let clearForm = {
          EventName: null,
          EventTime: null,
          DateFrom: null,
          DateTo:  null,
          Description: null,
          Priority: null,
          EventType: null,
          TargetGroup: null,
          EventPrivacy: null,
          color: null
         };
  commit('CLEAR_DATA', clearForm);
  },
clearFilters({commit}) {
  let aFilters = {
        branch: null,
        department: null,
        employee: null
    }
   commit('SET_CLEARED_FILTERS', aFilters);
}
};

const getters = {
  priorityColor() {
    return state.priorityColor;
  },  
  event(state) {
    return state.event;
},
  events(state) { 
    return state.aEvents;
 },
 priorities(state) {
   return state.aPriority;
 },
 eventTypes(state) {
   return state.aEventType;
 },
 addEvent(state) {
   return state.addEvent;
 },
 clearedFilters(state) {
   return state.clearedFilters;
 },
 getSelectedDate(state){
   return state.selectedDate
 }
};

export default {
  state,
  mutations,
  actions,
  getters
};
