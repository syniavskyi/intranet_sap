import axios from 'axios'
import router from '@/router/index.js'
let utils = require('../../utils')

const state = {
  departmentList: [],
  branches: [],
  userList: [],
  projectsList: [],
  contractorsList: [],
  isLoaded: false,
  userInfo: {},
  studyTypes: [],
  academicTitles: [],
  langLevels: [],
  workPositionList: [],
  uploadFileTypes: [],
  sapDomains: ["ZINTRANET_DEPARTMENT", "ZINTRANET_AVAIL_TYPE", "ZINTRANET_AVAIL_STATUS", "ZINTRANET_BRANCH", "ZINTRANET_STUDIES_TYPES", "ZINTANET_ACADEMIC_TITLES", "ZINTRANET_LANG_LEVEL", "ZWORK_POS", "ZINTRANET_SAP_MODULES", 'ZINTRANET_PRIORITY', 'ZINTRANET_EVENT_TYPE', 'ZINTRANET_TARGET_GROUP', 'ZINTRANET_ROLES', 'ZINTRANET_TRANSPORTS', 'ZINTRANET_DELEGATION_TARGET', 'ZWORK_POS_LEVEL', 'ZWORK_POSITIONS', 'ZINTRANET_FILE_TYPE'],
  sapModulesList: [],
  newUserFiles: [],
  adverts: [],
  userAuth: [],
  availStatus: [],
  availType: [],
  targetGroup: [],
  roles: [],
  userPhotoUrl: null,
  selectedUserPhotoUrl: null,
  selectedForCvUser: '',
  promiseListToRead: [],
  promiseList: [],
  goFromCv: false, //default
  transportList: [],
  workPosLevel: [],
  workPositions: [],
  messageLog: [],
  resFromBatch: [],
  contractorsBranches: []
};

const mutations = {
  SET_DEP_LIST(state, data) {
    state.departmentList = data;
  },
  SET_BRANCH_LIST(state, data) {
    state.branches = data;
  },
  GET_USER_LIST(state, data) {
    state.userList = data;
  },
  SET_DATA_LOADED(state, isLoaded) {
    state.isLoaded = isLoaded;
  },
  SET_CONTRACTORS_LIST(state, data) {
    state.contractorsList = data;
  },
  SET_CONTRACTORS_BRANCHES(state, data) {
    state.contractorsBranches = data;
  },
  SET_PROJECTS_LIST(state, data) {
    state.projectsList = data;
  },
  SET_USER_INFO(state, data) {
    state.userInfo = data;
  },
  SET_STUDY_TYPES_LIST(state, data) {
    state.studyTypes = data;
  },
  SET_ACADEMIC_TITLES_LIST(state, data) {
    state.academicTitles = data;
  },
  SET_LANG_LEVELS(state, data) {
    state.langLevels = data
  },
  SET_WORK_POSITION_LIST(state, data) {
    state.workPositionList = data
  },
  SET_SAP_MODULES_LIST(state, data) {
    state.sapModulesList = data;
  },
  SET_NEW_USER_FILES_LIST(state, data) {
    state.newUserFiles = data;
  },
  SET_AVAIL_STATUS(state, data) {
    state.availStatus = data
  },
  SET_AVAIL_TYPE(state, data) {
    state.availType = data
  },
  SET_TARGET_GROUP(state, data) {
    state.targetGroup = data;
  },
  SET_ADVERTS(state, data) {
    state.adverts = data;
  },
  SET_ROLES(state, data) {
    state.roles = data;
  },
  SET_USER_PHOTO_URL(state, url) {
    state.userPhotoUrl = url;
  },
  SET_SEL_USER_PHOTO_URL(state, url) {
    state.selectedUserPhotoUrl = url;
  },
  SET_SELECTED_FOR_CV_USER(state, data) {
    state.selectedForCvUser = data;
  },
  SET_PROMISE_LIST(state, data) {
    state.promiseList = data;
  },
  SET_PROMISE_TO_READ(state, data) {
    state.promiseListToRead = data;
  },
  SET_GO_FROM_CV(state, isFromCv) {
    state.goFromCv = isFromCv;
  },
  SET_TO_READ_EXCLUDED(state, data) {
    data = data.filter(oItem => oItem !== "Domains");
    data.push("NewToken");
    state.promiseListToRead = data;
  },
  SET_USER_AUTH(state, aAuth) {
    state.userAuth = aAuth;
  },
  SET_TRANSPORT(state, data) {
    state.transportList = data;
  },
  SET_WORK_POSITIONS_LEVELS(state, data) {
    state.workPosLevel = data
  },
  SET_WORK_POSITIONS(state, data) {
    state.workPositions = data
  },
  SET_UPL_FILETYPE(state, data){
    state.uploadFileTypes = data
  },
  SET_MESSAGE_LOG(state, data) {
    state.messageLog = data;
  },
  SET_BATCH_RES(state, data) {
    state.resFromBatch = data
  }
};

