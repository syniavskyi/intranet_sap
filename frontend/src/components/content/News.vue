<template>
<div class="plane-component">
    <div class="component-nav-and-content">
      <app-menu></app-menu>
      <div class="component-content">
        <div class="content-header">
          <div class="content-header-title-and-menu">
            <img src="../../assets/images/nav/if_menu-32.png" width="32px" class="content-header-menu">
            <p class="content-header-title">Newsy</p>
          </div>
        </div>
        <div class="content-body">
          <div class="api">
          <div class="content-event">
            <p>Events API</p>
           </div>
            <div class="content-weather"  :class="today.isDay ? 'weatherDay' : 'weatherNight' ">
              <div class="intro">
                <div class="town">
                    <p> {{weatherData.town}} </p>
                </div>
                <div class="icon">
                  <img :src="weatherData.icon" alt="icon" height="64px">
                </div>
              </div>
              <div class="info">
                <div class="weather-header">
                </div> 
                <div class="temp">
                  <!-- <img src="../../assets/images/weather/temps.png" height="46px" class="iconTemp"/> -->
                  <p> {{ weatherData.celcius }} <sup>o</sup>C </p> 
                </div>
              </div>
              <!-- <div class="description">
                    <p> {{weatherData.description}} </p> 
              </div> -->
              <div class="additional">
                <div class="weatherDesc">
                    <img src="../../assets/images/weather/winds.png" class="iconWeather"/>
                    <p> {{weatherData.wind}} km/h</p>
                </div>
                <div class="weatherDesc">
                    <img src="../../assets/images/weather/clouds.png"  class="iconWeather"/>
                    <p> {{weatherData.clouds}}%</p>
                </div>
                <div class="weatherDesc">
                    <img src="../../assets/images/weather/humiditys.png" class="iconWeather"/>
                    <p> {{weatherData.humidity}}%</p>
                </div>
              </div> 
              <div class="date">
                <p> {{ today.dayDesc }}, {{ today.today }} </p>  
              </div>
            </div>
          </div>
          <div class="content-news" style="overflow-y:hidden">
            <button @click="xmlToJson">gtgtg3</button>
            <!-- <iframe width="100%" height="750" frameborder="0" class="rssdog" style="overflow-y:hidden" src="https://www.rssdog.com/index.php?url=http%3A%2F%2Ffakty.interia.pl%2Ffeed&mode=html&showonly=&maxitems=7&showdescs=1&desctrim=0&descmax=0&tabwidth=100%25&linktarget=_blank&textsize=inherit&bordercol=%23d4d0c8&headbgcol=%23999999&headtxtcol=%23ffffff&titlebgcol=%23f1eded&titletxtcol=%23000000&itembgcol=%23ffffff&itemtxtcol=%23000000&ctl=0"></iframe> -->
            <div id="articles"></div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Menu from "../Menu.vue";
