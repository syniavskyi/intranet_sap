import { createRateDate }  from '../../../utils'
import moment from 'moment'
import axios from 'axios'

const state = {
  costTravelData: [{
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
  }],
  ratesForTransport: [{
    carLess: 0.5214,
    carMore: 0.8358,
    motocycle: 0.2302,
    moped: 0.1382,
  }],
  costTravelValidated: false
};

const mutations = {
  SET_COST_TRAVEL_DATA(state, list) {
    state.costTravelData = list
  },
  SET_TRV_COSTS_VALIDATED(state, isValidated) {
    state.costTravelValidated = isValidated
  }
};

const actions = {
  addTravelCostRow({
    commit,
    getters
  }) {
    const costTravelData = getters.getTravelCostData
    costTravelData.push({
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
      kilometers: null,
      currencyRate: 1,
      rateDate: null, 
      totalAmountCurr: 0,
      delegationCurrRate: 1
    })
    commit('SET_COST_TRAVEL_DATA', costTravelData)
    commit('SET_TRV_COSTS_VALIDATED', false)
  },
  removeTravelCostRow({
    commit,
    getters,
    dispatch
  }, index) {
    const costTravelData = getters.getTravelCostData
    costTravelData.splice(index, 1)
    commit('SET_COST_TRAVEL_DATA', costTravelData)
    dispatch('updateTotalCosts')
  },
  countTravelCosts({
    getters,
    commit,
    dispatch
  }) {
    const data = getters.getTravelCostData,
      totalCosts = getters.getTotalCosts,
      transportRates = getters.getRatesForTransport[0],
      totalCostsInCurr = getters.getTotalCostsInCurr,
      allDeduction = getters.getNewDelegation.allowanceDeduction

      totalCostsInCurr.amount = totalCosts.travel = totalCosts.trvPayback =  totalCosts.totalPayback = totalCostsInCurr.travel = totalCostsInCurr.trvPayback = totalCostsInCurr.totalPayback = 0
    
    for (let i = 0; i < data.length; i++) {
      let rate = parseFloat(data[i].currencyRate).toFixed(2),
          transport = data[i].transport,
          km = data[i].kilometers,
          totalAmount = data[i].totalAmount, //total amount in each row counted in delegation currency
          amount = data[i].amount //amount given in selected in each row currency

      amount = (amount === "") ? 0 : parseFloat(amount)
      km = (km === "") ? 0 : parseFloat(km)

      if (transport === "COMCAR") {
        totalAmount = amount = km * transportRates.carMore * rate
      } else if (transport === "PRVCAR") {
        if (data[i].engineCapacity === true) {
          totalAmount = amount = km * transportRates.carMore * rate
        } else if (data[i].engineCapacity === false) {
          totalAmount = amount = km * transportRates.carLess * rate
        } else {
          totalAmount = amount = 0
        }
      } else if (transport === "MOTOR") {
        totalAmount = amount = km * transportRates.motocycle * rate
      } else if (transport === "MOPED") {
        totalAmount = amount = km * transportRates.moped * rate
      } else {
        totalAmount = amount * rate
      }

      data[i].totalAmountCurr = (totalAmount / data[i].delegationCurrRate).toFixed(2)

      if (data[i].payback === true) {
        totalCosts.trvPayback = totalCosts.trvPayback + totalAmount
        totalCostsInCurr.trvPayback = totalCostsInCurr.trvPayback + parseFloat(data[i].totalAmountCurr)
      } 
      totalCosts.totalPayback = totalCosts.trvPayback + totalCosts.accPayback + totalCosts.othPayback
      totalCostsInCurr.totalPayback = totalCostsInCurr.trvPayback + totalCostsInCurr.accPayback + totalCostsInCurr.othPayback - totalCostsInCurr.advance
      
      totalCosts.travel = totalCosts.travel + totalAmount
      totalCostsInCurr.travel = totalCostsInCurr.travel + parseFloat(data[i].totalAmountCurr)
      totalCostsInCurr.amount =  totalCostsInCurr.travel + totalCostsInCurr.accomodation + totalCostsInCurr.others - allDeduction
    }
    dispatch('checkTravelFields')
  },
  checkTravelFields({
    getters,
    commit,
    dispatch
  }) {
    const costs = getters.getTravelCostData
    for (let i = 0; i < costs.length; i++) {
      let arrayItem = costs[i]
      for (let key in arrayItem) {
        if (key === "payback") {
          commit('SET_TRV_COSTS_VALIDATED', true)
        } else {
          if (!arrayItem[key] || arrayItem[key] === "") {
            commit('SET_TRV_COSTS_VALIDATED', false)
            return
          } else {
            commit('SET_TRV_COSTS_VALIDATED', true)
          }
        }
      }
    }
  },
  getTravelRate({commit, dispatch, getters}, index) {
    const data = getters.getTravelCostData,
          newDelegationCurr = getters.getNewDelegation.currency
      let row = data[index],
          rateDate = row.docDate

    rateDate = createRateDate(rateDate)
    row.rateDate = rateDate

    if (row.rateDate && row.currency && row.currency !== "PLN") { 
      const date = moment(rateDate).format('YYYY-MM-DD')
      const URL = 'http://api.nbp.pl/api/exchangerates/tables/a/' + date +'/'
       axios.get(URL).then(res => {
        let currRates = res.data[0].rates
        row.currencyRate = currRates.find(o => o.code === row.currency).mid
        row.delegationCurrRate  = (newDelegationCurr !== 'PLN') ? currRates.find(o => o.code === newDelegationCurr).mid : 1.00
       dispatch('countTravelCosts')
      }).catch(error => {
        alert(error)
        console.log(error)
      })  
    } else if (row.rateDate && row.currency == "PLN"){
      row.currencyRate = 1 
      row.delegationCurrRate = 1
      dispatch('countTravelCosts')
    } 
  },
};

const getters = {
  getTravelCostData(state) {
    return state.costTravelData
  },
  getTravelCostValidated(state) {
    return state.costTrvValidated
  },
  getRatesForTransport(state) {
    return state.ratesForTransport
  }
};

export default {
  state,
  mutations,
  actions,
  getters
}