const actions = {
  getData({
    getters,
    dispatch,
    commit
  }, passedData) {
    let passedUserId, passedLang, bChangePage, bLogin,
      aRoles = getters.getRoleList,
      sFirsLang;
    // check and assign passed data
    if (passedData) {
      passedUserId = passedData.user;
      passedLang = passedData.lang;
      bChangePage = passedData.changePage;
      bLogin = passedData.login;
    }
    // set user data - passed or saved in storage (for refresh reason)
    let userData = {
      user: passedUserId || localStorage.getItem("id"),
      lang: passedLang || localStorage.getItem("lang"),
      cvLang: getters.getSelectedCvLang || localStorage.getItem("lang"),
      changePage: bChangePage || false,
      login: bLogin || false
    };
    // check if domains are read - if it has been read, get language of get domains by roles
    if (aRoles.length !== 0) {
      sFirsLang = aRoles[0].Language.toUpperCase();
    }
    // if read language equals user language - do not read domains again
    if (sFirsLang === userData.lang) {
      commit('SET_TO_READ_EXCLUDED', getters.getPromisesToRead);
    }
    // finally read data
    dispatch("loadData", userData);
  },

  loadData({
    dispatch,
    getters,
    commit
  }, userData) {
    let aPromises; // prepare promises to read data

    dispatch("setPromises", userData); // set promises by passed array
    aPromises = getters.getPromiseList;
    commit("SET_DISPLAY_LOADER", true); // set loader
    axios.all(aPromises).then(res => { // send promise
      dispatch("setDataInResponse", {
        res,
        userData
      }); // set data from responses
    }).catch(error => { // catch error
      if (error.response.status === 401) {
        dispatch('logoutSession', true)
      }
    });
  },

  getNewToken() {
    return axios({
      method: 'get',
      url: '$metadata',
      headers: {
        "Content-type": "application/x-www-form-urlencoded; charset=utf-8",
        "X-CSRF-Token": "Fetch",
        "X-Requested-With": "XMLHttpRequest",
        "Cache-Control": "no-cache"
      }
    });
  },

  getDomainValues({}, domainData) {
    let aLinks = [];
    domainData.forEach(function (oDomain) {
      aLinks.push(`GET Dictionaries?$filter=Name%20eq%20'${oDomain.name}'%20and%20Language%20eq%20'${oDomain.lang}' HTTP/1.1`)
    })

    let sData = utils.packBatch(aLinks)
    return axios({
      method: 'post',
      url: "/$batch",
      headers: {
        "Content-type": "multipart/mixed; boundary=batch"
      },
      data: sData
    })
  },
  getProjectsList({}) {
    return axios({
      method: 'GET',
      url: 'Projects',
      headers: {
        "Content-type": "application/x-www-form-urlencoded; charset=utf-8"
      }
    })
  },
  getContractorsList({}) {
    return axios({
      method: 'GET',
      url: 'Contractors',
      headers: {
        "Content-type": "application/x-www-form-urlencoded; charset=utf-8"
      }
    })
  },

  getUserData({
    getters,
  }, userData) {
    let url;
    let sUserAlias = userData.user || localStorage.getItem("id"),
      sLang = userData.lang || localStorage.getItem("lang");
    if (!sUserAlias) {
      sUserAlias = userData.user;
    }
    if (!sLang) {
      sLang = userData.lang;
    }
    getters.getDataForHint ? url = 'Users' + '(UserAlias=' + "'" + sUserAlias.toUpperCase() + "'," + "Language='" + sLang + "')" + '?&$expand=UserSkills,UserAuth,UserCvProjects' :
      url = 'Users' + '(UserAlias=' + "'" + sUserAlias.toUpperCase() + "'," + "Language='" + sLang + "')" + '?&$expand=UserEducations,UserExperience2,UserCvProjects,UserSkills,UserLang,UserFiles,UserAuth'
    return axios({
      method: 'GET',
      url: url,
      headers: {
        "Content-type": "application/x-www-form-urlencoded; charset=utf-8"
      }
    })
  },
  formatUserData({
    commit
  }, data) {
    if (data) {
      data.EmploymentDate = utils.dateStringToObj(data.EmploymentDate);
      data.DateBirth = utils.dateStringToObj(data.DateBirth);
      for (let key in data) {
        if (key === "UserCvProjects" || key === "UserEducations" || key === "UserExperience2") {
          let obj = data[key].results;
          for (let index in obj) {
            if (obj[index].DateStart) {
              obj[index].DateStart = utils.dateStringToObj(obj[index].DateStart);
            }
            obj[index].IsCurrent = obj[index].IsCurrent === 'X' ? true : false
            if (obj[index].DateEnd ) {
              obj[index].DateEnd = utils.dateStringToObj(obj[index].DateEnd);
            }
            // else {
            //   obj[index].DateEnd = utils.dateStringToObj(obj[index].DateEnd);
            // }
          }
        }
      }
      commit('SET_USER_INFO', data);
    }
  },
  getUsersLists({}) {
    return axios({
      method: 'GET',
      url: 'Users',
      headers: {
        "Content-type": "application/x-www-form-urlencoded; charset=utf-8"
      }
    })
  },

  // getUserPhoto({}){
  //   return axios({
  //     method: 'GET',
  //     url: `AttachmentMedias(FileId='USER-PHOTO',Language='PL',UserAlias='UIO')/$value`,
  //     headers: {
  //       "Content-type": "application/x-www-form-urlencoded; charset=utf-8"
  //     }
  //   })
  // },

  loadUserPhoto({
    commit,
    getters
  }, userAlias) {
    const sUserId = userAlias,
      sLoggedUser = localStorage.getItem("id"),
      sLanguage = 'PL',
      sFileType = "USER-PHOTO";
    const url =
      window.location.origin + "/api/sap/opu/odata/sap/ZGW_INTRANET_SRV/AttachmentMedias(FileId='" +
      sFileType +
      "',Language='" +
      sLanguage +
      "',UserAlias='" +
      sUserId +
      "')/$value?c=" + getters.getCookie;

    let image = new Image();
    commit("SET_SEL_USER_PHOTO_URL", "");

    image.src = url;
    image.crossOrigin = '*';
    image.addEventListener("load", function () {
      let imgCanvas = document.createElement("canvas"),
        ctx = imgCanvas.getContext("2d");

      imgCanvas.width = image.width;
      imgCanvas.height = image.height;

      ctx.drawImage(image, 0, 0, image.width, image.height);

      let dataURL = imgCanvas.toDataURL("image/png");
      if (sLoggedUser === sUserId) {
        commit('SET_USER_PHOTO_URL', dataURL);
      }
      commit('SET_SEL_USER_PHOTO_URL', dataURL);
      // localStorage.setItem("image", dataURL)
    }, false);
    image.addEventListener("error", () => {
      if (sLoggedUser === sUserId) {
        commit('SET_USER_PHOTO_URL', "");
      }
      commit('SET_SEL_USER_PHOTO_URL', "");
    });
  },
  checkPageToDisplay({}, userData) {
    if (userData.changePage && userData.login) {
      router.replace('/news');
    } else if (!userData.changePage && userData.login) {
      router.replace('/starterpage');
    }
    userData.login = false;
  },
  getAdverts({}) {
    return axios({
      method: 'GET',
      url: "Adverts",
      headers: {
        "Content-type": "application/x-www-form-urlencoded; charset=utf-8"
      }
    })
  },

  setPromises({
    dispatch,
    commit,
    getters
  }, userData) {
    var aPromises = [],
      aPromiseList = state.promiseListToRead;
    if (aPromiseList) {
      for (let i = 0; i < aPromiseList.length; i++) {
        let sPromiseName = aPromiseList[i];
        switch (sPromiseName) {
          case "Adverts":
            const advertsPromise = dispatch("getAdverts").then(res => ({
              res: res,
              promise: 'Adverts'
            }));
            aPromises.push(advertsPromise);
            break;
          case "Events":
            const eventsPromise = dispatch('getEvents').then(res => ({
              res: res,
              promise: 'Events'
            }));
            aPromises.push(eventsPromise);
            break;
          case "UserData":
            const userDataPromise = dispatch('getUserData', userData).then(res => ({
              res: res,
              promise: 'UserData'
            }));
            aPromises.push(userDataPromise);
            break;
          case "Contractors":
            const contractorPromise = dispatch('getContractorsList').then(res => ({
              res: res,
              promise: "Contractors"
            }));
            aPromises.push(contractorPromise);
            break;
          case "Industries":
            const industriesPromise = dispatch('getIndustries', userData).then(res => ({
              res: res,
              promise: "Industries"
            }));
            aPromises.push(industriesPromise);
            break;
          case "Projects":
            const projectPromise = dispatch('getProjectsList').then(res => ({
              res: res,
              promise: "Projects"
            }));
            aPromises.push(projectPromise);
            break;
          case "UserList":
            const userListPromise = dispatch('getUsersLists').then(res => ({
              res: res,
              promise: "UserList"
            }));
            aPromises.push(userListPromise);
            break;
          case "Languages":
            const languagesPromise = dispatch('getAllLanguages', userData).then(res => ({
              res: res,
              promise: "Languages"
            }));
            aPromises.push(languagesPromise);
            break;
          case "SchoolDesc":
            const schoolDescPromise = dispatch('getSchoolDesc', userData.lang).then(res => ({
              res: res,
              promise: "SchoolDesc"
            }));
            aPromises.push(schoolDescPromise);
            break;
          case "FieldOfStudy":
            const fieldOfStudyPromise = dispatch('getFieldOfStudyDesc', userData.lang).then(res => ({
              res: res,
              promise: "FieldOfStudy"
            }));
            aPromises.push(fieldOfStudyPromise);
            break;
          case "StarterDocsInfo":
            const starterDocsPromiseInfo = dispatch('getInfoDocs', userData).then(res => ({
              res: res,
              promise: "StarterDocsInfo"
            }));
            aPromises.push(starterDocsPromiseInfo);
            break;
          case "StarterDocsNew":
            const starterDocsPromiseNew = dispatch('getNewDocs', userData).then(res => ({
              res: res,
              promise: "StarterDocsNew"
            }));
            aPromises.push(starterDocsPromiseNew);
            break;
          case "NewToken":
            const newTokenPromise = dispatch('getNewToken').then(res => ({
              res: res,
              promise: "NewToken"
            }));
            aPromises.push(newTokenPromise);
            break;
          case "UserPhoto":
            const userPhotoPromise = dispatch("getUserPhoto", userData).then(res => ({
              res: res,
              promise: "UserPhoto"
            }));
            aPromises.push(userPhotoPromise);
            break;
          case "Domains":
            let arrDomain = [];
            for (let value of state.sapDomains) {
              let domainData = {
                name: value,
                lang: userData.lang
              };
              arrDomain.push(domainData)
            }
            dispatch('getDomainValues', arrDomain).then(res => {
              let oParsedData = utils.parseBatchResponse(res)
              commit('SET_BATCH_RES', oParsedData)
              let aRes = [],
                aBatchRes = getters.getBatchRes

              aBatchRes.filter(function (element) {
                return element.Set = 'Dictionaries'
              }).forEach(function (element) {
                let obj = {
                  sDomainName: element[0].Name,
                  aResults: element
                }
                dispatch('setDomains', obj)
              })
            }).catch(err => {})
            break;
          case "Documents":
            let aResponse = dispatch('getDocuments', getters.getFileTypes).then(res => {
              let oParsedData = utils.parseBatchResponse(res)
              commit('SET_BATCH_RES', oParsedData)
              let aRes = [],
                aBatchRes = getters.getBatchRes

              aBatchRes.filter(function (element) {
                return element.Set = 'Attachements'
              }).forEach(function (element) {
                let obj = {
                  aResults: element,
                  documentType: element[0].FileId.split('-')[0]
                }
                dispatch('setDocumentList', obj)
                aRes.push({
                  obj
                })
              })
            }).catch(error => {})
            break;
          case "Availabilities":
            let availabilityPromise = dispatch("getUserAvail", userData.user).then(res => ({
              res: res,
              promise: "Availabilities"
            }));
            aPromises.push(availabilityPromise);
            break;
          case "AvailProjects":
            let availProjectsPromise = dispatch("getUserProjects", userData.user).then(res => ({
              res: res,
              promise: "AvailProjects"
            }));
            aPromises.push(availProjectsPromise);
            break;
          case "ContractorsBranchesSet":
            {
              let projectsContractors = dispatch('getContractorsBranches', userData).then(res => ({
                res: res,
                promise: "ContractorsBranchesSet"
              }));
              aPromises.push(projectsContractors);
            }
            break;
         case "RoomsReservations":
            const roomsReservationPromise = dispatch('getRoomsReserv', userData).then(res => ({
              res: res,
              promise: "RoomsReservations"
            }));
            aPromises.push(roomsReservationPromise);
            break;
        }
      }
      commit("SET_PROMISE_LIST", aPromises);
    }
  },

  setDataInResponse({
    dispatch,
    commit,
    getters
  }, data) {
    let response = data.res,
      userData = data.userData,
      sPromiseName,
      aResponse,
      aResults;
    for (let j = 0; j < response.length; j++) {
      sPromiseName = response[j].promise;
      aResponse = response[j].res;
      if (aResponse.data) {
        if (aResponse.data.d) {
          aResults = aResponse.data.d.results;
        }
      } else {
        aResults = aResponse
      }
      // get logs from backend
      let message = response[j].res.headers;
      if (message) {
        dispatch('displayModal', message);
      }

      switch (sPromiseName) {
        case "Adverts":
          dispatch("setAdvertList", aResponse);
          break;
        case "Events":
          dispatch("setEvents", aResponse);
          break;
        case "UserData":
          dispatch("setUserData", aResponse);
          if (aResponse.data.d.UserFiles.results) {
            if (aResponse.data.d.UserFiles.results.length !== 0) {
              userData.changePage = false;
            }
          }
          break;
        case "Contractors":
          commit('SET_CONTRACTORS_LIST', aResults);
          break;
        case "Industries":
          commit('SET_INDUSTRY_DESC_LIST', aResults);
          break;
        case "Projects":
          commit('SET_PROJECTS_LIST', aResults);
          break;
        case "UserList":
          commit('GET_USER_LIST', aResults);
          break;
        case "Languages":
          commit('SET_LANGUAGE_LIST', aResults);
          break;
        case "SchoolDesc":
          commit('SET_SCHOOL_DESC_LIST', aResults);
          break;
        case "FieldOfStudy":
          commit('SET_FIELD_OF_STUDY_DESC_LIST', aResults);
          break;
        case "StarterDocsInfo":
          commit('SET_DOC_LIST_INFO', aResults);
          dispatch('checkStatus', aResults);
          if (aResults.length === 0 && getters.getDocListNew.length === 0) {
            router.replace("/news")
          }
          break;
        case "StarterDocsNew":
          commit('SET_DOC_LIST_NEW', aResults);
          dispatch('checkStatus', aResults);
          if (aResults.length === 0 && getters.getDocListInfo.length === 0) {
            router.replace("/news")
          }
          break;
        case "NewToken":
          let sToken = aResponse.request.getResponseHeader('x-csrf-token');
          commit('SET_TOKEN', sToken);
          break;
        case "UserPhoto":
          break;
        case "Availabilities":
          commit("SET_USER_AVAIL", aResults);
          dispatch('formatUserLeaves', aResults);
          break;
        case "AvailProjects":
          commit("SET_USER_PROJECTS", aResults);
          dispatch('formatUserProjects', aResults);
          break;
        case "ContractorsBranchesSet":
          commit("SET_CONTRACTORS_BRANCHES", aResults)
          break;
        case "RoomsReservations":
          commit("SET_ROOMS_RESERVATIONS", aResults)
          dispatch('adjustRooms', aResults)
          break;
        default:
          let bEndFunction = false;
          for (let k = 0; k < state.sapDomains.length; k++) {
            let sDomainName = state.sapDomains[k];
            if (sDomainName === sPromiseName && !bEndFunction) {
              dispatch("setDomains", {
                aResults,
                sDomainName
              });
              bEndFunction = true;
            }
          }
          for (let l = 0; l < getters.getFileTypes.length; l++) {
            let documentType = getters.getFileTypes[l];
            if (documentType === sPromiseName && !bEndFunction) {
              dispatch("setDocumentList", {
                aResults,
                documentType
              })
              bEndFunction = true;
            }
          }
          break;
      }
    }
    commit("SET_DISPLAY_LOADER", false);
    dispatch('checkPageToDisplay', userData);
  },

  setAdvertList({
    commit
  }, response) {
    let oAdverts = response.data.d.results;
    for (let index in oAdverts) {
      if (oAdverts[index].ValidTo) {
        oAdverts[index].ValidTo = utils.dateStringToObj(oAdverts[index].ValidTo);
      }
    };
    commit('SET_ADVERTS', oAdverts);
    commit('SET_SHOW_ADVERTS', true);
    commit('SET_INITIAL_DATA_READED', true);
  },

  setEvents({
    commit,
    dispatch
  }, response) {
    let oEvents = response.data.d.results;
    commit('SET_EVENTS', oEvents);
    oEvents = utils.formatToArray(oEvents)
    dispatch('convertDate');
    dispatch('setColor');
  },

  setDomains({
    commit
  }, aParams) {
    let aResults = aParams.aResults,
      sDomainName = aParams.sDomainName,
      sCommitName = "";

    switch (sDomainName) {
      case 'ZINTRANET_DEPARTMENT':
        sCommitName = 'SET_DEP_LIST';
        break;
      case 'ZINTRANET_BRANCH':
        sCommitName = 'SET_BRANCH_LIST';
        break;
      case 'ZINTRANET_STUDIES_TYPES':
        sCommitName = 'SET_STUDY_TYPES_LIST';
        break;
      case 'ZINTANET_ACADEMIC_TITLES':
        sCommitName = 'SET_ACADEMIC_TITLES_LIST';
        break;
      case 'ZINTRANET_LANG_LEVEL':
        sCommitName = 'SET_LANG_LEVELS';
        break;
      case 'ZWORK_POS':
        sCommitName = 'SET_WORK_POSITION_LIST';
        break;
      case 'ZINTRANET_SAP_MODULES':
        sCommitName = 'SET_SAP_MODULES_LIST';
        break;
      case 'ZINTRANET_PRIORITY':
        sCommitName = 'SET_PRIORITY';
        break;
      case 'ZINTRANET_EVENT_TYPE':
        sCommitName = 'SET_EVENT_TYPE';
        break;
      case 'ZINTRANET_AVAIL_STATUS':
        sCommitName = 'SET_AVAIL_STATUS';
        break;
      case 'ZINTRANET_AVAIL_TYPE':
        sCommitName = 'SET_AVAIL_TYPE';
        break;
      case 'ZINTRANET_TARGET_GROUP':
        sCommitName = 'SET_TARGET_GROUP';
        break;
      case 'ZINTRANET_ROLES':
        sCommitName = 'SET_ROLES';
        break;
      case 'ZINTRANET_TRANSPORTS':
        sCommitName = 'SET_TRANSPORT';
        break;
      case 'ZWORK_POS_LEVEL':
        sCommitName = 'SET_WORK_POSITIONS_LEVELS'
        break;
      case 'ZWORK_POSITIONS': 
        sCommitName = 'SET_WORK_POSITIONS'
        break;
      case 'ZINTRANET_FILE_TYPE':
        sCommitName = 'SET_UPL_FILETYPE'
        break;
    }
    if (sCommitName.length > 0) {
      commit(sCommitName, aResults);
    }
  },

  setDocumentList({
    commit
  }, passedData) {
    let sCommitName = "",
      aResults = passedData.aResults,
      fileType = passedData.documentType;

    switch (fileType) {
      case 'INFO':
        sCommitName = "SET_INFORMATION_FILES";
        break;
      case 'DOC':
        sCommitName = "SET_DOCUMENT_FILES";
        break;
      case 'OFF':
        sCommitName = "SET_OFFICE_FILES";
        break;
      case 'SAPB':
        sCommitName = "SET_SYSTEM_FILES";
        break;
      case 'INST':
        sCommitName = "SET_INSTRUCTION_FILES";
        break;
     case 'MKT':
        sCommitName = "SET_MARKETING_FILES";
        break;
     case 'TRN':
         sCommitName = "SET_TRAINING_FILES";
         break;
    }
    commit(sCommitName, aResults);
  },

  setUserData({
    dispatch,
    commit,
    getters
  }, response) {
    //skillSet is name of commit
    let skillSet;
    dispatch('formatUserData', response.data.d); // format dates for date pickers and "is current" fields
    let oData = getters.getUserInfo;

    if (!getters.getDataForHint) {
      skillSet = 'SET_USER_SKILLS';
      dispatch('getUserFilesData') // get data about all user files (cv, photos, documents etc.)
      dispatch('loadUserPhoto', oData.UserAlias); //load user's photo for menu and profile TO BE READ
      let aAuth = utils.checkRole(oData.UserAuth.results);
      dispatch("_setAuthorizations", aAuth);
      //set authorization for all objects - to optimize
      commit('SET_USER_EDUCATION', oData.UserEducations.results); //set user education data for profile and cv
      commit('SET_USER_EXPERIENCE', oData.UserExperience2.results); //set user experience data for profile and cv

      commit('SET_USER_LANGS', oData.UserLang.results);

      commit('SET_NEW_USER_FILES_LIST', oData.UserFiles.results); //set list of files for starter page for new user
      dispatch("_setProjectOrginalEndDate", oData.UserCvProjects.results);
      // commit('SET_USER_PROJECTS_LIST', aCvProjects); //set user projects data for profile and cv
      dispatch('adjustProjects')
      commit('SET_NEW_PROJ', { UserAlias: oData.UserAlias })
      commit('SET_SELECTED_DEF_AVAIL', { selectedBranch: oData.BranchId, selectedDep: oData.DepartmentId, selectedUser: oData.UserAlias} )
    } else {
      skillSet = 'SET_USER_SKILLS_DF_LANG';
    }
    commit('SET_USER_PROJECTS_LIST_DF_LANG', oData.UserCvProjects.results); //set user projects data for profile and cv

    commit(skillSet, oData.UserSkills.results); //set user skills data for profile and cv
    let userSkills = utils.formatToArray(oData.UserSkills.results);
    if (userSkills) {
      for (let key in userSkills[0]) {
        if (userSkills[0][key][0] === "") {
          userSkills[0][key] = [];
        }
      }
      commit(skillSet, userSkills[0]);
    } else {
      userSkills = {
        SapModules: [],
        ProgramLang: [],
        Technologies: [],
        Extensions: [],
        AdditionalSkills: []
      }
      commit(skillSet, userSkills);
    }
    commit('SET_DATA_LOADED', true);
    commit('SET_DATA_FOR_HINT', false);

    // dispatch('checkPageToDisplay', userData.changePage) //TEMP
  },

  _setProjectOrginalEndDate({commit}, aUserProject){
    for(let i = 0; i < aUserProject.length; i++){
      aUserProject[i].DateEndToChange = aUserProject[i].DateEnd; // DateEndToChange is original date of entry
      if(aUserProject[i].IsCurrent){
        aUserProject[i].DateEnd = new Date()
      }
    }
    aUserProject.sort((a,b) => ((a.DateEnd < b.DateEnd) ? 1 : (b.DateEnd < a.DateEnd) ? -1 : (a.DateStart < b.DateStart) ? 1 : (a.DateStart < b.DateStart) -1));
    commit("SET_USER_PROJECTS_LIST", aUserProject);
  },

  _setAuthorizations({
    commit
  }, aAuth) {
    commit('SET_USER_AUTH', aAuth);
    commit('SET_DELEGATION_AUTH', aAuth.ZDELEG);
    commit('SET_CALENDAR_AUTH', aAuth.ZEVENT);
    commit('SET_AVAILABILITY_AUTH', aAuth.ZDYSP_CREA);
    commit('SET_AVAIL_ACCEPT_AUTH', aAuth.ZDYSP_ACC);
    commit('SET_MENU_AUTH', aAuth.ZMENU);
  }
};

