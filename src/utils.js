import moment from "moment";
import i18n from './lang/lang';

export const createRateDate = function (rateDate) {
  let day = parseFloat(moment(rateDate).format("D")),
    month = parseFloat(moment(rateDate).format("M")),
    dayOfWeek = parseFloat(moment(rateDate).weekday());

  if (dayOfWeek === 6) {
    if (day !== 1) {
      day = day - 1;
      rateDate.setDate(day);
    } else {
      rateDate = new Date(rateDate.getFullYear(), rateDate.getMonth() - 1, 0);
    }
  } else if (dayOfWeek === 0) {
    if (day !== 1) {
      day = day - 2;
      rateDate.setDate(day);
    } else {
      rateDate = new Date(rateDate.getFullYear(), rateDate.getMonth() - 1, 0);
      day = moment(rateDate).format("D");
      day = day - 1;
      rateDate.setDate(day);
    }
  }

  return rateDate;
};

export const formatDateForBackend = function (date) {
  if(date){
     date = this.formatTimeZone(date, 1);
    return "/Date(" + new Date(date).getTime().toString() + ")/";
  } else {
    return null;
  }
};

export const dateStringToObj = function (date) {
  if (date && date !== null) {
    return new Date(parseInt(date.substring(6, date.length - 2)));
  }
  else {
    return null;
  }
};
// create independent clone without date changing
export const createClone = function (data) {
  let clone = JSON.parse(JSON.stringify(data));
  if (clone.constructor === Array) {
    for (let key in clone[0]) {
      for (let i = 0; i < clone.length; i++) {
        if (key.toLowerCase().includes("date")) {
          clone[i][key] = new Date(clone[i][key]);
        }
      }
    }
  } else {
    for (let key in clone) {
      if (key.toLowerCase().includes("date")) {
        clone[key] = new Date(clone[key]);
      }
    }
  }
  return clone;
}
// format string to array
export const formatToArray = function (data) {
  if(data.length != 0) {
  let dataSet;
  if (data[0].__metadata) {
    dataSet = data[0].__metadata.type;
  }
  let index, string;
  let array = [];

  for (let i = 0; i < data.length; i++) {
    if (data[i].__metadata) {
      delete data[i].__metadata;
      //  let pos = data[i].findIndex(x => x[i] == '__metadata');
      //  data[i].splice(pos, 1);
    }
    for (let key in data[i]) {
      if (data[i][key].includes('||')) {
        while (data[i][key].length > 1) {
          index = data[i][key].indexOf('||');
          if (index > 0) {
            string = data[i][key].slice(0, index);
            array.push(string);
            index += 2;
            data[i][key] = data[i][key].substr(index, data[i][key].length);
          } else {
            array.push(data[i][key]);
            data[i][key] = "";
          }
        }
        data[i][key] = array;
        array = [];
      } else {
        if (dataSet == 'ZGW_INTRANET_SRV.UserSkills' && key != "UserAlias" ||
          dataSet == 'ZGW_INTRANET_SRV.UserSkills' && key != "Language" ||
          dataSet == 'ZGW_INTRANET_SRV.Event' && key == 'Employee' ||
          dataSet == 'ZGW_INTRANET_SRV.Event' && key == 'TargetGroup') {
          array.push(data[i][key]);
          data[i][key] = array;
          array = [];
        }
      }
    }
  }
  return data;
  }
}
// format array to string, divedied by "||"
export const formatToString = function (data) {
  let formattedData = {};
  for (let key in data) {
    if (data[key]) {
      if (data[key].constructor === Array) {
        formattedData[key] = "";
        for (let i = 0; i < data[key].length; i++) {
          if (data[key].length <= 1) {
            formattedData[key] = data[key][i]
          } else {
            formattedData[key] += data[key][i] + '||';
          }
        }
        if (formattedData[key].includes('||')) {
          formattedData[key] = formattedData[key].slice(0, formattedData[key].length - 2);
        }
        data[key] = formattedData[key];
      }
    }
  }
  return data;
}

