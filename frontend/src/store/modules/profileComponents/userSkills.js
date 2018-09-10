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
        // {language: 'DE',  langLevel: 'A1'}
    ],
    newSkills: []
}

const mutations = {
    SET_USER_SKILLS(state, list) {
        state.userSkills = list
    },
    SET_USER_LANGS(state,list) {
        state.userLanguages = list
    },
    SET_NEW_SKILLS(state, list) {
        state.newSkills = list;
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
    saveUserSkills({dispatch, getters,commit}, data){
        let urlQuery = getters.getUrlQuery;
        let data2 = {
            UserAlias: 'UIO',
            Language: 'PL'
        }
        let url3 = 'UserSkills' + urlQuery + "&(UserAlias='UIO',Language='PL')";
        let url2 = 'UserSkills' + urlQuery + "(UserAlias='UIO',Language='PL')";
        let url = 'UserSkills' + urlQuery + "(UserAlias='" + data2.UserAlias + "',Language='" + data2.Language + "')";
        dispatch('formatSkillsToString', data);
        let newSkills = this.getters.getNewSkills;
        odata(url3).post(newSkills).save(function (oData) {
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
    },
    adjustUserSkills({getters, commit}) {
        const userSkills = getters.getUserSkills;
        const adjustedSkills = {
            AdditionalSkills: [],
            Extensions: [],
            ProgramLang: [],
            SapModules: [],
            Technologies: []
        };
        let index;
        let string;

        for(let key in adjustedSkills) {
            if(userSkills[0][key].includes('||')) {
                while(userSkills[0][key].length > 1) {
                    index = userSkills[0][key].indexOf('||');
                    if(index > 0) {
                        string = userSkills[0][key].slice(0, index)
                        adjustedSkills[key].push(string);
                        index += 2;
                        userSkills[0][key] = userSkills[0][key].substr(index, userSkills[0][key].length)
                    } 
                    else {
                        adjustedSkills[key].push(userSkills[0][key]);
                         userSkills[0][key] = "";
                    }
                } 
            }  
            else {
                adjustedSkills[key].push(userSkills[0][key]);
            }
        }
        commit('SET_USER_SKILLS', adjustedSkills); 
    },
    adjustLang({getters, commit}) {
        const lang = getters.getUserLanguages;
        console.log(lang);
        let selectList = [];
        for(let i = 0; i < lang.length; i++) {
            let select = new Object;
            select.Language = lang[i].Language;
            select.LangLevel = lang[i].LangLevel;
            selectList.push(select);
        }
        commit('SET_USER_LANGS', selectList)
    },
    formatSkillsToString({commit},data) {
        var newData = {
            AdditionalSkills: [],
            Extensions: [],
            ProgramLang: [],
            SapModules: [],
            Technologies: []
        };
        let string;
    
        for(let key in newData) {
          for(let i = 0; i < data[key].length; i++) {
              if(data[key].length <= 1) {
                newData[key] = data[key][i]
              }
              else {
                newData[key] += data[key][i] + '||';
              }
          }       
        }
        for(let key in newData) {   
            if(newData[key].includes('||')) {
                newData[key] = newData[key].slice(0, newData[key].length-2);
                }
        }
        commit('SET_NEW_SKILLS', newData)
    }
}
 
const getters = {
    getUserSkills(state) {
        return state.userSkills
    },
    getUserLanguages(state){
        return state.userLanguages
    },
    getNewSkills(state) {
        return state.newSkills
    }
}

export default {
    state,
    mutations,
    actions,
    getters
}