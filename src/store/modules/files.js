import axios from 'axios'
const utils = require('../../utils.js')

const state = {
  userFiles: [],
  documentFiles: [],
  systemFiles: [],
  officeFiles: [],
  informationFiles: [],
  instructionFiles: [],
  marketingFiles: [],
  trainingFiles: [],
  fileTypes: ['INFO', 'DOC', 'OFF', 'SAPB', 'INST', 'MKT', "TRN"],
  dataToRead: ["UserData", "Documents", "NewToken", "Domains"],
  linkStructure: {
    fileName: "",
    type: "",
    url: "",
    addToStarter: false,
    sendEmail: false },
  messages: [],
  showFileConfDialog: false,
  docToDelete: {}
}

const mutations = {
  SET_USER_FILES_LIST(state, data) {
    state.userFiles = data
  },
  SET_DOCUMENT_FILES(state, docs) {
    state.documentFiles = docs
  },
  SET_SYSTEM_FILES(state, docs) {
    state.systemFiles = docs
  },
  SET_OFFICE_FILES(state, docs) {
    state.officeFiles = docs
  },
  SET_INFORMATION_FILES(state, docs) {
    state.informationFiles = docs
  },
  SET_INSTRUCTION_FILES(state, docs) {
    state.instructionFiles = docs
  },
  SET_MARKETING_FILES(state, docs) {
    state.marketingFiles = docs
  },
  SET_TRAINING_FILES(state, docs) {
    state.trainingFiles = docs
  },
  SET_LINK_STRUCTURE(state, data){
    state.linkStructure = data
  },
  SET_FILE_MESSAGES(state, data){
    state.messages = data
  },
  SET_SHOW_FILE_CONF_DIALOG(state, data){
    state.showFileConfDialog = data
  },
  SET_DOC_TO_DELETE(state, data){
    state.docToDelete = data
  }
}

