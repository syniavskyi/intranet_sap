import axios from 'axios';

const state = {
    roomsReservations: [],
    dataToRead: ["NewToken","Domains", "UserData", "RoomsReservations"]
}

const mutations = {
    SET_ROOMS_RESERVATIONS(state, data) {
        state.roomsReservations = data;
    }
}

const actions = {
    getRoomsReserv({}) {
        return axios({
          method: 'GET',
          url: 'Rooms',
          headers: {
            "Content-type": "application/x-www-form-urlencoded; charset=utf-8"
          }
        })
      },
    adjustRooms({}) {

    },
    addRoomReservation({}) {
        let url = 'RoomReservations',
        data;
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
                let aRooms = getters.getRoomsReservations;
                aRooms.push(data);
                commit("SET_EVENTS", aRooms);
                let message = res.headers;
                dispatch('displayModal', message);
                commit("SET_PROMISE_TO_READ", ["NewToken", "RoomsReservations"]);
                dispatch('getData');
            }).catch(error => {
        })
    }
}

const getters = {
    getRoomsReservations(state) {
        return state.roomsReservations;
    },
    getRoomsReservationsToRead(state) {
        return state.dataToRead;
    }
}

export default {
    state,
    mutations,
    actions,
    getters
}