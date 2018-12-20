<template>
  <div class="plane-component">
    <div class="component-nav-and-content">
      <app-menu v-show="displayMenu"></app-menu>
      <div class="modal-overlay" v-show="displayOverlay"></div>
      <div class="component-content">
        <div class="content-header">
          <div class="content-header-title-and-menu">
            <div @click="showMenu" class="content-header-menu">&#9776;</div>
            <p class="content-header-title">{{ $t("header.homepage") }}</p>
          </div>
        </div>
        <div class="content-body">
          <div class="news-tile">
            <div class="tile-head">
              <div class="tile-head-row">
                  <h2 class="tile-head-title">{{ $t("header.messages")}}</h2>
                  <button @click="newMessage" class="func-btn"><span class="nfb-span">&#43;</span><span class="nfbm-span">{{ $t("button.newMessage") }}</span></button>
              </div>
              <div class="tile-underscore"/>
            </div>
            <!-- <loader v-if="showAdvertsLoader"></loader> -->
            <div class="tile-content new-tile-cnt">
              <!-- <transition-group name="fly" tag="div"> -->
                <div class="news-adv-item" v-for="(advert, index) in advertsList" :key="advert.AdvertId" :id="advert.AdvertId">
                  <textarea @input="validateAdvert(advert)" :disabled="!editMode || loginAlias !== advert.CreatedBy" class="n-textarea" v-model="advert.Message"/>
                  <p class="table-p">{{formatAuthorName(advert.CreatedBy)}}</p>
                  <p class="table-p" v-if="!editMode">  {{ $t("label.messageValidTo") }} {{ formatDate(advert.ValidTo) }} </p>
                  <v-date-picker v-if="editMode && loginAlias === advert.CreatedBy" require class="cd-range" popoverDirection="bottom" mode="single" v-model="advert.ValidTo" :min-date="new Date()">
                    <input value="advert.ValidTo"/>
                  </v-date-picker>
                  <div class="advBtns">
                    <button class="clear-btn" :disabled="loginAlias !== advert.CreatedBy" @click="editAdvert(advert)">{{ $t("button.edit") }}</button>
                    <button class="clear-btn" @click="saveAdvert(advert)" :disabled="!isAdvertValid || loginAlias !== advert.CreatedBy">{{ $t("button.save") }}</button>
                    <button class="clear-btn" @click="cancelEditing(index)" :disabled="!editMode || loginAlias !== advert.CreatedBy">{{ $t("button.cancel") }}</button>
                    <button class="oclear-btn" v-if="editMode && loginAlias === advert.CreatedBy" @click="removeAdvert(advert.AdvertId)">X</button>
                  </div>
                </div>
              <!-- </transition-group> -->
              <button v-show="isMoreThanFiveAdverts && slideIndex > 5" @click="nextSlide(-1)" class="news-adv-left">&#8249;</button>
              <button v-show="isMoreThanFiveAdverts && slideIndex !== advertsList.length && !advertsList.length <= 5" @click="nextSlide(1)" class="news-adv-right">&#8250;</button>
            </div>
          </div>
          <div class="api">
            <div class="content-event">
              <div class="tile-head">
                <div class="tile-head-row">
                  <h2 class="tile-head-title">{{ $t("news.upcomingEvents") }}</h2>
                </div>
                <div class="tile-underscore"/>
              </div>
              <div class="tile-content">
                <div v-for="(event, index) in eventsSrt" :key='index' class="single-event">
                  <div class="low-prio-event" v-if="event.Priority=='L'"> </div>
                  <div class="medium-prio-event" v-if="event.Priority=='M'"> </div>
                  <div class="high-prio-event" v-if="event.Priority=='H'"> </div>
                  <div class="news-evt-attr">
                    <div class="event-date">{{setDateTo(event)}}
                      <button class="event-desc" v-if="event.Description" @mouseenter="setEventDesc(event.EventId)" :title="eventDesc">&#8943;</button>
                    </div>
                    <div class="event-title">{{ event.EventName }}</div>
                    <div class="event-type">{{event.EventTypeName}}</div>
                  </div>
                  <div class="homeoffice-event" v-if="event.EventTypeName=='Home Office'"/>
                  <div class="party-event" v-if="event.EventTypeName=='Integration Party'"/>
                  <div class="leave-event" v-if="event.EventTypeName=='Leave'"/>
                  <div class="training-event" v-if="event.EventTypeName=='Training'"/>
                  <div class="none-event" v-if="event.EventTypeName==''"/>
                </div>
              </div>
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
              <div>
                <div class="weather-header"></div>
                <div class="temp">
                  <p> {{ weatherData.celcius }} <sup>o</sup>C </p>
                </div>
              </div>
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
    <toast ref="toast" v-if="showToast">{{sliderToast}}</toast>
    <new-message v-if="showNewMessage"></new-message>
  </div>
</template>

<script>
import Menu from "../Menu.vue";
import { mapGetters } from "vuex";
import { mapActions } from "vuex";
import i18n from "../../lang/lang";
import moment from "moment";
import Toast from "../dialogs/Toast";
import NewMessageDialog from "../dialogs/NewMessageDialog";
import Loader from '../dialogs/Loader.vue';
import Modal from '../dialogs/MessageLogDialog';
let utils = require("../../utils");

