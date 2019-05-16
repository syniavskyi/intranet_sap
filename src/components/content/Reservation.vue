<template>
  <div class="plane-component">
      <div class="component-nav-and-content">
         <app-menu v-show="displayMenu"></app-menu>
         <div class="m-overlay" v-show="displayOverlay"></div>
         <div class="component-content">
             <div>
                <h1>{{ $t("title.roomsReservation") }}</h1>
                <vue-cal class="vuecal--green-theme"
                 :on-selected-date="onSelectedDay" :time-from="7 * 60" :time-to="19 * 60" :disable-views="['years', 'day']"
                    default-view="month" events-on-month-view="short"
                    :events="events" :on-event-click="onEventClick" >
                </vue-cal>
                <div>
                  <div>
                <!-- <v-dialog v-model="showDialog"> -->
                  <!-- <v-card> -->
                    <div>
                    <!-- <v-card-title> -->
                      <div>
                        <!-- <v-icon>{{ selectedEvent.icon }}</v-icon> -->
                        <span>{{ selectedEvent.title }}</span>
                        <!-- <v-spacer/> -->
                        <strong>{{ selectedEvent.startDate }}</strong>
                      </div>
                    <!-- </v-card-title> -->
                    <!-- <v-card-text> -->
                      <div>
                        <p v-html="selectedEvent.contentFull"/>
                        <strong>Event details:</strong>
                        <ul>
                          <li>Event starts at: {{ selectedEvent.startTime }}</li>
                          <li>Event ends at: {{ selectedEvent.endTime }}</li>
                        </ul>
                      </div>
                    <!-- </v-card-text> -->
                     </div>
                  <!-- </v-card> -->
                <!-- </v-dialog> -->
                </div>
             </div>
         </div>
      </div>
  </div>
  </div>
</template>

<script>
import Menu from "../Menu.vue";
import i18n from "../../lang/lang";
import { mapGetters, mapActions } from "vuex";
const utils = require("../../utils");

export default {
    data() {
      return {
        selectedEvent: {},
        showDialog: false,
        events: [
          {
            start: '2019-05-20 14:00',
            end: '2019-05-20 18:00',
            title: 'Need to go shopping',
            icon: 'shopping_cart', // Custom attribute.
            content: 'Click to see my shopping list',
            contentFull: 'My shopping list is rather long:<br><ul><li>Avocadoes</li><li>Tomatoes</li><li>Potatoes</li><li>Mangoes</li></ul>', // Custom attribute.
            class: 'leisure'
          },
          {
            start: '2019-05-15 10:00',
            end: '2019-05-15 15:00',
            title: 'Golf with John',
            icon: 'golf_course', // Custom attribute.
            content: 'Do I need to tell how many holes?',
            contentFull: 'Okay.<br>It will be a 18 hole golf course.', // Custom attribute.
            class: 'sport'
          }
        ]
      }
  },
    components: {
        "app-menu": Menu,
        "vue-cal": vuecal
    },
    created() {
      const oStore = this.$store;
      oStore.commit("SET_PROMISE_TO_READ", oStore.getters.getRoomsReservationsToRead);
      oStore.dispatch("getData", null);
      utils.checkAuthLink(this.$router, oStore.getters.getUserAuth.ZMENU);
  },
   computed: {
    ...mapGetters({
      displayMenu: "getShowMenu",
      displayOverlay: "getShowMenuOverlay"
    })
  },
  methods: {
  onEventClick (event, e) {
    this.selectedEvent = event
    this.showDialog = true

    // Prevent navigating to narrower view (default vue-cal behavior).
    e.stopPropagation()
  },
  onSelectedDay(event) {
    let elo;
  }
}
};
</script>

<style scoped>
.vuecal--month-view .vuecal__cell {height: 80px;}

.vuecal--month-view .vuecal__cell-content {
  justify-content: flex-start;
  height: 100%;
  align-items: flex-end;
}

.vuecal--month-view .vuecal__cell-date {padding: 4px; color:pink;}
.vuecal--month-view .vuecal__no-event {display: none;}
.sport {
  background: blue;
}
</style>