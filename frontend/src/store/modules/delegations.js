
import odata from 'odata'
import axios from 'axios'

let utils = require('../../utils')

const state = {
  delegationCostsList: [],
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
  },
  newDelegationValidated: false,
  delegationTableValidated: false,
  defaultCostsData: {},
  fullExpences: [],
  dailyAllowance: 30.00,
  NewDelegationNumber: null,
  showConfirmDelegation: false,
  createDelegationSuccess: null
};

const mutations = {
  SET_DELEG_COST_LIST(state, list) {
    state.delegationCostsList = list
  },
  SET_COST_TABLE_DATA(state, list) {
    state.costTableData = list
  },
  SET_TOTAL_COST_DATA(state, list) {
    state.totalCosts = list
  },
  SET_NEW_DELEGATION_VALIDATED(state, isValidated) {
    state.newDelegationValidated = isValidated
  },
  SET_DELEGATION_TABLE_VALIDATED(state, isValidated) {
    state.newDelegationValidated = isValidated
  },
  SET_FULL_EXPENCES(state, list) {
    state.fullExpences = list
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
  CREATE_DELEG_SUCCESS(state, isSuccess) {
    state.createDelegationSuccess = isSuccess
  },
  SET_DEFAULT_COST_DATA(state, data) {
    state.defaultCostsData = data
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
  checkDelegationTable({
    getters,
    commit,
    dispatch
  }) {
    dispatch('prepareCostData')
    const expences = getters.getFullExpences
    for (let i = 0; i < expences.length; i++) {
      let arrayItem = expences[i]
      for (let key in arrayItem) {
        if (!arrayItem[key] || arrayItem[key] === "__:__" || arrayItem[key] === "") {
          commit('SET_DELEGATION_TABLE_VALIDATED', false)
          return
        } else {
          commit('SET_DELEGATION_TABLE_VALIDATED', true)
        }
      }
    }
  },
  addDelegationRow({
    commit,
    getters
  }) {
    const delegationCostsList = getters.getDelegationCostsList
    delegationCostsList.push({
      leavePlace: null,
      leaveDate: null,
      leaveHour: null,
      arrivalPlace: null,
      arrivalDate: null,
      arrivalHour: null,
      distance: null,
      cost: null
    })
    commit('SET_DELEG_COST_LIST', delegationCostsList)
    commit('SET_DELEGATION_TABLE_VALIDATED', false)
  },
  removeDelegationRow({
    commit,
    getters,
    dispatch
  }, index) {
    const delegationCostsList = getters.getDelegationCostsList
    delegationCostsList.splice(index, 1)
    commit('SET_DELEG_COST_LIST', delegationCostsList)
    dispatch('checkDelegationTable')
  },
  prepareCostData({
    getters,
    commit
  }) {
    const costs = [],
      customCosts = getters.getDelegationCostsList,
      defaultCostsData = getters.getDefaultCostsData,
      newDelegation = getters.getNewDelegation
    for (let i = 0; i < customCosts.length; i++) {
      costs[i] = Object.assign({}, customCosts[i])
    }
    const firstDefaultCost = {
      leavePlace: defaultCostsData.firstLeavePlace,
      leaveDate: newDelegation.dates.start,
      leaveHour: defaultCostsData.firstLeaveHour,
      arrivalPlace: newDelegation.destination,
      arrivalDate: newDelegation.dates.start,
      arrivalHour: defaultCostsData.firstArrivalHour
    }
    const secondDefaultCost = {
      leavePlace: newDelegation.destination,
      leaveDate: newDelegation.dates.end,
      leaveHour: defaultCostsData.secondLeaveHour,
      arrivalPlace: defaultCostsData.secondArrivalPlace,
      arrivalDate: newDelegation.dates.end,
      arrivalHour: defaultCostsData.secondArrivalHour
    }
    costs.push(firstDefaultCost)
    costs.push(secondDefaultCost)
    commit('SET_FULL_EXPENCES', costs)
  },
  countAllowance({
    getters,
    commit,
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
    if (element.elChild.className === "delegations-table-wrapper") {
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
        // element.el.addEventListener("transitionend", (e) => {
        //   if (e.propertyName === "height")
        //   element.el.style.overflow = "visible"  
        // })
        element.el.style.overflow = "visible"
        element.el.style.opacity = "1"
    } else {
        element.el.style.height = "0px"
        element.el.style.overflow = "hidden"
        element.el.style.opacity = "0";
    }
  },

  calcHeight({}, element) {
    let height;
    if (element.elChild.className === "delegations-table-wrapper") {
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

  countAllCosts({getters, commit, dispatch}){
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
    getDelegationNumber({commit, getters}, data) {
      
      let urlQuery = getters.getUrlQuery
      let url = "Delegations(DelegDate=" + data.DelegDate + ",UserId='" + data.UserAlias + "')" +urlQuery
      axios({
        method: 'GET',
        url: url,
        headers: {
          "Content-type": "application/x-www-form-urlencoded; charset=utf-8"
        }
      }).then(res => {
        commit('SET_NEW_DELEG_NO', res.data.d.DelegNo)
        console.log(res.data.d);
      }).catch(error => {
        console.log(error);
      })
    },
    saveDelegationNumber({commit, dispatch, getters}){
        const oDelegation = getters.getNewDelegation
        let urlQuery = getters.getUrlQuery
        let data = {
            UserId: oDelegation.userId,
            DelegDate: utils.formatDateForBackend(oDelegation.dates.start),
            DelegNo: getters.getNewDelegationNumber
        }
        
        axios({
          method: 'POST',
          url: 'Delegations' + urlQuery,
          data: data,
          headers: {
            "X-Requested-With": "XMLHttpRequest"
          }
        }).then(res => {
          commit('CREATE_DELEG_SUCCESS',true)
          dispatch('clearDelegationForm')
        }).catch(error => { 
          console.log(error);
          commit('CREATE_DELEG_SUCCESS',false)
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
      commit('SET_FULL_EXPENCES', [])
      commit('SET_NEW_DELEG_NO', null)
      commit('CREATE_DELEG_SUCCESS', null)
     }


  
};


const getters = {
  getDelegationCostsList(state) {
    return state.delegationCostsList
  },
  getCurrencyList(state) {
    return state.currencyList
  },
  getNewDelegationValidated(state) {
    return state.newDelegationValidated
  },
  getTotalCosts(state) {
    return state.totalCosts
  },
  getDelegationCostsList(state) {
    return state.delegationCostsList
  },
  getNewDelegation(state) {
    return state.newDelegation
  },
  getDelegationTableValidated(state) {
    return state.delegationTableValidated
  },
  getDefaultCostsData(state) {
    return state.defaultCostsData
  },
  getFullExpences(state) {
    return state.fullExpences
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
  }
};

export default {
  state,
  mutations,
  actions,
  getters
}
