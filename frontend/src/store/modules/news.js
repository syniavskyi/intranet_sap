import axios from 'axios'
import router from '@/router/index.js'
import i18n from '../../lang/lang'

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
    news: null,
    newsJson: {},
    articles: []
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
    }
}

const actions = {
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
        } else {
   // set Wrocław to default localisation
        geoLocat.lat = 51
        geoLocat.len = 16
        commit('SET_LOCATION', geoLocat);
        dispatch("getWeatherData");
        }
      },
    getWeatherData({commit, state}) {
        const URL2 = 'http://api.openweathermap.org/data/2.5/weather?lat='+state.geoLoca.lat+'&lon='+state.geoLoca.len+'&appid=fd3f4877eb8823c22505c4b89a434e2b&units=metric'
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
         weather.icon = "http://openweathermap.org/img/w/"+data.weather[0].icon+".png"
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
     }
}

export default {
    state,
    getters,
    mutations,
    actions,
}