
import axios from 'axios'

let utils = require('../../utils')

const state = {
  currencyList: [
    {id: 'PLN'},
    { id: 'EUR' },
    { id: 'CHF' },
    { id: 'USD' }
  ],
  //total costs in pln
  totalCosts: {
    accPayback: 0,
    othPayback: 0,
    trvPayback: 0,
    totalPayback: 0,
    accomodation: 0,
    travel: 0,
    others: 0,
    amount: 0,
    advance: 0
  },
  //totalcosts in currency of delegation
  totalCostsInCurr: {
    accPayback: 0,
    othPayback: 0,
    trvPayback: 0,
    totalPayback: 0,
    accomodation: 0,
    flatRateForAcc: 0,
    travel: 0,
    others: 0,
    amount: 0,
    advance: 0
  },
  newDelegation: {
    number: null,
    userId: localStorage.getItem("id"),
    createDate: null,
    destination: null,
    purpose: null,
    hours: 0,
    totalAllowance: 0,
    currency: 'PLN',
    totalReturnAmount: 0,
    totalDelegationAmount: 0,
    allowanceDeduction: 0
  },
  newDelegationValidated: false,
  dailyAllowance: 30.00,
  NewDelegationNumber: null,
  showConfirmDelegation: false,
  createDelegationSuccess: null,
  dataToRead: ["Domains", "Industries", "UserList", "UserData"],
  delegationAuth: ""
};

const mutations = {
  SET_TOTAL_COST_DATA(state, list) {
    state.totalCosts = list
  },
  SET_NEW_DELEGATION_VALIDATED(state, isValidated) {
    state.newDelegationValidated = isValidated
  },
  SET_NEW_DELEGATION(state, delegation) {
    state.newDelegation = delegation
  },
  SET_TOTAL_COST_CURR_DATA(state, list) {
    state.totalCostsInCurr = list
  },
  SET_NEW_DELEG_NO(state, number) {
    state.NewDelegationNumber = number
  },
  SET_SHOW_CONFIRM_DELEG(state, show) {
    state.showConfirmDelegation = show
  },
  SET_CREATE_DELEG_SUCCESS(state, isSuccess) {
    state.createDelegationSuccess = isSuccess
  },
  SET_DELEGATION_AUTH(state, sAuth){
    state.delegationAuth = sAuth;
  }
};

