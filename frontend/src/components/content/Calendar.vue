<template>
  <div class="plane-component">
    <div class="component-nav-and-content">
      <app-menu v-show="displayMenu"></app-menu>
      <div class="component-content">
        <div class="content-header">
            <div class="content-header-title-and-menu">
              <!-- <img src="../../assets/images/nav/if_menu-32.png" width="32px" class="content-header-menu"> -->
              <div @click="showMenu" class="content-header-menu">&#9776;</div>
              <p class="content-header-title">{{ $t("header.calendar") }}</p>
            </div>
        </div>
        <div class="calendar-tiles">
          <div class="calendar-tile">
            <div class="calendar">
                  <v-date-picker mode='single' :min-date="new Date()" v-model="selectedValue" :attributes="attributes" is-inline @dayclick='dayClicked'>
                  </v-date-picker>
            </div>       
            <div v-if='selectedDay' class='selected-day'>
              <div class="add-event-header">
                <h3>{{ selectedDay.date.toLocaleDateString() }}</h3>
                <button @click="openDialog" class="button modal-button add-button">{{ $t("button.add") }}</button>
              </div>
              <ul class="ul-event">
                <li v-for='attr in selectedDay.attributes' :key='attr.customData.EventId' class="delegations-inputs-section">
                  <div class="event-attr">
                        <div class="event-attr-header"> <p> {{ attr.customData.EventName }} </p> </div>
                        <div> {{ attr.customData.Description}} </div>
                        <div> {{ attr.customData.EventTime}} </div>
                        <div> {{ attr.customData.EventTypeName }} </div> 
                        <div> {{ attr.customData.EventPrivacy }} </div> 
                        <div> {{ attr.customData.Priority }} </div> 
                        <div> {{ attr.customData.DateTo}} </div> 
                  </div>    
                  <div class="events-buttons">
                      <button class="button edit-button" @click="editEvent(attr.customData, $t)">{{ $t("button.edit") }}</button>
                      <button class="button edit-button" @click="deleteEvent(attr.customData, $t)">{{ $t("button.delete") }}</button>
                  </div>
                </li>            
              </ul>
            </div>
          <!-- to    </div> -->
             <div class="filters" v-if="permition">
                <div class="ava-div-select-cool">
                    <select required class="ava-select-cool" v-model="filters.branch">        
                         <option v-for="branch in branchList" :key="branch.Key" :value="branch.Key">{{ branch.Value }}</option>
                   </select>
                     <label class="ava-select-label-cool">{{ $t("label.branch") }}</label>
                </div>
                <div class="ava-div-select-cool">
                    <select required class="ava-select-cool" v-model="filters.department">
                        <option v-for="department in departmentList" :key="department.Key" :value="department.Key">{{ department.Value }}</option>
                    </select>
                      <label class="ava-select-label-cool">{{ $t("label.department") }}</label>
                </div>
                <div class="ava-div-select-cool">
                    <select required class="ava-select-cool" v-model="filters.employee">
                         <option v-for="user in usersList" :value="user.UserAlias" :key="user.UserAlias">
                                {{ user.Fullname }}
                         </option>
                    </select>
                    <label class="ava-select-label-cool">{{ $t("label.employee") }}</label>
                    <button @click="clearFilters">{{ $t("button.clear") }}</button>
                </div>
             </div>
            <!-- Modal for add event -->
                <div class="backdrop" v-if="dialogEvent"></div>
                <div class="modal-new-m " v-if="dialogEvent">
                <div class="modal-content">
                  <div class="modal-header">
                    <h1 class="modal-title">{{ $t("header.addNewEvent") }}</h1>
                    <button class="modal-exit" @click="performDialog">&#10006;</button>
                  </div>
                  <div class="modal-calendar">
                    <div class="prof-input2">                 
                              <input required class="inputEdit2 inputProfile2 input-active" v-model="addEvent.EventName" @blur="$v.addEvent.EventName.$touch()">
                              <span class="prof-div-bar"></span>
                              <label class="label-profile2">{{ $t("label.eventTitle") }}</label>

                        <!-- <div class="error" v-if="!$v.addEvent.EventName.required">Username is required.</div> -->
                        <!-- <tree-view :data="$v.addEvent.EventName" :options="{rootObjectKey: '$v.addEvent.EventName', maxDepth: 2}"></tree-view> -->
                        <!-- <p class="prof-error" v-if="!$v.addEvent.EventName.required">{{ "halo, źle" }}</p> -->
                    </div>
                   <div class="prof-input2">               
                        <input required class="inputEdit2 inputProfile2 input-active" type="time" v-model="addEvent.EventTime">
                         <label class="label-profile2">{{ $t("label.eventTime") }}</label>
                  </div>
                  <div class="prof-input2">
                        <v-date-picker required class="delegations-input-date inputProfile2 calendar-modal-date input-active" popoverDirection="" is-expanded mode="single" v-model="addEvent.DateTo" :min-date="this.selectedDay.date">
                            <input value="addEvent.DateTo"/>
                       </v-date-picker>
                        <label class="delegations-label-cool-select">{{ $t("label.endDate") }} </label>
                        <!-- <span class="prof-div-bar"></span> -->
                        <!-- <label class="label-profile2">{{ $t("label.endDate") }}</label> -->
                  </div>
                  <div class="prof-input2">
                     <input required class="inputEdit2 inputProfile2 input-active" v-model="addEvent.Description">
                      <span class="prof-div-bar"></span>
                     <label class="label-profile2">{{ $t("label.eventDescription") }}</label>         
                  </div>
                  <div class="prof-input2">
                    <select required class="ava-select-cool marginForm input-active"  v-model="addEvent.Priority" @blur="$v.addEvent.Priority.$touch()">
                      <option v-for="priority in priorities" :value="priority.Key" :key="priority.Key">
                          {{ priority.Value }}
                      </option>
                    </select>
                       <label class="label-profile2">{{ $t("label.priority") }}</label>
                    </div>
                    <div class="prof-input2">
                      <select required class="marginForm ava-select-cool input-active" v-model="addEvent.EventType" @blur="$v.addEvent.EventType.$touch()">
                          <option v-for="eventType in eventTypes" :value="eventType.Key" :key="eventType.Key">
                            {{ eventType.Value }}
                          </option>
                      </select>
                      <label class="label-profile2">{{ $t("label.eventType") }}</label>
                    </div>
                     <div class="prof-input2">
                       <p class="click-paragraph">{{ $t("button.click") }}</p>
                        <button class="privacy-button marginForm" type="button" @click="isSelected = !isSelected"></button>
                            <label class="label-profile2">{{ $t("label.targetGroup") }}</label>
                        </div>
                                  <div class="department" v-if="isSelected">
                                   <button class="privacy-button marginForm select-button" type="button" @click="selectedUser = !selectedUser">{{ $t("button.selectUser") }}</button>
                                     <select multiple="true" class="user-list" v-if="selectedUser" v-model="addEvent.Employee">
                                         <option v-for="user in usersList" :value="user.UserAlias" :key="user.UserAlias">
                                               {{ user.Fullname }}
                                          </option>
                                    </select> 
                                   <button class="privacy-button marginForm select-button" type="button" @click="selectedGroup = !selectedGroup">{{ $t("button.selectGroup") }}</button>
                                    <select multiple="true" required class="user-list" v-if="selectedGroup" v-model="addEvent.TargetGroup">
                                          <option v-for="group in targetGroup" :value="group.Key" :key="group.Key">
                                            {{ group.Value }}
                                      </option>
                                    </select>
                    <button class="save-button" type="button" @click="isSelected = !isSelected">{{ $t("button.save") }}</button>
                    <button class="save-button clear-button" type="button" @click="backToModal">{{ $t("button.clear") }}</button>
                    </div>
                    <div class="event-feature event-visibility">
                          <label class="modal-label">{{ $t("label.visibility") }}</label>
                          <input class="input-active" type="radio" id="prv" value="PRV" v-model="addEvent.EventPrivacy" :checked="addEvent.EventPrivacy == 'PRV'" @blur="$v.addEvent.EventPrivacy.$touch()">
                          <label for="prv">{{ $t("label.private") }}</label>
                          <input class="input-active" type="radio" id="pbl" value="PBL" v-model="addEvent.EventPrivacy" :checked="addEvent.EventPrivacy == 'PBL'" @blur="$v.addEvent.EventPrivacy.$touch()">
                          <label for="pbl">{{ $t("label.public") }}</label>    
                  </div>
           </div>
           <div class="form-buttons">
               <button class="button modal-button" :disabled="$v.$invalid" type="button" @click="addNewEvent" v-if="displayButton"><span class="span-arrow">{{ $t("button.addEvent") }}</span></button>
               <button class="button modal-button" :disabled="disabledButton" @click="editForm">{{ $t("button.edit") }}</button>
          </div>
      </div>
  </div>
            <!-- End modal for add event -->
            </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import moment from "moment";
