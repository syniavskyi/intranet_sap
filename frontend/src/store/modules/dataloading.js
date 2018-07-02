import axios from 'axios'
import router from '@/router/index.js'

const state = {
  userRoles: [],
  departmentList: [],
  userList: [],
  sectionsList: [],
  projectsList: [],
  contractorsList: [],
  username: null,
  userId: null,
  userData: {},
  isLoaded: false
};

const mutations = {
  GET_ROLE_LIST(state, data) {
    state.userRoles = data;
  },
  GET_DEP_LIST(state, data) {
    state.departmentList = data;
  },
  GET_USER_LIST(state, data) {
    state.userList = data;
  },
  SET_USERNAME(state, username) {
    state.username = username
  },
  SET_USER_ID(state, userId) {
    state.userId = userId
  },
  SET_USER_DATA(state, data) {
    state.userData = data;
  },
  SET_DATA_LOADED(state, isLoaded) {
    state.isLoaded = isLoaded;
  },
  SET_SECTIONS_LIST(state, data) {
    state.sectionsList = data;
  },
  SET_CONTRACTORS_LIST(state, data) {
    state.contractorsList = data;
  },
  SET_PROJECTS_LIST(state, data) {
    state.projectsList = data;
  },
  SET_PHOTO(state, photoUrl) {
    state.userData.image = photoUrl
  },
  SET_CV(state, cvUrl){
    state.userData.cv = cvUrl
  },
  SET_SENIORITY (state, seniority) {
    state.userData.seniority = seniority
  },

};

const actions = {
  loadData({
    commit,
    dispatch
  }, token) {
    dispatch('getRoleList')
    dispatch('getDepartmentList')
    dispatch('getContractorsList')
    dispatch('getSectionsList')
    dispatch('getProjectsList')
    dispatch('getUsersData')
    dispatch('getUserData', token)
    commit('SET_DATA_LOADED', true)
  },
  getRoleList({
    commit
  }) {
    axios.get("/api/rolesList").then(res => {
      const data = res.data,
        aData = [];

      for (let key in data) {
        const role = data[key];

        data[key].roleName = data[key].roleName.slice(data[key].roleName.indexOf("_") + 1, data[key].roleName.length);

        let upper = data[key].roleName.substring(0, 1),
          toLower = data[key].roleName.slice(1, data[key].roleName.length).toLowerCase();

        data[key].roleName = upper + toLower;
        // role.roleName = data[key].roleName;
        aData.push(role.roleName);
      }
      commit('GET_ROLE_LIST', aData);
    });
  },
  getDepartmentList({
    commit
  }) {
    axios.get("/api/depsList").then(res => {
      const data = res.data,
        aData = [];

      for (let key in data) {
        const dep = data[key];

        //for now
        if (data[key].depName.includes('Dabrowa')) {
          data[key].depName = 'Dąbrowa Górnicza';
        } else if (data[key].depName.includes('Wroclaw')) {
          data[key].depName = 'Wrocław';
        }
        aData.push(dep);
      }
      commit('GET_DEP_LIST', aData);
    });
  },
  getSectionsList({commit}) {
    axios.get("/api/sectionList").then(res => {
        commit('SET_SECTIONS_LIST', res.data)
          console.log(res)
      }).catch(error => {
        console.log(error)
      })  
  },
  getProjectsList({commit}) {
    axios.get("/api/projectList").then(res => {
        commit('SET_PROJECTS_LIST', res.data)
        console.log(res)

      }).catch(error => {
        console.log(error)
      })  
  },
  getContractorsList({commit}) {
    axios.get("/api/cotractorsList").then(res => {
        commit('SET_CONTRACTORS_LIST', res.data)
          console.log(res)
      }).catch(error => {
        console.log(error)
      })  
  },
  getUsersData({
    commit
  }) {
    axios.get("/api/users")
      .then(res => {
        const data = res.data,
          aData = [];

        for (let key in data) {
          const user = data[key];
          user.id = user.id
          user.section = user.userDetails[0].section
          user.depName = user.deps[0] ? user.deps[0].depName : "";
          user.roleName = user.roles[0] ? user.roles[0].name.slice(user.roles[0].name.indexOf("_") + 1, user.roles[0].name.length) : "";
          // user.email = user.email ? user.email : "";
          user.firstName = user.userInfo[0] ? user.userInfo[0].firstName : "";
          user.lastName = user.userInfo[0] ? user.userInfo[0].lastName : "";
          user.email = user.userContacts[0] ? user.userContacts[0].email : "";
          user.phone = user.userContacts[0] ? user.userContacts[0].phone : "";

          aData.push(user);
        }
        commit('GET_USER_LIST', aData);
      })
      .catch(function (error) {
        alert('brak połączenia');
      });
  },
  getUserData({
    commit,
    getters,
    dispatch
  }, token) {
    var URL = '/api/getUsernameByToken?access_token=' + token

    axios.get(URL).then(res => {
      var departmentId = res.data.deps[0].depName;
      for (var i = 0; i < getters.depList.length; i++) {
        if (departmentId = getters.depList[i].depId) {
          var departmentName = getters.depList[i].depName
        }
      }

      const userdata = {
        departmentId: departmentId,
        departmentName: decodeURI(departmentName),
        username: res.data.username,
        email: res.data.userContacts[0].email,
        role: decodeURI(res.data.roles[0].name),
        birthDate: res.data.userInfo[0].birthDate,
        firstName: decodeURI(res.data.userInfo[0].firstName),
        gender: decodeURI(res.data.userInfo[0].gender),
        lastName: decodeURI(res.data.userInfo[0].lastName),
        skype: res.data.userContacts[0].skypeId,
        slack: res.data.userContacts[0].slackId,
        phone: res.data.userContacts[0].phone,
        address: decodeURI(res.data.userContacts[0].address),
        id: res.data.id,
        image: res.data.userInfo[0].image,
        branch: decodeURI(res.data.userDetails[0].branch),
        currentProject: decodeURI(res.data.userDetails[0].currentProject),
        cv: res.data.userDetails[0].cv,
        employmentDate: res.data.userDetails[0].employmentDate,
        position: decodeURI(res.data.userDetails[0].position),
        section: decodeURI(res.data.userDetails[0].section),
        seniority: res.data.userDetails[0].seniority,
        state: decodeURI(res.data.userDetails[0].state)
      }

      localStorage.setItem('username', userdata.username)
      localStorage.setItem('role', userdata.role)
      localStorage.setItem('id', userdata.id)

      commit('SET_USER_ROLE', userdata.role)
      commit('SET_USER_DATA', userdata)
      commit('SET_USERNAME', userdata.username)
      commit('SET_USER_ID', userdata.id)

      console.log(res)
    }).catch(error => {
      // commit('CLEAR_AUTH_DATA');
      // localStorage.removeItem('expirationDate')
      // localStorage.removeItem('username')
      // localStorage.removeItem('role')
      // localStorage.removeItem('token')
      // commit('DISPLAY_MENU', false);
      // router.replace('/');
      console.log(error)
    })
  },
};

const getters = {
  roleList(state) {
    return state.userRoles;
  },
  depList(state) {
    return state.departmentList;
  },
  sectionsList(state) {
      return state.sectionsList
  },
  projectsList(state) {
      return state.projectsList
  },
  usersList(state) {
    return state.userList;
  },
  contractorsList(state) {
    return state.contractorsList;
  },
  userData(state) {
    return state.userData
  },
  isDataLoaded(state) {
    return state.isLoaded
  }
};

export default {
  state,
  mutations,
  actions,
  getters
}
