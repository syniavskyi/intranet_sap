import axios from 'axios'

let utils = require('../../utils');

const state = {
  priorityColor: '',
  selectedDate: null,
  addEvent: {
    EventName: '',
    EventTime: null,
    DateFrom: null,
    DateTo: null,
    Description: '',
    Priority: 'L',
    EventType: '',
    TargetGroup: [],
    EventPrivacy: 'PBL',
    color: '',
    EventTypeName: '',
    Employee: []
  },
  clearedFilters: {
    branch: null,
    department: null,
    employee: null
  },
  aEvents: [],
  aPriority: [],
  aEventType: [],
  editedData: {},
  dataToRead: ["NewToken", "Domains", "Industries", "UserData", "UserList", "Events"],
  calendarAuth: "",
  dialogEvent: false
};

const mutations = {
  SET_COLOR_PRIORITY(state, data) {
    state.priorityColor = data;
  },
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
  SET_CLEARED_DATA(state, data) {
    state.addEvent = data;
  },
  SET_CLEARED_FILTERS(state, data) {
    state.clearedFilters = data;
  },
  SET_CALENDAR_AUTH(state, sAuth){
    state.calendarAuth = sAuth;
  },
  SET_DIALOG_EVENT(state, data) {
    state.dialogEvent = data;
  }
}

const actions = {
  // set color for new event
  setColorPriority({
    getters,
    commit
  }) {
    let color = '';
    let prior = getters.getEventToChange.Priority;

    switch (prior) {
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
  getEvents({}) {
    return axios({
      method: 'GET',
      url: 'Events',
      headers: {
        "Content-type": "application/x-www-form-urlencoded; charset=utf-8"
      }
    })
  },
  convertDate({
    getters,
    commit
  }) {
    let oEvents = getters.getAllEvents;
    for (let event of oEvents) {
      event.DateFrom = utils.dateStringToObj(event.DateFrom);
      event.DateTo = event.DateTo ? utils.dateStringToObj(event.DateTo) : event.DateFrom
      event.EventTime = utils.formatTimeForCalendar(event.EventTime);
    }
    commit('SET_EVENTS', oEvents);
  },
  // set colors for downloaded data
  setColor({
    commit,
    getters
  }) {
    const aEvents = getters.getAllEvents;
    for (let event of aEvents) {
      if (event.Priority == "L") {
        event.color = '#fde997';
      } else if (event.Priority == "M") {
        event.color = '#fc9354';
      } else {
        event.color = '#ff6666';
      }
    }
    commit('SET_EVENTS', aEvents);
  },
  addNewEvent({
    getters,
    dispatch,
    commit
  }, data) {
    data.DateTo = !data.DateTo ? data.DateFrom : data.DateTo;
    let eventData = utils.createClone(data);
    eventData.DateFrom = utils.formatDateForBackend(data.DateFrom);
    eventData.DateTo = !eventData.DateTo ? eventData.DateFrom : utils.formatDateForBackend(eventData.DateTo);
    if(eventData.EventTime){
      eventData.EventTime = utils.formatTimeForBackend(eventData.EventTime);
    }
    eventData = utils.formatToString(eventData);
    delete eventData.color;
    let url = 'Events';
    axios({
      url: url,
      method: 'post',
      data: eventData,
      headers: {
          "Content-Type": "application/json",
          "X-Requested-With": "XMLHttpRequest",
          "Cache-Control": "no-cache",
          "x-csrf-token": getters.getToken
      }
    }).then(res => {
        data.EventId = res.data.d.EventId;
        dispatch('setColorPriority');
        state.addEvent.color = state.priorityColor
        let aEvents = getters.getAllEvents;
        aEvents.push(data);
        commit("SET_EVENTS", aEvents);
        let message = res.headers;
        dispatch('displayModal', message);
        commit("SET_PROMISE_TO_READ", ["NewToken", "Events"]);
        dispatch('getData');
      }).catch(error => {
    })
  },
  editEvent({
    commit,
    getters, dispatch
  },data) {
    let eventData = utils.createClone(data);
    eventData.DateFrom = utils.formatDateForBackend(data.DateFrom);
    eventData.DateTo = !eventData.DateTo ? eventData.DateFrom : utils.formatDateForBackend(eventData.DateTo);
    if(eventData.EventTime){
      eventData.EventTime = utils.formatTimeForBackend(eventData.EventTime);
    }
    eventData = utils.formatToString(eventData);
    delete eventData.color;
    const url = 'Events' + '(' + "EventId='" + eventData.EventId + "')";
      let sToken = getters.getToken;
      axios({
        url: url,
        method: 'put',
        data: eventData,
        headers: {
            "Content-Type": "application/json",
            "X-Requested-With": "XMLHttpRequest",
            "Cache-Control": "no-cache",
            "x-csrf-token": sToken
        }
      }).then(res => {
          let aEvents = getters.getAllEvents;
          let pos = aEvents.findIndex(x => x.EventId === eventData.EventId);
         if (data.Action === 'U') {
          commit('SET_CLEARED_DATA', eventData);
          aEvents[pos] = data;
         } else {
          aEvents.splice(pos, 1);
          commit('SET_EVENTS', aEvents);
         }
          commit('SET_EVENTS', aEvents);
          let message = res.headers;
          dispatch('displayModal', message);
          commit("SET_PROMISE_TO_READ", ["NewToken", "Events"]);
          dispatch('getData');
        }).catch(error => {
      })
  },
  clearForm({
    commit, getters
  }) {
    let clearForm = {
      EventName: null,
      EventTime: null,
      DateFrom: getters.getDateFrom,
      DateTo: null,
      Description: null,
      Priority: 'L',
      EventType: null,
      TargetGroup: [],
      Employee: [],
      EventPrivacy: 'PBL',
      color: null
    };
    commit('SET_CLEARED_DATA', clearForm);
  },
  clearFilters({
    commit
  }) {
    let aFilters = {
      branch: null,
      department: null,
      employee: null
    }
    commit('SET_CLEARED_FILTERS', aFilters);
  },
  performDialog({getters, commit}) {
    let bDialog = !getters.getDialogEvent;
    commit('SET_DIALOG_EVENT', bDialog);
  }
};

const getters = {
  priorityColor() {
    return state.priorityColor;
  },
  getAllEvents(state) {
    return state.aEvents;
  },
  getPriorities(state) {
    return state.aPriority;
  },
  getEventTypes(state) {
    return state.aEventType;
  },
  getEventToChange(state) {
    return state.addEvent;
  },
  getClearedFilters(state) {
    return state.clearedFilters;
  },
  getSelectedDate(state) {
    return state.selectedDate
  },
  getEventsToRead(state){
    return state.dataToRead;
  },
  getCalendarAuth(state){
    return state.calendarAuth;
  },
  getDialogEvent(state) {
    return state.dialogEvent;
  },
   getDateFrom(state) {
     return state.selectedDate;
   }
};

export default {
  state,
  mutations,
  actions,
  getters
};