const actions = {
  getUserFilesData({
    commit
  }) {
    let userId = localStorage.getItem('id');
    axios({
      method: 'GET',
      url: "Attachments?$filter=UserAlias eq " + "'" + userId + "'",
      headers: {
        "Content-type": "application/x-www-form-urlencoded; charset=utf-8"
      }
    }).then(res => {
      commit('SET_USER_FILES_LIST', res.data.d.results);
    }).catch(error => {
    })
  },
  getDocuments({commit}, fileTypes) {
    // return axios({
    let arrReqs = [],
        link, sData
    fileTypes.forEach(function (fileType) {
    link = `GET Attachments?$filter=FileId%20eq%20'${fileType}' HTTP/1.1`
        // "Content-type": "application/x-www-form-urlencoded; charset=utf-8"
      arrReqs.push(link)
    })
    sData = utils.packBatch(arrReqs, getters.getToken)
    return axios({
      method: 'post',
      url: "/$batch",
      headers: {
        "Content-type": "multipart/mixed; boundary=batch"
      },
      data: sData
    })
  },
  toggleDocTile({}, element) {
    let height = 0,
      length = element.elChild.childNodes.length / 3;
    for (var i = 0; i < length; i++) {
      height = height + element.elChild.childNodes[i].offsetHeight + 32
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
  calcDocsHeight({}, tiles) {
    let height = 0;
    for (var i = 0; i < tiles.length; i++) {
      height = tiles[i].firstElementChild.offsetHeight
      tiles[i].lastElementChild.style.height = "0px"
    }
  },
  uploadDocument({getters, commit, dispatch}, data){
    let file = data.file,
        newFileName = `${file.fileName}.${file.fileId.substr(file.fileId.lastIndexOf('.') + 1)}`,
        addToStarter = file.addToStarter ? "X" : "",
        sendEmail = file.sendEmail ? "X" : "",
        slugHeader = `${newFileName};${file.fileType};PL;;${file.type};${addToStarter};${sendEmail};UPL`; 
        file = file.nativeFile;

        commit('SET_DISPLAY_LOADER', true)
        axios({
          method: 'POST',
          url: 'AttachmentMedias',
          data: file,
          headers: {
            "Content-type": file.type,
            "X-Requesteg-With": "XMLHttpRequest",
            "Slug": slugHeader,
            "x-csrf-token": getters.getToken
          }
        }).then(res=>{
          let message = res.headers,
              fileMessages = getters.getFileMessages,
              detail = JSON.parse(message["sap-message"]).details;
          for(let i = 0; i < detail.length; i++){
            fileMessages.push(detail[i]);
          }
          
          // If it is the last file
          if(data.index + 1 === data.totalAmount){
            commit('SET_DISPLAY_LOADER', false);
         // get files data
            commit("SET_PROMISE_TO_READ", ["Documents", "NewToken"])
            dispatch("getData", null)
            dispatch('displayModalFewMessages', fileMessages);
            commit("SET_FILE_MESSAGES", []);
          } else {
            commit("SET_FILE_MESSAGES", fileMessages);
          }


        }).catch(error=>{
          commit('SET_DISPLAY_LOADER', false)
          dispatch('displayModal', res.headers);
        })
  },

  proceedFile({getters, commit, dispatch}, data){
    let message = data.res.headers,
        fileMessages = getters.getFileMessages,
        detail = JSON.parse(message["sap-message"]).details;
    for(let i = 0; i < detail.length; i++){
      fileMessages.push(detail[i]);
    }

    // If it is the last file
    if(data.index + 1 === data.totalAmount){
      commit('SET_DISPLAY_LOADER', false);
    // get files data
      commit("SET_PROMISE_TO_READ", ["Documents", "NewToken"])
      dispatch("getData", null)
      dispatch('displayModalFewMessages', fileMessages);
      commit("SET_FILE_MESSAGES", []);
    } else {
      commit("SET_FILE_MESSAGES", fileMessages);
    }
    commit('SET_DISPLAY_LOADER', false);
  },

  uploadLink({getters, dispatch, commit}, link){
    let data = {
      FileId: link.type,
      Language: "",
      Link: link.url,
      UploadFile: true,
      Filename: link.fileName,
      UserAlias: "",
      SendEmail: link.sendEmail,
      AddToStarter: link.addToStarter
    }
    commit("SET_DISPLAY_LOADER", true);
    axios({
      method: 'POST',
      url: 'Attachments',
      data: data,
      headers: {
        "X-Requesteg-With": "XMLHttpRequest",
        "x-csrf-token": getters.getToken
      }
    }).then(res=>{
      let clearStructure = {
                            fileName: "",
                            type: "",
                            url: "",
                            addToStarter: false,
                            sendEmail: false }
      commit("SET_PROMISE_TO_READ", ["Documents", "NewToken"])
      dispatch("getData", null)
      commit("SET_LINK_STRUCTURE", clearStructure)
    }).catch(error=>{
    })
  },
  deleteFile({getters, dispatch, commit}) {
      let file = getters.getDocToDelete,
          url = `AttachmentMedias(FileId='${file.FileId}',Language='PL',UserAlias='')/$value`;
      commit('SET_DISPLAY_LOADER', true)
      axios({
          method: 'delete',
          url: url,
          headers: {
               "Content-type": "application/json",
               "X-Requesteg-With": "XMLHttpRequest",
                "x-csrf-token": getters.getToken
               }
            }).then(res=> {
              commit('SET_DISPLAY_LOADER', false)
              let message = res.headers;
              dispatch('displayModal', message);
              commit("SET_PROMISE_TO_READ", ["Documents", "NewToken"])
              dispatch("getData", null)
              }).catch(error=> {
                error
                 commit('SET_DISPLAY_LOADER', false)
           })
  }
}
const getters = {
  getUserFiles(state) {
    return state.userFiles;
  },
  getDocumentFiles(state) {
    return state.documentFiles
  },
  getInfoFiles(state) {
    return state.informationFiles
  },
  getSystemFiles(state) {
    return state.systemFiles
  },
  getOfficeFiles(state) {
    return state.officeFiles
  },
  getInstructionFiles(state) {
    return state.instructionFiles
  },
  getMarketingFiles(state) {
    return state.marketingFiles
  },
  getTrainingFiles(state) {
    return state.trainingFiles
  },
  getFileTypes(state) {
    return state.fileTypes
  },
  getFilesToRead(state){
    return state.dataToRead
  },
  getLinkStructure(state){
    return state.linkStructure
  },
  getFileMessages(state){
    return state.messages
  },
  getShowFileConfDialog(state){
    return state.showFileConfDialog
  },
  getDocToDelete(state){
    return state.docToDelete
  }
}

export default {
  state,
  mutations,
  actions,
  getters
}
