import odata from 'odata';

const state = {
    userSkills: {
        SapModules: [],
        ProgramLang: [],
        Technologies: [],
        Extensions: [],
        AdditionalSkills: []
    },
    userLanguages: [
    ],
}

const mutations = {
    SET_USER_SKILLS(state, list) {
        state.userSkills = list
    },
    SET_USER_LANGS(state,list) {
        state.userLanguages = list
    }
}

const actions = {
    addModuleForSkills({commit,getters}, moduleId) {
        const skillsList = getters.getUserSkills,
              modules = skillsList.SapModules
         
        let moduleExist = null
    
        if (modules.length !== 0) {
          for (let i = 0; i < modules.length; i++) {
            if (modules[i] === moduleId) {
                moduleExist =  true
                return
            } else {
                moduleExist = false
            }
          }
        } else {
            moduleExist = false
        }
    
        if (moduleExist === false) {
            skillsList.SapModules.push(moduleId)
          commit('SET_USER_SKILLS', skillsList)
        }
    },
    removeModuleForSkills({
        commit,
        getters
      }, moduleId) {
        const skillsList = getters.getUserSkills,
              modules = skillsList.SapModules
        for (let i = 0; i < modules.length; i++) {
          if (modules[i] === moduleId) {
            modules.splice(i, 1)
          }
        }
        commit('SET_USER_SKILLS', skillsList)
      }, 
     
    removeSkill({
        commit,
        getters
      }, skill) {
        const skillsList = getters.getUserSkills,
              list = skillsList[skill.name]
        for (let i = 0; i < list.length; i++) {
          if (list[i] === skill.value) {
            list.splice(i, 1)
          }
        }
        commit('SET_USER_SKILLS', skillsList)
      }, 
    
    addSkill({commit,getters}, skill) {
        const skillsList = getters.getUserSkills,
            list = skillsList[skill.name]
         
        let ifExist = null
    
        if (list.length !== 0) {
          for (let i = 0; i < list.length; i++) {
            if (list[i] === skill.value || /^\s*$/.test(skill.value) ) {
                ifExist =  true
                return
            } else {
                ifExist = false
            }
          }
        } else {
            ifExist = false
        }
    
        if (ifExist === false) {
            skillsList[skill.name].push(skill.value)
          commit('SET_USER_SKILLS', skillsList)
        }
    },
    saveUserSkills({dispatch, getters, commit}, data){
        let urlQuery = getters.getUrlQuery;
        let data2 = {
            UserAlias: 'UIO',
            Language: 'PL'
        }
        let url = 'UserSkills' + urlQuery + "(UserAlias='" + data2.UserAlias + "',Language='" + data2.Language + "')";
        let newSkills =  JSON.parse(
             JSON.stringify(this.getters.getUserSkills)
           );
        dispatch('formatToString', newSkills);

        odata(url).post(newSkills).save(function (oData) {
            console.log("skile");
          }, function (status) {
            console.error(status); 
          });
    },
    addLanguageSkillsRow({
        commit,
        getters
      }) {
        const langList = getters.getUserLanguages
        langList.push({
            language: null,
            langLevel: null
        })
        commit('SET_USER_LANGS', langList)
    },
    removeLanguageSkillsRow({
        commit,
        getters
      }, index){
        const langList = getters.getUserLanguages
        langList.splice(index, 1)
        commit('SET_USER_LANGS', langList)
    }
}
 
const getters = {
    getUserSkills(state) {
        return state.userSkills
    },
    getUserLanguages(state){
        return state.userLanguages
    }
}

export default {
    state,
    mutations,
    actions,
    getters
}