const actions = {
  checkNewDelegation({
    getters,
    commit
  }) {
    const data = getters.getNewDelegation
    for (let key in data) {
      if (!data[key]) {
        commit('SET_NEW_DELEGATION_VALIDATED', false)
        return
      } else {
        commit('SET_NEW_DELEGATION_VALIDATED', true)
      }

    }
  },
  countAllowance({
    getters,
    dispatch
  }) {
    const newDelegation = getters.getNewDelegation,
      defaultCostsData = getters.getDefaultCostsData,
      dailyAll = getters.getDailyAllowance

    const startDate = newDelegation.dates.start,
      endDate = newDelegation.dates.end,
      startHour = defaultCostsData.firstLeaveHour,
      endHour = defaultCostsData.secondArrivalHour

    let allowance, totalDays, remainder

    if (startHour && endHour) {
      startDate.setHours(startHour.slice(0, 2), startHour.slice(3, 5), 0, 0)
      endDate.setHours(endHour.slice(0, 2), endHour.slice(3, 5), 0, 0)

      const totalHours = Math.ceil(Math.abs(endDate - startDate) / 36e5)

      if (totalHours <= 8) {
        allowance = 0
      } else {
        if (totalHours <= 12) {
          allowance = dailyAll * 0.5
        } else {
          totalDays = Math.floor(totalHours / 24)
          remainder = totalHours % 24
          if (remainder === 0) {
            allowance = totalDays * dailyAll
          } else if (remainder <= 8) {
            allowance = (totalDays + 0.5) * dailyAll
          } else {
            allowance = (totalDays + 1) * dailyAll
          }
        }
      }
      newDelegation.hours = totalHours
      newDelegation.totalAllowance = allowance
      dispatch('checkNewDelegation')
    }
  },
  toggleTile({}, element) {
    let height;
    if (element.elChild.className === "delegations-table-wrapper" || element.elChild.className === "delegations-table-travel-wrapper") {
      let tableHeight = Array.prototype.reduce.call(element.elChild.firstElementChild.childNodes, function(p, c) {
        return p + (c.offsetHeight || 0);
      }, 0),
      footerHeight = Array.prototype.reduce.call(element.elChild.lastElementChild.childNodes, function(p, c) {
        return p + (c.offsetHeight || 0)
      }, 0)
      height = (footerHeight + tableHeight)
    } else {
      height = Array.prototype.reduce.call(element.elChild.childNodes,
        function(p, c) {
          return p + (c.offsetHeight || 0);
        }, 0)
    }
    height = height + 16 + "px"
    if (!element.el.style.height || element.el.style.height == "0px") {
        element.el.style.height = height
        // element.el.style.overflow = "visible"
        element.el.style.opacity = "1"
    } else {
        element.el.style.height = "0px"
        element.el.style.overflow = "hidden"
        element.el.style.opacity = "0";
    }
  },
  setHiddenOverflow({}, el) {
    if (el.lastChild.style) {
      el.lastChild.style.overflow = 'hidden'
    }
  },
  setVisibleOverflow({}, el) {
    if (el.lastChild.style) {
      el.lastChild.style.overflow = 'visible'
    }
  },
  calcHeight({}, element) {
    let height;
    if (element.elChild.className === "delegations-table-wrapper" || element.elChild.className === "delegations-table-travel-wrapper") {
      let tableHeight = Array.prototype.reduce.call(element.elChild.firstElementChild.childNodes, function(p, c) {
        return p + (c.offsetHeight || 0);
      }, 0),
      footerHeight = Array.prototype.reduce.call(element.elChild.lastElementChild.childNodes, function(p, c) {
        return p + (c.offsetHeight || 0)
      }, 0)
      height = (footerHeight + tableHeight)
    } else {
      height = Array.prototype.reduce.call(element.elChild.childNodes,
        function(p, c) {
          return p + (c.offsetHeight || 0);
        }, 0)
    }
    height = height + 16 + "px"
    return height;
  },

  checkWidthAndToggle({}, element) {
    const x = window.matchMedia("(max-width: 64rem)"),
          z = window.matchMedia("(min-width: 64.1rem)")
    let el = element.el.lastChild
      if (x.matches || z.matches) {
        if (element.el.lastChild.style.height) {
          if (element.el.lastChild.style.height != "0px") {
            let elChild = element.el.lastChild.firstChild
            const name = {el, elChild}
            this.dispatch("calcHeight", name).then(height => {
              height = height
              if (element.el.lastChild.style.height != height) {
                  this.dispatch("toggleTile", name);
                }
            })
          }
        }
      }
  },
 countAllCosts({getters, dispatch}){
    const accCosts = getters.getAccomodationCostData,
          otherCosts = getters.getOtherCostData,
          trvCosts = getters.getTravelCostData,
          advanceData = getters.getAdvanceData

    for (let i =0; i<accCosts.length; i++) {dispatch('getAccCostRate', i)}
    for (let i =0; i<otherCosts.length; i++) {dispatch('getOtherCostRate', i)}
    for (let i =0; i<trvCosts.length; i++) {dispatch('getTravelRate', i)}
    for (let i =0; i<advanceData.length; i++) {dispatch('getAdvanceRate', i)}
    },
    countTotalCost({getters}){
      const  totalCostsInCurr = getters.getTotalCostsInCurr

      totalCostsInCurr.amount =  0
      totalCostsInCurr.amount =  totalCostsInCurr.travel + totalCostsInCurr.accomodation + totalCostsInCurr.others - allDeduction
    },
    getDelegationNumber({commit}, data) {
      let url = "Delegations(DelegDate=" + data.DelegDate + ",UserId='" + data.UserAlias + "')"
      axios({
        method: 'GET',
        url: url,
        headers: {
          "Content-type": "application/x-www-form-urlencoded; charset=utf-8"
        }
      }).then(res => {
        commit('SET_NEW_DELEG_NO', res.data.d.DelegNo)
      }).catch(error => {
      })
    },
    saveDelegationNumber({commit, dispatch, getters}){
        const oDelegation = getters.getNewDelegation
        let data = {
            UserId: oDelegation.userId,
            DelegDate: utils.formatDateForBackend(oDelegation.dates.start),
            DelegNo: getters.getNewDelegationNumber
        }

        axios({
          method: 'POST',
          url: 'Delegations',
          data: data,
          headers: {
              "Content-Type": "application/json",
              "X-Requested-With": "XMLHttpRequest",
              "Cache-Control": "no-cache",
              "x-csrf-token": getters.getToken
          }
        }).then(res => {
          commit('SET_CREATE_DELEG_SUCCESS',true)
          dispatch('clearDelegationForm')
          commit('SET_SHOW_CONFIRM_DELEG', false)
          let message = res.headers;
          dispatch('displayModal', message);
        }).catch(error => {
          commit('SET_CREATE_DELEG_SUCCESS',false)
        })

     },
     clearDelegationForm({commit}){
      const totalCosts= {
        accPayback: 0,
        othPayback: 0,
        trvPayback: 0,
        totalPayback: 0,
        accomodation: 0,
        travel: 0,
        others: 0,
        amount: 0,
        advance: 0
      }
      commit('SET_TOTAL_COST_DATA', totalCosts)

      const totalCostsInCurr = {
        accPayback: 0,
        othPayback: 0,
        trvPayback: 0,
        totalPayback: 0,
        accomodation: 0,
        flatRateForAcc: 0,
        travel: 0,
        others: 0,
        amount: 0,
        advance: 0
      }
      commit('SET_TOTAL_COST_CURR_DATA', totalCostsInCurr)

      const newDelegation = {
        number: null,
        userId: null,
        createDate: null,
        destination: null,
        purpose: null,
        hours: 0,
        totalAllowance: 0,
        currency: 'PLN',
        totalReturnAmount: 0,
        totalDelegationAmount: 0,
        allowanceDeduction: 0
      }
      commit('SET_NEW_DELEGATION', newDelegation)
      commit('SET_NEW_DELEGATION_VALIDATED', false)

      const costAccomodationData = [{
        docDate: null,
        company: null,
        docNo: null,
        payback: false,
        currency: 'PLN',
        amount: 0,
        totalAmount: 0,
        flatRate: false,
        flatRateDays: null,
        totalAmount: 0,
        currencyRate: 1,
        rateDate: null, //total  amount in delegation curr and rate for it
        totalAmountInCurr: 0,
        delegationCurrRate: 1
      }]

      commit('SET_COST_ACCOMODATION_DATA', costAccomodationData)
      commit('SET_ACC_COSTS_VALIDATED', false)

      const advanceData = [{
        date: null,
        currency: null,
        amount: 0, // totalAmountInPln
        totalAmount: 0,
        currencyRate: 1,
        rateDate: null, //total  amount in delegation curr and rate for it
        totalAmountCurr: 0,
        delegationCurrRate: 1
        }]
      commit('SET_ADVANCE_DATA', advanceData)
      commit('SET_ADVANCE_VALIDATED', false)

      const otherCostData = [{
        docDate: null,
        company: null,
        docNo: null,
        payback: false,
        currency: 'PLN',
        amount: 0,
        totalAmount: 0,
        currencyRate: 1,
        rateDate: null, //total  amount in delegation curr and rate for it
        totalAmountCurr: 0,
        delegationCurrRate: 1
      }]
      commit('SET_OTHER_COST_DATA', otherCostData)
      commit('SET_OTHER_COSTS_VALIDATED', false)

      const costTravelData= [{
        docDate: null,
        company: null,
        docNo: null,
        payback: false,
        currency: 'PLN',
        amount: 0,
        totalAmount: 0,
        transport: null,
        licensePlateNo: null,
        flatRate: null,
        engineCapacity: null,
        kilometers: 0,
        currencyRate: 1,
        rateDate: null, //total  amount in delegation curr and rate for it
        totalAmountCurr: 0,
        delegationCurrRate: 1
      }]
      commit('SET_COST_TRAVEL_DATA', costTravelData)
      commit('SET_TRV_COSTS_VALIDATED', false)
      commit('SET_DEFAULT_COST_DATA', {})
      commit('SET_DELEG_COST_LIST', [])
      commit('SET_DELEGATION_TABLE_VALIDATED', false)
      commit('SET_NEW_DELEG_NO', null)
      commit('SET_CREATE_DELEG_SUCCESS', null)
     }
};


const getters = {
  getCurrencyList(state) {
    return state.currencyList
  },
  getNewDelegationValidated(state) {
    return state.newDelegationValidated
  },
  getTotalCosts(state) {
    return state.totalCosts
  },
  getNewDelegation(state) {
    return state.newDelegation
  },
  getDailyAllowance(state) {
    return state.dailyAllowance
  },
  getTotalCostsInCurr(state){
    return state.totalCostsInCurr
  },
  getNewDelegationNumber(state){
    return state.NewDelegationNumber
  },
  getShowConfirmDelegation(state){
    return state.showConfirmDelegation
  },
  getCreateDelegSuccess(state){
    return state.createDelegationSuccess
  },
  getDelegationToRead(state){
    return state.dataToRead;
  },
  getDelegationAuth(state){
    return state.delegationAuth;
  }
};

export default {
  state,
  mutations,
  actions,
  getters
}
