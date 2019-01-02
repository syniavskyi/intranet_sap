import axios from 'axios'
const state = {
  userFiles: [],
  documentFiles: [],
  systemFiles: [],
  officeFiles: [],
  informationFiles: [],
  instructionFiles: [],
  fileTypes: ['INFO', 'DOC', 'OFF', 'SAPB', 'INST'],
  dataToRead: ["UserData", "Documents"]
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
      console.log(error)
    })
  },
  getDocuments({}, fileType) {
    return axios({
      method: 'GET',
      url: "Attachments?$filter=FileId eq '" + fileType + "'",
      headers: {
        "Content-type": "application/x-www-form-urlencoded; charset=utf-8"
      }
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
