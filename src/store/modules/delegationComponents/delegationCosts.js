const state = {
  delegationCostsList: [],
  delegationTableValidated: false,
// default costs are two first rows of delegation costs table   
  defaultCostsData: {}
};

const mutations = {
    SET_DELEG_COST_LIST(state, list) {
        state.delegationCostsList = list
    },
    SET_DELEGATION_TABLE_VALIDATED(state, isValidated) {
        state.newDelegationValidated = isValidated
    },
    SET_DEFAULT_COST_DATA(state, data) {
        state.defaultCostsData = data
    }
};

const actions = {
    prepareCostData({
        getters,
        commit
    }) {
        //prepare first two rows of delegations table, depending on data given in new delegation model
        //it is used to calculate allowance, values in currency etc.
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
    },
    checkDelegationTable({
        getters,
        commit,
        dispatch
      }) {
        dispatch('prepareCostData')
        const costs = getters.getDelegationCostsList
        for (let i = 0; i < costs.length; i++) {
          let arrayItem = costs[i]
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
};

const getters = {
  getDelegationCostsList(state) {
    return state.delegationCostsList
  },
  getDelegationTableValidated(state) {
    return state.delegationTableValidated
  },
  getDefaultCostsData(state) {
    return state.defaultCostsData
  }
};

export default {
    state,
    mutations,
    actions,
    getters
}