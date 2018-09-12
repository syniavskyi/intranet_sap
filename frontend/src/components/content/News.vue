<template>
<div class="plane-component">
    <div class="component-nav-and-content">
        <app-menu v-show="getShowMenu"></app-menu>
            <div class="component-content">
                <div class="content-header">
                <div class="content-header-title-and-menu">
                <img src="../../assets/images/nav/if_menu-32.png" width="32px" class="content-header-menu">
                <p class="content-header-title">Strona główna</p>
            </div>
        </div>
        <!-- slideshow with users adverts -->
        <!-- <div id="adverts">
            <div class="slider elements-list" id="slider1">
                <div class="slider-slides-cnt">
                    <article class="element slider-slide">
                        <h2 class="element-title">1 Lorem ipsum dolor sit.</h2>
                        <div class="element-text">Lorem ipsum dolor sit amet, consectetur adipisicing elit...</div>
                    </article>
                    <article class="element slider-slide">
                        <h2 class="element-title">2 Lorem ipsum dolor sit.</h2>
                        <div class="element-text">Lorem ipsum dolor sit amet, consectetur adipisicing elit...</div>
                    </article>
                </div>
                <div class="slider-nav">
                    <button type="button" class="slider-button slider-button-prev">Poprzedni</button>
                    <button type="button" class="slider-button slider-button-next">Następny</button>
                </div>
                <ul class="slider-dots">
                    <li class="slider-dots-element slider-dots-element-active"><button class="slider-dots-button" type="button">1</button></li>
                    <li class="slider-dots-element"><button class="slider-dots-button" type="button">2</button></li>
                    <li class="slider-dots-element"><button class="slider-dots-button" type="button">3</button></li>
                </ul>
            </div>
        </div> -->
        <div class="content-body">
            <div class="gallery items-3">
                <!-- place to add custom adverts and edit existing ones -->
                <!-- <h3>Moje ogłoszenia</h3> -->
                <ul>
                    <div id="item-1" class="control-operator"></div>

                    <li class="item" v-for="(advert, index) in userAdverts" :key="advert.Id" :id="advert.Id">  
                        <div class="control-operator"></div>
                        <input disabled v-model="advert.Message"/> 
                            <v-date-picker popoverDirection="top" is-expanded mode="single" v-model="advert.ValidTo">
                                <input value="advert.ValidTo"/>
                            </v-date-picker>
                        <button @click="editAdvert(index)">edytuj</button> 
                        <button @click="removeAdvert(index)">X</button>
                    </li>
                    <div class="controls">
                        <a href="/#001" class="control-button">•</a>
                        <a href="/#002" class="control-button">•</a>
                        <a href="/#003" class="control-button">•</a>
                    </div>
                </ul>
                <input v-model="newAdvert"/>
                <button>+</button>
            </div>
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
                        <div class="weather-header"></div> 
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
                        <p>{{ today.dayDesc }}, {{ today.today }}</p>  
                    </div>
                </div>
            </div>
            <div class="content-news">
                <div id="articles"></div>
            </div>
        </div>
    </div>
    </div>
  </div>
</template>

<script>
import Menu from "../Menu.vue"
import axios from "axios"
import { mapGetters } from "vuex"
import { mapActions } from "vuex"
import i18n from "../../lang/lang"
export default {
  data() {
    return {
      newAdvert: null
    }
  },
  beforeCreate() {
    this.$store.dispatch("geoLoc");
    this.$store.dispatch("getNews")
  },
  created() {
    this.getToday()
    // this.getNews()
  },
 
  components: {
    "app-menu": Menu
  },
  computed: {
    ...mapGetters(["geoLocation2", "weatherData", "today", "articlesRaw", "articlesJson", "articles", "userAdverts", "getShowMenu"]),
  },
  methods: {
    ...mapActions(["geoLoc", "getWeatherData", "getToday", "getNews", "xmlToJson", "getArticles"]),
    }
  }
</script>


<style scoped>
.weatherDay {
  background-image: url("../../assets/images/weather/day.png")
}

.weatherNight {
  background-image: url("../../assets/images/weather/night.png")
}

