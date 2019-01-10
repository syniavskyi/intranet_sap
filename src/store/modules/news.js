import axios from 'axios'
import moment from "moment"
import i18n from '../../lang/lang'

let utils = require('../../utils')

const state = {
    geoLoca: {
        lat: null,
        len: null
    },
    weather: {},
    todayDate: {},
    slider: {
        slideIndex: 1,
        interval: "",
        start: i18n.t("button.startSlider"),
        stop: i18n.t("button.stopSlider"),
        btnTxt: i18n.t("button.stopSlider"),
        sliderToast: i18n.t("message.stoppedSlider")
    },
    news: null,
    newsJson: {},
    articles: [],
    showNewMessageDialog: false,
    dataToRead: ["UserList", "NewToken", "Events", "Adverts", "Domains", "Industries", "UserData"],
    showAdverts: false
}

const mutations = {
    SET_LOCATION(state, data) {
        state.geoLoca = data
    },
    SET_WEATHER_DATA(state, data) {
        state.weather = data
    },
    SET_TODAY(state, data) {
        state.todayDate = data
    },
    SET_NEWS(state, data) {
        state.news = data
    },
    SET_JSON_NEWS(state, data) {
        state.newsJson = data
    },
    SET_ARTICLES(state, data) {
        state.articles = data
    },
    SET_SHOW_NEW_MESSAGE_DIALOG(state, show) {
        state.showNewMessageDialog = show
    },
    SET_SLIDE_INDEX(state, index) {
        state.slider.slideIndex = index
    },
    SET_SLIDE_INTERVAL(state) {
        clearInterval(state.slider.interval)
    },
    SET_TOAST_TEXT(state, txt) {
        state.slider.sliderToast = txt
    },
    SET_SHOW_ADVERTS(state, isShow){
        state.showAdverts = isShow;
    }
}

