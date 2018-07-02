import { createRateDate }  from '../../../utils'
import moment from 'moment'
import axios from 'axios'

const state = {
    otherCostData: [{
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
    }],
    costOtherValidated: false
};

const mutations = {
    SET_OTHER_COST_DATA(state, list){
        state.otherCostData = list
    },
    SET_OTHER_COSTS_VALIDATED(state, isValidated){
        state.costOtherValidated = isValidated
    }
};

const actions = {
    addOtherCostRow({commit, getters}) {
        const otherCostData = getters.getOtherCostData
        otherCostData.push({
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
        })
        commit('SET_OTHER_COSTS_VALIDATED', false)
    },
    removeOtherCostRow({commit, getters, dispatch}, index) {
        const otherCostData = getters.getOtherCostData
        otherCostData.splice(index, 1)
        dispatch('countOtherCosts')
        dispatch('checkOtherCostsFields')        
    },
    countOtherCosts({getters, commit, dispatch}) {
        const otherCostData = getters.getOtherCostData,
             totalCosts = getters.getTotalCosts,
             totalCostsInCurr = getters.getTotalCostsInCurr,
             allDeduction = getters.getNewDelegation.allowanceDeduction

        totalCosts.othPayback = totalCosts.others = totalCosts.totalPayback = 0
        totalCostsInCurr.amount = totalCostsInCurr.othPayback = totalCostsInCurr.others = totalCostsInCurr.totalPayback = 0

        for(let i=0; i<otherCostData.length; i++) {
            let amount = otherCostData[i].amount,
                rate = otherCostData[i].currencyRate
           
                amount = (amount === "") ? 0 : parseFloat(amount)

            otherCostData[i].totalAmount = amount * rate
            otherCostData[i].totalAmountCurr = parseFloat(otherCostData[i].totalAmount / otherCostData[i].delegationCurrRate).toFixed(2)

            
           if(otherCostData[i].payback === true ) {
                totalCosts.othPayback = totalCosts.othPayback + otherCostData[i].totalAmount
                totalCostsInCurr.othPayback = totalCostsInCurr.othPayback + parseFloat(otherCostData[i].totalAmountCurr)
            }
            totalCosts.others = totalCosts.others + otherCostData[i].totalAmount
            totalCostsInCurr.others = totalCostsInCurr.others + parseFloat(otherCostData[i].totalAmountCurr)
            
            totalCosts.totalPayback = totalCosts.trvPayback + totalCosts.accPayback + totalCosts.othPayback
            totalCostsInCurr.totalPayback = totalCostsInCurr.trvPayback + totalCostsInCurr.accPayback + totalCostsInCurr.othPayback - totalCostsInCurr.advance
            totalCostsInCurr.amount =  totalCostsInCurr.travel + totalCostsInCurr.accomodation + totalCostsInCurr.others - allDeduction
        }
        dispatch('checkOtherCostsFields')
    
    },
    checkOtherCostsFields({getters, commit}) {
        const costs = getters.getOtherCostData
            for (let i = 0; i < costs.length; i++) {
                let arrayItem = costs[i]
                for (let key in arrayItem) {
                    if (key === "payback") {
                        commit('SET_OTHER_COSTS_VALIDATED', true)
                    } else {
                        if (!arrayItem[key] || arrayItem[key] === "") {
                            commit('SET_OTHER_COSTS_VALIDATED', false)
                            return
                        } else {
                            commit('SET_OTHER_COSTS_VALIDATED', true)
                        }
                    }
                }
            }
    },
    getOtherCostRate({commit, dispatch, getters}, index) {
      const data = getters.getOtherCostData,
            newDelegationCurr = getters.getNewDelegation.currency
        let row = data[index],
            rateDate = createRateDate(row.docDate)

      row.rateDate = rateDate

      if (row.docDate && row.currency && row.currency !== "PLN") { 
        const date = moment(rateDate).format('YYYY-MM-DD'),
              URL = 'http://api.nbp.pl/api/exchangerates/tables/a/' + date +'/'
        axios.get(URL).then(res => {
          let currRates = res.data[0].rates
          row.currencyRate = currRates.find(o => o.code === row.currency).mid
          row.delegationCurrRate = (newDelegationCurr !== 'PLN') ? currRates.find(o => o.code === newDelegationCurr).mid : 1.00 
            dispatch('countOtherCosts')
        }).catch(error => {
          alert(error)
        })  
      } else if (row.docDate && row.currency == "PLN"){
        row.currencyRate = row.delegationCurrRate = 1 
        dispatch('countOtherCosts')
      } 
    }
};

const getters = {
    getOtherCostData: state=> { return state.otherCostData },
    getOtherCostValidated: state => { return state.costOtherValidated }
};

export default {
    state,
    mutations,
    actions,
    getters
}