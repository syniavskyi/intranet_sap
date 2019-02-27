import axios from 'axios'
const utils = require('../../utils.js')

const state = {
  userFiles: [],
  documentFiles: [],
  systemFiles: [],
  officeFiles: [],
  informationFiles: [],
  instructionFiles: [],
  fileTypes: ['INFO', 'DOC', 'OFF', 'SAPB', 'INST'],
  dataToRead: ["UserData", "Documents", "NewToken", "Domains"]
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
  uploadDocument({getters}, file){
    let slugHeader = `${file.name};TEST-DOCUM;PL;;${file.type};${file.addToStarter};${file.sendEmail}`;
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
      console.log(res)
    }).catch(error=>{
      console.log(error)
    })
  },
  uploadLink({getters, dispatch}, link){
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
    axios({
      method: 'POST',
      url: 'Attachments',
      data: data,
      headers: {
        "X-Requesteg-With": "XMLHttpRequest",
        "x-csrf-token": getters.getToken
      }
    }).then(res=>{
      dispatch("SET_PROMISE_TO_READ", ["Documents", "NewToken"])
      dispatch("getData", null)
    }).catch(error=>{
      console.log(error)
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
  getFileTypes(state) {
    return state.fileTypes
  },
  getFilesToRead(state){
    return state.dataToRead;
  }
}

export default {
  state,
  mutations,
  actions,
  getters
}