import axios from "axios";
import { mapGetters } from "vuex";
import { mapActions } from "vuex";
import i18n from "../../lang/lang";
export default {
  beforeCreate() {
    // this.$store.dispatch("geoLoc");
  },
  created() {
    this.getToday();
  },
  components: {
    "app-menu": Menu
  },
  computed: {
    ...mapGetters(["geoLocation2", "weatherData", "today"])
  },
  methods: {
    ...mapActions(["geoLoc", "getWeatherData", "getToday"]),

    xmlToJson() {
      const a = 1;
      axios({
        method: 'get',
        // mode: 'no-cors',
        // url: 'http://wroclaw.naszemiasto.pl/rss/artykuly/9.xml',
        // url: 'http://www.dobre-wiesci.pl/feed', options 0
        url: 'http://www.fajnymagazyn.pl/rss.xml',
        headers: {
          // "Content-type": "application/x-www-form-urlencoded; charset=utf-8",
          // "Access-Control-Allow-Origin": true,
          // 'Access-Control-Allow-Origin': '*',
          // 'App-Token': '^#$%Fgvgdf%^#$&%^TGbV',
          // 'Access-Control-Allow-Methods': 'GET, PUT, POST, DELETE, OPTION',
          // "Content-type": 'application/xml',
          // "crossDomain" : true,
           'Accept': 'application/json',
          // "cors": true
          // 'Access-Control-Allow-Origin': '*',
          // 'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
          // 'Access-Control-Allow-Headers': 'App-Token'
          // miałam te trzy
          "Access-Control-Allow-Origin" : "*",
          "Access-Control-Allow-Methods" : "GET,POST,PUT,DELETE,OPTIONS",
           "Access-Control-Allow-Headers": "Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With",
        //  miałam te trzy
         //  'Content-Type' : 'application/x-www-form-urlencoded; charset=UTF-8'
        }
        // ,
        // withCredentials: true,
        // credentails: 'same-origin'
        // ,
        // "routes": {
        //   "cors": true
        // }
        //  
      })
        .then(res => {
          console.log(res.data);
        })
        .catch(function(error) {
          console.log(error);
        });
    }
    //   let script = document.createElement('script')
    //   script.setAttribute('type', 'text/javascript')
    //   script.setAttribute('language', 'javascript')
    //   script.setAttribute('src', 'https://www.rssdog.com/index.php?url=http%3A%2F%2Ffakty.interia.pl%2Ffeed&amp;mode=javascript&amp;showonly=&amp;maxitems=7&amp;showdescs=1&amp;desctrim=0&amp;descmax=0&amp;tabwidth=95%25&amp;linktarget=_blank&amp;textsize=inherit&amp;bordercol=%23d4d0c8&amp;headbgcol=%23999999&amp;headtxtcol=%23ffffff&amp;titlebgcol=%23f1eded&amp;titletxtcol=%23000000&amp;itembgcol=%23ffffff&amp;itemtxtcol=%23000000&amp;ctl=0')
    //       script.setAttribute('Access-Control-Allow_origin', true)
    //       document.getElementById('articles').insertAdjacentElement('afterend', script)
    // // Create the return object

    //   axios({
    //       method: 'get',
    //       url: 'http://fakty.interia.pl/feed',
    //       headers: {
    //         "Content-type": "application/x-www-form-urlencoded; charset=utf-8",
    //         "Access-Control-Allow-Origin": true
    //       }
    // }).then(res =>  {
    //   console.log(res.data)
    // })

    //   const URL3 = 'http://fakty.interia.pl/feed',
    //   URL4 = 'https://www.tvn24.pl/najnowsze.xml',
    //   URL5 = 'http://www.rmf24.pl/fakty/feed'

    //    axios({
    //    method: 'get',
    //    url: xmlTxt,
    //    headers: {
    //       "Content-type": "application/x-www-form-urlencoded; charset=utf-8",
    //       "Access-Control-Allow-Origin": true
    //     }
    //    }).then(res => {
    //       console.log(res.data)
    //       const data = res.data })

    //   var obj = {};
    //   var xml = new DOMParser().parseFromString(xmlTxt, 'text/xml');

    //   var parser = new DOMParser();
    //   var doc = parser.parseFromString(xmlTxt, 'text/xml');

    // if (xml.nodeType == 1) { // element
    // 	// do attributes
    // 	if (xml.attributes.length > 0) {
    // 	obj["@attributes"] = {};
    // 		for (var j = 0; j < xml.attributes.length; j++) {
    // 			var attribute = xml.attributes.item(j);
    // 			obj["@attributes"][attribute.nodeName] = attribute.nodeValue;
    // 		}
    // 	}
    // } else if (xml.nodeType == 3) { // text
    // 	obj = xml.nodeValue;
    // }

    // // do children
    // // If just one text node inside
    // if (xml.hasChildNodes() && xml.childNodes.length === 1 && xml.childNodes[0].nodeType === 3) {
    // 	obj = xml.childNodes[0].nodeValue;
    // }
    // else if (xml.hasChildNodes()) {
    // 	for(var i = 0; i < xml.childNodes.length; i++) {
    // 		var item = xml.childNodes.item(i);
    // 		var nodeName = item.nodeName;
    // 		if (typeof(obj[nodeName]) == "undefined") {
    // 			obj[nodeName] = xmlToJson(item);
    // 		} else {
    // 			if (typeof(obj[nodeName].push) == "undefined") {
    // 				var old = obj[nodeName];
    // 				obj[nodeName] = [];
    // 				obj[nodeName].push(old);
    // 			}
    // 			obj[nodeName].push(xmlToJson(item));
    // 		}
    // 	}
    // }
    // return obj;
    //   }
  }
};
</script>


<style scope>
.weatherDay {
  background-image: url("../../assets/images/weather/day.png");
}

.weatherNight {
  background-image: url("../../assets/images/weather/night.png");
}
</style>