import { required } from "vuelidate/lib/validators";
import i18n from "../../lang/lang";
import Menu from '../Menu.vue'
import { mapGetters } from 'vuex';

export default {
  data() {
    return {
      selectedValue: null,
      selectedDay: null,
      selectedDay2: null,
      dialogEvent: false,
      isSelected: false,
      selectedUser: false,
      selectedGroup: false,
      permition: false,
      checkedNames: '',
      filters: {
          branch: null,
          department: null,
          employee: null
       },
       disabledButton: true,
       displayButton: true
    };
  },
  validations: {
    addEvent: {
      EventName: {
         required
      },
       Priority: {
          required
       },
       EventType: {
           required
      },
       EventPrivacy: {
           required
        }
    }
  },
  beforeCreate() {
    // if (this.$store.getters.isDataLoaded === false) {
    //         this.$store.dispatch('loadData', localStorage.getItem('token'))
    //     }
    //  this.showBranchSelect = (localStorage.getItem('role') === 'leader') ? false : true;   
    //  this.$store.dispatch('getEvents');
  },
  created() {
    this.checkRole();
    // window.addEventListener("resize", this.showMenu)
    // this.$store.dispatch('getPriority');
    // this.$store.dispatch('getEventType');
  },
  // destroyed() {
  //   window.removeEventListener("resize", this.showMenu)
  // },
  computed: {
    ...mapGetters({
      departmentList: 'getTargetGroup',
      branchList: 'branchList',
      eventTypes: 'eventTypes',
      priorities: 'priorities',
      events: 'events',
      addEvent: 'addEvent',
      usersList: 'usersList',
      targetGroup: 'getTargetGroup',
      displayMenu: "getShowMenu"
 }),
    filteredEvents() {
      let aEvents = this.events,
      aFilters = this.filters;
      let aFilteredEvents = [];


  if (aFilters.branch === null && aFilters.department === null && aFilters.employee === null) {
    return aEvents;
  } 
  else {
    let fnFilter;
          if (aFilters.department && aFilters.branch && aFilters.employee){
              fnFilter = function(oItem){
              return oItem.Department === aFilters.department && oItem.Branch === aFilters.branch && oItem.Employee === aFilters.employee;
              }
          } 
          else if (aFilters.department && aFilters.branch) {
              fnFilter = function(oItem){
            return oItem.Department === aFilters.department && oItem.Branch === aFilters.branch;
              }
          }   
          else if (aFilters.branch && aFilters.employee) {
             fnFilter = function(oItem){
              return oItem.Branch === aFilters.branch && oItem.Employee === aFilters.employee;
              }
          }
          else if (aFilters.branch) {
              fnFilter = function(oItem){
              return oItem.Branch === aFilters.branch;
              }
          }
          else if (aFilters.department) {
             fnFilter = function(oItem){
              return oItem.Department === aFilters.department;
              }
          }
          else if (aFilters.employee) {
             fnFilter = function(oItem){
              return oItem.Employee === aFilters.employee;
              }
          }
      if(fnFilter){
        aEvents = aEvents.filter(fnFilter);
      }
  }   
          return aEvents;
    },
    attributes() {
      return this.filteredEvents.map(t => ({
        dot: {
          backgroundColor: t.color
        },
        highlight: {
           backgroundColor: t.color
        },
        dates: {
          start: t.DateFrom, end: t.DateTo
        },
        customData: t,
        popover: {
          label: t.EventName
        },
      }));
    },
  },
  components: {
        'app-menu': Menu
  },
  methods: {
    showMenu(event) {
      var x = window.matchMedia("(max-width: 40rem)")
      if (x.matches && event.type === "resize") {
        this.$store.commit("SET_DISPLAY_MENU", false)
      } else {
        this.$store.commit("SET_DISPLAY_MENU", true);
      }
    },
    editForm() {
        this.$store.getters.addEvent;
        this.$store.dispatch('editEvent');
        // this.filteredEvents.
        this.performDialog();
    },
    dayClicked(day) {
      this.selectedDay = day;
    },
    openDialog() {
      this.$store.dispatch('clearForm');
      this.performDialog();
      this.displayButton = true;
    },
    performDialog() {
      this.dialogEvent = !this.dialogEvent;
    },
    editEvent(data) {
      this.performDialog();
      let editedData = data;
      Object.assign(this.$store.getters.addEvent, editedData);
      this.disabledButton = false;
      this.displayButton = false;
    },
    deleteEvent(data) {
      let editedData = data;
      Object.assign(this.$store.getters.addEvent, editedData);
     this.$store.dispatch('removeEvent')
    },
    addNewEvent() {
      this.$store.commit("SET_DATE_FROM", this.selectedValue);
      this.$store.dispatch('addNewEvent');
      this.performDialog();
    },
    // permision to filter calendar
    checkRole() {
      let role = 'BO';
      if (role == 'BO' || role == 'Board'){
        this.permition = true;
      }
    },
    clearFilters() {
      this.$store.dispatch('clearFilters');
      this.filters = this.$store.getters.clearedFilters;
    },
    backToModal(){
      this.isSelected = !this.isSelected;
      this.addEvent.Employee = '';
      this.addEvent.TargetGroup = '';
    }
  }
};
</script>

<style scoped>
.calendar {
  display: flex;
}

.selected-day {
  margin-left: 10px;
}

/* .selected-day ul li:first-child {
  margin-top: 10px;
} */

/* .selected-day ul li {
  margin-bottom: 10px;
} */
</style>
