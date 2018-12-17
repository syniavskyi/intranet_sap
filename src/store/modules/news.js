import axios from 'axios'
import router from '@/router/index.js'
import i18n from '../../lang/lang'

let utils = require('../../utils')

const state = {
    geoLoca: {
        lat: null,
        len: null
    },
    weather: {
        lat: '',
        lon: '',
        town: '',
        celcius: '',
        description: '',
        icon: '',
        clouds: '',
        wind: '',
        humidity: ''
    },
    todayDate: {
        today: null,
        dayDesc: null,
        isDay: null,
    },
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
    ADD_WEATHER_DATA(state, data) {
        state.weather = data
    },
    ADD_TODAY(state, data) {
        state.todayDate = data
    },
    ADD_NEWS(state, data) {
        state.news = data
    },
    ADD_JSON_NEWS(state, data) {
        state.newsJson = data
    },
    ADD_ARTICLES(state, data) {
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
                // "Content-Type": "application/x-www-form-urlencoded",//"application/atom+xml; type=entry; charset=utf-8",
                "Content-Type": "application/json",
                "X-Requested-With": "XMLHttpRequest",
                "Cache-Control": "no-cache",
                "x-csrf-token": sToken
                // "Cookie": getters.getCookie
            }
          }).then(res => {
              console.log(res);
              let message = res.headers;
              dispatch('displayModal', message);
            }).catch(error => {
              console.log(error);
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
    removeAdvert({commit, getters, dispatch}, advertId) {
        const URL = 'Adverts' + '(' + "AdvertId='" + advertId + "')"
        axios.delete(URL).then(res => {
            console.log(res)
        }).catch(error => {
           console.log(error)
       });
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
                // "Cookie": getters.getCookie
            }
          }).then(res => {
              console.log(res);
              commit("SET_SHOW_NEW_MESSAGE_DIALOG", false);
              let message = res.headers;
              dispatch('displayModal', message);
            }).catch(error => {
              console.log(error);
          })
    },
    // take location
    geoLoc({commit, state, dispatch}) {
        var geoLocat = {}
        var geo = navigator.geolocation;
        if(geo) {
          geo.getCurrentPosition(function(location) {
            var geoLocat = {};
            geoLocat.lat = (location.coords.latitude.toFixed(2));
            geoLocat.len = (location.coords.longitude.toFixed(2));
            commit('SET_LOCATION', geoLocat);
            dispatch("getWeatherData");
          })   
        } 
        if(!geoLocat.lat || !geoLocat.Len) {
   // set Wrocław to default localisation
        geoLocat.lat = 51.1;
        geoLocat.len = 17.03;
        commit('SET_LOCATION', geoLocat);
        dispatch("getWeatherData");
        }
      },
    getWeatherData({commit, state}) {
        const URL2 = 'https://api.openweathermap.org/data/2.5/weather?lat='+state.geoLoca.lat+'&lon='+state.geoLoca.len+'&appid=fd3f4877eb8823c22505c4b89a434e2b&units=metric'
         axios.get(URL2).then(res => {
         console.log(res)
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
         commit('ADD_WEATHER_DATA', weather)
         })
      },

      getToday({commit}){
          //day of the week
          const todayDate= {}
          todayDate.today = new Date()
          const today3 = todayDate.today.getDate()
          let month = (todayDate.today.getMonth() + 1)
          if(month<10){
              month = "0"+ month
          }
          const year = todayDate.today.getFullYear(),
           today2 = todayDate.today.getDay(),
           hour = todayDate.today.getHours()
          todayDate.dayDesc = ""
          switch(today2) {
              case 0: todayDate.dayDesc = i18n.t("news.sunday"); break
              case 1: todayDate.dayDesc = i18n.t("news.monday"); break
              case 2: todayDate.dayDesc = i18n.t("news.tuesday"); break
              case 3: todayDate.dayDesc = i18n.t("news.wednesday"); break
              case 4: todayDate.dayDesc = i18n.t("news.thursday"); break
              case 5: todayDate.dayDesc = i18n.t("news.friday"); break
              case 6: todayDate.dayDesc = i18n.t("news.saturday"); break
          }
          todayDate.today = today3+"."+month+"."+year
          if(hour > 6 && hour < 21) {
              todayDate.isDay = true
          } else {
              todayDate.isDay = false
          }
          commit('ADD_TODAY', todayDate)
      },

      getNews({commit, dispatch}) {
          // get news from RSS -> XML
        axios.get('https://fakty.interia.pl/ciekawostki/feed')
        .then(res => {
          console.log(res)
          const news = res.data
          commit('ADD_NEWS', news)
          dispatch("xmlToJson")
        })
        .catch(function(error) {
          console.log(error)
        });
    },
     xmlToJson({commit, state, dispatch}) {
         // parse XML to JSON
        let xmlTxt = state.news
        const convert = require('xml-to-json-promise')
         convert.xmlDataToJSON(xmlTxt).then(json => {
             xmlTxt = json.rss.channel[0].item
             console.log(xmlTxt)
             commit('ADD_JSON_NEWS', xmlTxt)
             dispatch("getArticles")
         })
      },
      getArticles({commit, state}) {
          // make html object
          let allArticles = state.newsJson,
          articles = []
          for(let i = 0; i < (allArticles.length); i++) {
            let article = document.createRange().createContextualFragment(allArticles[i].description[0]),
            a,  p, link,
            titleAlt = allArticles[i].title[0],
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
            
            let art = div
            document.getElementById('articles').appendChild(art)
            articles.push(art)
          }
          commit('ADD_ARTICLES', articles)
      }
    
}

const getters = {
    geoLocation2: state => {
        return state.geoLoca
    },
     weatherData: state => {
         return state.weather
     },
     today: state => {
        return state.todayDate
     },
     articlesRaw: state => {
         return state.news
     },
     articlesJson: state => {
         return state.newsJson
     },
     articles: state => {
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