export default {
  data() {
    return {
      newAdvert: null,
      slideIndex: 5,
      repeatSlider: true,
      editMode: false,
      beforeEditingCache: null,
      stop: i18n.t("button.stopSlider"),
      start: i18n.t("button.startSlider"),
      sliderToast: i18n.t("message.stoppedSlider"),
      isAdvertValid: false,
      isMoreThanFiveAdverts: true,
      advertLoaded: this.$store.getters.getShowAdverts,
      loading: true,
      loginAlias: localStorage.getItem("id"),
      eventDesc: null
    };
  },
  updated() {
    this.runCarosuel();
    this.isMoreThanFiveAdverts = this.advertsList.length > 5 ? true : false;
  },
  beforeCreate() {
    this.$store.dispatch("geoLoc");
  },
  created() {
    this.getToday();
    this.getNews();
    this.$store.commit('SET_PROMISE_TO_READ', this.$store.getters.getNewsToRead);
    this.$store.dispatch('getData', null);
    this.$store.commit('SET_ADVERTS_LOADER', true);
    utils.checkAuthLink(this.$router, this.$store.getters.getUserAuth.ZMENU);
  },
  destroyed() {
    clearInterval(this.interval);
  },
  components: {
    "app-menu": Menu,
    "loader": Loader,
    toast: Toast,
    "new-message": NewMessageDialog,
    "modal": Modal
  },
  computed: {...mapGetters({
      geoLocation2: "geoLocation2",
      weatherData: "weatherData",
      today: "today",
      articlesRaw: "articlesRaw",
      articlesJson: "articlesJson",
      rticles: "articles",
      displayMenu: "getShowMenu",
      displayOverlay: "getShowMenuOverlay",
      events: "getAllEvents",
      showToast: "getDisplayToast",
      showNewMessage: "getShowNewMessageDialog",
      advertsList: "getAdverts",
      usersList: "usersList",
      getShowAdverts: "getShowAdverts",
      showAdvertsLoader: "getAdvertsLoader",
      advertsLoaded: "getInitialDataReaded"
    }),
    eventsSrt() {
      this.events.sort((a,b) => (a.DateFrom > b.DateFrom) ? 1 : ((b.DateFrom > a.DateFrom) ? -1 : 0));
      let addDays = function(date, days) {
          let result = new Date(date);
          result.setDate(result.getDate() + days);
          return result;
        }
      let substructDays = function(date, days) {
          let result = new Date(date);
          result.setDate(result.getDate() - days);
          return result;
        }
      let filteredEvents = this.events.filter(function(oItem) {
          let eventDays = (oItem.DateTo - oItem.DateFrom) / 86400000;
          return oItem.DateFrom > substructDays(new Date(), 1) && oItem.DateFrom < addDays(new Date(), 7)
            || new Date() > substructDays(new Date(), eventDays) && oItem.DateFrom < new Date() && oItem.DateTo > new Date()
        });
      return filteredEvents;
    }
  },
  methods: {
    ...mapActions([
      "geoLoc",
      "getWeatherData",
      "getToday",
      "getNews",
      "xmlToJson",
      "getArticles",
      "updateAdvert"
    ]),
    setDateTo(event) {
      if (event.DateTo <= event.DateFrom) {
        return moment(event.DateFrom).format("DD-MM-YYYY");
      } else {
        return (
          moment(event.DateFrom).format("DD-MM-YYYY") +
          " - " +
          moment(event.DateTo).format("DD-MM-YYYY")
        );
      }
    },
    showMenu(event) {
      let obj = { window, event };
      this.$store.dispatch("setSideMenu", obj);
    },
    newMessage() {
      this.$store.commit("SET_SHOW_NEW_MESSAGE_DIALOG", true);
    },
    editAdvert(advert) {
      this.beforeEditingCache = utils.createClone(advert);
      this.editMode = true;
      clearInterval(this.interval);
    },
    saveAdvert(advert) {
      this.editMode = false;
      const data = utils.createClone(advert);
      this.$store.dispatch("updateAdvert", data);
      this.beforeEditingCache = data;
      this.isAdvertValid = false;
    },
    removeAdvert(advertId) {
      this.$store.dispatch('removeAdvert', advertId)
      this.editMode = false;
    },
    cancelEditing(index) {
      this.advertsList[index] = this.beforeEditingCache;
      this.beforeEditingCache = {};
      this.editMode = false;
    },
    validateAdvert(advert) {
      this.isAdvertValid = advert.Message === "" || advert.ValidTo === null ? false : true;
    },
    formatDate(date) {
      return date !== null && date !== undefined
        ? moment(date).format("DD.MM.YYYY")
        : "-";
    },
    checkAuthor(author) {
      let isAuthor = localStorage.getItem("id") === author ? true : false;
      return isAuthor;
    },
    formatAuthorName(authorId) {
      for (let i = 0; i < this.usersList.length; i++) {
        if (authorId === this.usersList[i].UserAlias) {
          return this.usersList[i].Fullname;
        }
      }
    },
    /* Slides */
    nextSlide(n) {
      this.editMode = false;
      this.runCarosuel((this.slideIndex += n));
    },
    // currentSlide(n) {
    //   this.runCarosuel((this.slideIndex = n));
    // },
    runCarosuel(n) {
      var slides = document.getElementsByClassName("news-adv-item");
      if (n < 5 || n > slides.length || slides.length === 0 || slides.length <= 5 ) {
        if (n < 5 ) {this.slideIndex = 5}
        else if (n > slides.length) {this.slideIndex = slides.length}
        return
      }
      for (var i = 0; i < slides.length; i++) {
        slides[i].style.display = "none";
      }  
      if (!n) n = this.slideIndex
      for (var j = n - 5; j < this.slideIndex; j++) {
        slides[j].style.display = "flex";
      }
    },
    setEventDesc(eventId) {
      this.eventDesc = this.events.find(o => o.EventId === eventId).Description;
    }
  }
};
</script>

<style scoped>
</style>