.slide {
    opacity: 0;
    z-index: 0;
    position: relative;
    transition:2s all;
}
.slide .title {
    left: -2rem;
    opacity: 0;
}

/* poprzez dodatkową klasę zmieniam właściwości elementu i jego dzieci */
.slide.active {
    opacity: 1;
    z-index: 1;
}
.slide.active .title {
    left: 0;
    opacity: 1;
}
.slider {
    position: relative;
    /* background: url(slide-bg1.jpeg); */
    background-size: cover;
    background-position: center center;
}

/* kontener dla wszystkich slajdów */
.slider-slides-cnt {
    height:700px;
    position: relative;
}

/* pojedynczy slide */
.slider-slide {
    position: absolute;
    left:0;
    top:0;
    width:100%;
    height:100%;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    opacity:0;
    z-index: 0;
}
/* slide aktywny */
.slider-slide-active {
    z-index: 1;
}

/* elementy pojedynczego slajdu */
.slider .element-title {
    color:#fff;
    font-family: sans-serif;
    position: relative;
    left:-3rem;
    opacity:0;
    font-size:6rem;
    text-transform: uppercase;
    font-weight: normal;
    margin-top:0;
    text-align: center;
    font-family: 'Roboto Condensed', sans-serif;
}
.slider .element-text {
    color:#fff;
    position: relative;
    left:-3rem;
    opacity:0;
    font-size:1.5rem;
    color:rgba(255,255,255,.6);
    padding-left:4rem;
    padding-right:4rem;
    text-align: center;
    font-family: serif;
    font-style: italic;
    max-width:60%;
}

/* animacja slajdów */
.slider-slide {
    opacity: 0;
    transition:0.4s all;
}
.slider .element-title {
    left:-3rem;
    opacity:0;
    transition: 2s left, 2s opacity;
}
.slider .element-text {
    left:-3rem;
    opacity:0;
    transition: 2s 1s left, 2s 1s opacity;
}

/* aktywny slide zmienia właściwości elementów */
.slider-slide-active {
    opacity: 1;
}
.slider-slide-active .element-title {
    left:0;
    opacity:1;
}
.slider-slide-active .element-text {
    left:0;
    opacity:1;
}

/* przyciski strzałek slajdu */
.slider-button-prev,
.slider-button-next {
    cursor: pointer;
    z-index: 2;
    position: absolute;
    left:0;
    top:0;
    width:4rem;
    height:100%;
    background: rgba(0,0,0,0.1);
    border:0;
    text-indent:-999px;
    overflow:hidden;
}
.slider-button-next {
    left:auto;
    right:0;
}
.slider-button-prev:focus,
.slider-button-next:focus {
    outline: none;
}
.slider-button-prev:before,
.slider-button-next:before {
    content:'<';
    display: flex;
    justify-content: center;
    align-items: center;
    position: absolute;
    left:0;
    top:0;
    width:100%;
    height:100%;
    font-size:2rem;
    color:#fff;
    text-indent: 0;
}
.slider-button-next:before {
    content: '>';
}

/* slider dots */
.slider-dots {
    z-index: 2;
    position: absolute;
    left:0;
    bottom:1rem;
    margin:0;
    padding:0;
    width:100%;
    display: flex;
    justify-content: center;
    list-style:none;
}
.slider-dots-element {
}
.slider-dots-button {
    background: transparent;
    width:2rem;
    height:2rem;
    border:0;
    text-indent:-999px;
    overflow: hidden;
    cursor: pointer;
    position: relative;
}
.slider-dots-button:before {
    content:'';
    position: absolute;
    left:50%;
    top:50%;
    transform:translate(-50%, -50%);
    background: transparent;
    width:0.9rem;
    height:0.9rem;
    border-radius: 50%;
    transition:0.5s all;
    box-shadow:inset 0 0 0 2px rgba(255,255,255,0.5);
}
.slider-dots-element-active .slider-dots-button:before {
    background: #fff;
    transform:translate(-50%, -50%) scale(1.2);
}
.slider-dots-button:focus {
    outline: none;
}
</style>