const getters = {
  getDepartmentList(state) {
    return state.departmentList;
  },
  getBranchList(state) {
    return state.branches;
  },
  projectsList(state) {
    return state.projectsList;
  },
  usersList(state) {
    return state.userList.sort((a, b) => a.Fullname.localeCompare(b.Fullname));
  },
  getContractorsList(state) {
    return state.contractorsList;
  },
  getContractorsBranches(state) {
    return state.contractorsBranches;
  },
  isDataLoaded(state) {
    return state.isLoaded;
  },
  getUserInfo(state) {
    return state.userInfo;
  },
  getStudyTypes(state) {
    return state.studyTypes;
  },
  getAcademicTitles(state) {
    return state.academicTitles;
  },
  getLangLevels(state) {
    return state.langLevels
  },
  getWorkPositions(state) {
    return state.workPositionList;
  },
  getModulesList(state) {
    return state.sapModulesList;
  },
  getNewUserFilesList(state) {
    return state.newUserFiles;
  },
  getUserAuth(state) {
    return state.userAuth;
  },
  getAvailStatus(state) {
    return state.availStatus;
  },
  getAvailType(state) {
    return state.availType;
  },
  getTargetGroup(state) {
    return state.targetGroup;
  },
  getAdverts(state) {
    return state.adverts;
  },
  getRoleList(state) {
    return state.roles;
  },
  getUserPhotoUrl(state) {
    return state.userPhotoUrl
  },
  getSelectedUserPhotoUrl(state) {
    return state.selectedUserPhotoUrl;
  },
  getSelectedForCvUser(state) {
    return state.selectedForCvUser;
  },
  getPromiseList(state) {
    return state.promiseList;
  },
  getPromisesToRead(state) {
    return state.promiseListToRead;
  },
  getGoFromCv(state) {
    return state.goFromCv;
  },
  getTransportList(state) {
    return state.transportList;
  },
  getPositionsLevel(state) {
    return state.workPosLevel;
  },
  getUploadFileTypes(state){
    return state.uploadFileTypes;
  },
  getOnlyWorkPositions(state) {
    return state.workPositions;
  },
  getMessageLog(state) {
    return state.messageLog;
  },
  getBatchRes(state) {
    return state.resFromBatch;
  }
};

export default {
  state,
  mutations,
  actions,
  getters
}
