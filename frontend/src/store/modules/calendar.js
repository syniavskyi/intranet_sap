import axios from 'axios'
import router from '@/router/index.js'

const state = {
  priorityColor: ''
};

const mutations = {
  SET_COLOR_PRIORITY(state, data) {
    state.priorityColor = data;
  }
};

const actions = {
  setColorPriority({commit}, data) {
    var color = '';

    switch(data.priority) {
      case 'Wysoki':
        color = 'red';
        break;
      case 'Średni':
        color = 'orange';
        break;
      case 'Niski':
        color = 'green';
        break;
      default:
        color: 'blue';
    }
    commit('SET_COLOR_PRIORITY', color);
  }
};

const getters = {
  priorityColor() {
    return state.priorityColor;
  }
};

export default {
  state,
  mutations,
  actions,
  getters
};