export const setWorkExperience = function (date) {
  let oDates = {
    day: "",
    month: "",
    year: ""
  };

  if (date.years === 0) {
    oDates.year = "";
  } else if (date.years === 1) {
    oDates.year = i18n.t("dates.year");
  } else if (date.years > 1 && date.years <= 4) {
    oDates.year = date.years + i18n.t("dates.yearsF");
  } else if (date.years > 4) {
    oDates.year = date.years + i18n.t("dates.yearsM");
  }

  if (date.months === 0) {
    oDates.month = "";
  } else if (date.months === 1) {
    oDates.month = i18n.t("dates.month");
  } else if (date.months > 1 && date.months <= 4) {
    oDates.month = date.months + i18n.t("dates.monthsF");
  } else if (date.months > 4) {
    oDates.month = date.months + i18n.t("dates.monthsM");
  }

  if (date.days === 0) {
    oDates.day = "";
  } else if (date.days === 1) {
    oDates.day = date.days + i18n.t("dates.day");
  } else {
    oDates.day = date.days + i18n.t("dates.days");
  }

  return oDates;
}

// format time from backend type to HH:mm:ss
export const formatTimeForCalendar = function(data) {
  let format = data.slice(2, 4) + data.slice(5, 7) + data.slice(8, 10); 
  return data = moment(format, "hmm").format('HH:mm:ss'); 
}

export const formatTimeForBackend = function (data) {
  return "PT" + data.slice(0, 2) + "H" + data.slice(3, 5) + "M00S";
}

// check user role
export const checkRole = function(data) {
  // const roles = data.roles; 
  const aRoles = data; //get all roles
  let aMaxRoles = { "ZMENU": {
    home: false,
    profile: false,
    calendar: false,
    employees: false,
    documents: false,
    availability: false,
    delegations: false,
    registration: false
  } },
      oRole, oRoleByKey,
      sValueWas, sValue;
  for(let i = 0; i < aRoles.length; i++){
    oRole = aRoles[i]; //current role in loop
    oRoleByKey = aMaxRoles[oRole.Key]
    if(oRole.Key === "ZMENU"){ // if authorization object is menu, just push it
      switch(oRole.Value){
        case "HOME":
          aMaxRoles["ZMENU"].home = true;
          break;
        case "PROFILE":
          aMaxRoles["ZMENU"].profile = true;
          break;
        case "CALENDAR":
          aMaxRoles["ZMENU"].calendar = true;
          break; 
        case "EMPL":
          aMaxRoles["ZMENU"].employees = true;
          break;
        case "DOCS":
          aMaxRoles["ZMENU"].documents = true;
          break;
        case "AVAIL":
          aMaxRoles["ZMENU"].availability = true;
          break;
        case "DELEG":
          aMaxRoles["ZMENU"].delegations = true;
          break;
        case "REGISTR":
          aMaxRoles["ZMENU"].registration = true;
          break;
      }
      
    } else if(!oRoleByKey){ // if there is no key, push it
      aMaxRoles[oRole.Key] = oRole.Value;
    } else if(oRoleByKey){ // if author. object already in, get more significant
      sValueWas = oRoleByKey.Value;
      sValue = oRole.Value;
      switch(oRole.Value){
        case "*":
          aMaxRoles[oRole.Key] = sValue;
          break;
        case "TEAM":
          if(sValueWas !== "*"){
            aMaxRoles[oRole.Key] = sValue; 
          }
          break;
        case "OWN":
          if(sValueWas !== "*" || sValueWas !== "TEAM" ){
            aMaxRoles[oRole.Key] = sValue; 
          }
          break;
      }
    } 
  }
  return aMaxRoles;
  }

 export const dateToValid = function(beforeData, newData) {
   let a = new Date(beforeData.getFullYear(), beforeData.getMonth(), beforeData.getDay());
   let b = new Date(newData.getFullYear(), newData.getMonth(), newData.getDay());
   return a.getTime() !== b.getTime();
 } 
 //add one day to data send to backend 
 export const formatTimeZone = function(oDate) {
  var nUserOffset;
  if (oDate) {
    nUserOffset = oDate.getTimezoneOffset() * 60 * 1000;
    return new Date(oDate.getTime() - nUserOffset);
      }
  }
  export const checkAuthLink = function(oEvent, oStore) {
    var sCurrentPath = oEvent.currentRoute.name,
        sPath = sCurrentPath.toLowerCase();
    if(oStore) {
      if(oStore.hasOwnProperty(sPath) && !(oStore[sPath])) {
        oEvent.push({name: "News"})
      }
    }
  }
const actions = {};