const actions = {
    setSliderInterval({dispatch}) {
        state.slider.interval = setInterval(() => {state.slider.slideIndex+=1; dispatch("runCarosuel", state.slider.slideIndex)}, 4000)
    },
    runCarosuel({dispatch, commit}, n) {
        var slides = document.getElementsByClassName("advItem");
            if (n > slides.length) { commit("SET_SLIDE_INDEX", 1) }
            if (n < 1) { commit("SET_SLIDE_INDEX", slides.length) }
            for (var i = 0; i < slides.length; i++) {
                slides[i].style.display = "none";
            }
            slides[state.slider.slideIndex - 1].style.display = "flex";
    },
    updateAdvert({commit, state, dispatch, getters}, index){
        let data = index;
        const url = `Adverts(AdvertId='${data.AdvertId}')`;
        let sToken = getters.getToken;
        data.ValidTo = utils.formatDateForBackend(data.ValidTo);
        axios({
            url: url,
            method: 'put',
            data: data,
            headers: {
                "Content-Type": "application/json",
                "X-Requested-With": "XMLHttpRequest",
                "Cache-Control": "no-cache",
                "x-csrf-token": sToken
            }
          }).then(res => {
              let message = res.headers;
              dispatch('displayModal', message);

            }).catch(error => {
          })
    },
    startStopSlider({dispatch}, evt) {
        // this.repeatSlider = false;
        if (evt.target.innerText === state.slider.start) {
            evt.target.innerText = state.slider.stop
            state.slider.sliderToast = i18n.t("message.startedSlider")
            state.slider.interval = setInterval(() => {state.slider.slideIndex+=1; dispatch("runCarosuel", state.slider.slideIndex)}, 4000)
        } else {
            evt.target.innerText = state.slider.start
            state.slider.sliderToast = i18n.t("message.stoppedSlider")
            clearInterval(state.slider.interval)
        }
        dispatch("displayToast");
    },
    removeAdvert({getters, commit, dispatch}, advertId) {
        const URL = 'Adverts' + '(' + "AdvertId='" + advertId + "')"
        axios({
            url: URL,
            method: 'delete',
            data: advertId,
            headers: {
                "Content-Type": "application/json",
                "X-Requested-With": "XMLHttpRequest",
                "Cache-Control": "no-cache",
                "x-csrf-token": getters.getToken
            }
        }).then(res => {
            commit("SET_PROMISE_TO_READ", ["NewToken", "Adverts"]);
            dispatch('getData');
        }).catch(error => {
        })
    },
    addNewAdvert({getters, commit, dispatch}, data2){
        const url = 'Adverts';
        const data = utils.createClone(data2);
        data.ValidTo = utils.formatDateForBackend(data.ValidTo);
        data.CreatedBy = localStorage.getItem("id");
        axios({
            url: url,
            method: 'post',
            data: data,
            headers: {
                "Content-Type": "application/json",
                "X-Requested-With": "XMLHttpRequest",
                "Cache-Control": "no-cache",
                "x-csrf-token": getters.getToken
            }
          }).then(res => {
              commit("SET_SHOW_NEW_MESSAGE_DIALOG", false);
              let message = res.headers;
              dispatch('displayModal', message);
              commit("SET_PROMISE_TO_READ", ["NewToken", "Adverts"]);
              dispatch('getData');
            }).catch(error => {
          })
    },
    // take location
    geoLoc({commit, dispatch}) {
        var geoLocat = {}
        var geo = navigator.geolocation;
        if(geo) {
          geo.getCurrentPosition(function(location) {
            var geoLocat = {};
            geoLocat.lat = (location.coords.latitude.toFixed(2));
            geoLocat.len = (location.coords.longitude.toFixed(2));
            commit('SET_LOCATION', geoLocat);
            dispatch("getWeatherDataFn");
          })
        }
        if(!geoLocat.lat || !geoLocat.Len) {
   // set Wrocław to default localisation
        geoLocat.lat = 51.1;
        geoLocat.len = 17.03;
        commit('SET_LOCATION', geoLocat);
        dispatch("getWeatherDataFn");
        }
      },
    getWeatherDataFn({commit, state}) {
        const URL2 = 'https://api.openweathermap.org/data/2.5/weather?lat='+state.geoLoca.lat+'&lon='+state.geoLoca.len+'&appid=fd3f4877eb8823c22505c4b89a434e2b&units=metric'
         axios.get(URL2).then(res => {
         const data = res.data
         const weather = {}
         weather.lon = data.coord.lon
         weather.lat = data.coord.lat
         if(data.name =='Wroclaw'){
            weather.town = 'Wrocław'
         }
        else if(data.name == 'Dabrowa Gornicza'){
            weather.town = 'Dąbrowa Górnicza'
             }
        else {
            weather.town = data.name
        }
         weather.celcius = data.main.temp.toFixed(0);
        //  weather.description = data.weather[0].description /opis po ang
         weather.icon = "https://openweathermap.org/img/w/"+data.weather[0].icon+".png"
         weather.clouds = data.clouds.all
         weather.wind = ((data.wind.speed) * (3.6)).toFixed(2)
         weather.humidity = data.main.humidity
         commit('SET_WEATHER_DATA', weather)
         })
      },

      getTodayFn({commit}){
          //day of the week
          const todayDate= {},
          todayObject = new Date(),
          dayOfTheWeek = todayObject.getDay(),
          hour = todayObject.getHours();
          todayDate.today = moment(new Date()).format("DD.MM.YYYY");
          todayDate.dayDesc = ""
          switch(dayOfTheWeek) {
              case 0: todayDate.dayDesc = i18n.t("news.sunday"); break
              case 1: todayDate.dayDesc = i18n.t("news.monday"); break
              case 2: todayDate.dayDesc = i18n.t("news.tuesday"); break
              case 3: todayDate.dayDesc = i18n.t("news.wednesday"); break
              case 4: todayDate.dayDesc = i18n.t("news.thursday"); break
              case 5: todayDate.dayDesc = i18n.t("news.friday"); break
              case 6: todayDate.dayDesc = i18n.t("news.saturday"); break
          }
          if(hour > 6 && hour < 21) {
              todayDate.isDay = true
          } else {
              todayDate.isDay = false
          }
          commit('SET_TODAY', todayDate)
      },

      getNewsFn({commit, dispatch}) {
          // get news from RSS -> XML
          const proxyurl = "https://cors-anywhere.herokuapp.com/";
            const url = "https://fakty.interia.pl/ciekawostki/feed"; // site that doesn’t send Access-Control-*
            fetch(proxyurl + url)
            .then(response => response.text())
            .then(contents => commit('SET_NEWS', contents))
            .then(() => dispatch("xmlToJson"))
            .catch(() => console.log("Can’t access " + url + " response. Blocked by browser?"))
    },
     xmlToJson({commit, getters, dispatch}) {
         // parse XML to JSON
        let xmlTxt = getters.getArticlesRaw;
        const convert = require('xml-to-json-promise')
         convert.xmlDataToJSON(xmlTxt).then(json => {
             xmlTxt = json.rss.channel[0].item
             commit('SET_JSON_NEWS', xmlTxt)
             dispatch("getArticlesFn")
         })
      },
      getArticlesFn({commit, getters}) {
          // make html object
          if(getters.getArticles.length !== 10) {
            let allArticles = getters.getArticlesJson,
          articles = []
            for(let i in allArticles) {
                let article = document.createRange().createContextualFragment(allArticles[i].description[0]),
                a,  p, link,
                title = document.createTextNode(allArticles[i].title[0]),
                param = document.createElement('p'),
                ahref = document.createElement('a'),
                ahrefImg = document.createElement('a'),
                div = document.createElement('div'),
                img = document.createElement('img'),
                headDiv = document.createElement('div'),
                contentDiv = document.createElement('div'),
                head = document.createElement('h1')
                head.appendChild(title)
                ahref.appendChild(head)
                link = allArticles[i].link[0]
                ahref.href = link
                ahref.target = "_blank"
                headDiv.appendChild(ahref)
                headDiv.className = "artTitle"
                if(article.childNodes[0].childNodes[0].nodeType == 1) {
                    a = article.childNodes[0].childNodes[0];
                    p = article.childNodes[0].childNodes[1];
                    param.appendChild(p);
                } else {
                    img.id = "img"+[i]
                    ahrefImg.className = "articleImg"
                    ahrefImg.appendChild(img);
                    ahrefImg.href = link;
                    p = article.childNodes[0].childNodes[0];
                    param.appendChild(p);
                }
                div.appendChild(headDiv)
                contentDiv.className = "artContent"
                if(a) {
                contentDiv.appendChild(a)
                contentDiv.appendChild(param)
                div.appendChild(contentDiv)
                } else {
                contentDiv.appendChild(ahrefImg)
                contentDiv.appendChild(param)
                div.appendChild(contentDiv)
                }
                div.className = "artAll"
                if(div !== null) {
                    document.getElementById('articles').appendChild(div)
                    articles.push(div)
                }
          }
          commit('SET_ARTICLES', articles)
          } else {
              for(let val of getters.getArticles) {
                  if(val!== null) {
                    document.getElementById('articles').appendChild(val)
                  }
              }
          }
      }
}

const getters = {
    getGeoLocation() {
        return state.geoLoca
    },
     getWeatherData() {
         return state.weather
     },
     getToday() {
        return state.todayDate
     },
     getArticlesRaw() {
         return state.news
     },
     getArticlesJson() {
         return state.newsJson
     },
     getArticles() {
         return state.articles
     },
    getShowNewMessageDialog() {
        return state.showNewMessageDialog
    },
    getSliderIndex() {
        return state.slider.slideIndex
    },
    getToastText() {
        return state.slider.sliderToast
    },
    getSliderBtnTxt() {
        return state.slider.btnTxt
    },
    getNewsToRead(){
        return state.dataToRead;
    },
    getShowAdverts(){
        return state.showAdverts;
    }
}

export default {
    state,
    getters,
    mutations,
    actions,
}