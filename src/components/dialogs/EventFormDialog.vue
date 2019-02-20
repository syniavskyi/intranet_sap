<template>
  <div>
    <div class="modal-overlay" v-if="dialogEvent"></div>
    <div class="modal-new-m" v-if="dialogEvent">
      <div class="modal-header-new">
        <h1 class="modal-title-new">{{ $t("header.addNewEvent") }}</h1>
        <button class="modal-close" @click="performDialog">&#10006;</button>
      </div>
      <div class="modal-content-new">
        <div class="modal-calendar">
          <div class="cd-for-input-xl">
            <input required class="cd-input" v-model="addEvent.EventName" @blur="$v.addEvent.EventName.$touch()" :maxlength="40">
            <span class="cd-span"/>
            <label class="cd-label">{{ $t("label.eventTitle") }}</label>
          </div>
          <div class="cd-for-input-xl">
            <input required class="cd-input" type="time" v-model="addEvent.EventTime">
            <span class="cd-span"/>
            <label class="cd-label">{{ $t("label.eventTime") }}</label>
          </div>
          <div class="cd-for-input-xl">
            <input required class="cd-input" v-model="addEvent.Description" :maxlength="70">
            <span class="cd-span"/>
            <label class="cd-label">{{ $t("label.eventDescription") }}</label>
          </div>
          <div class="cd-for-select-xl">
            <v-date-picker required class="cd-date" popoverDirection="bottom" is-expanded mode="single" v-model="addEvent.DateFrom" :min-date="new Date()">
              <input value="addEvent.DateFrom">
            </v-date-picker>
            <label class="cd-slabel">{{ $t("label.startDate") }} </label>
          </div>
          <div class="cd-for-select-xl">
            <v-date-picker required class="cd-date" popoverDirection="bottom" is-expanded mode="single" v-model="addEvent.DateTo" :min-date="addEvent.DateFrom">
              <input value="addEvent.DateTo">
            </v-date-picker>
            <label class="cd-slabel">{{ $t("label.endDate") }} </label>
          </div>
          <div class="cd-for-select-xl">
            <select required class="cd-select" v-model="addEvent.Priority" @blur="$v.addEvent.Priority.$touch()">
              <option v-for="priority in priorities" :value="priority.Key" :key="priority.Key">{{ priority.Value }}</option>
            </select>
            <label class="cd-slabel">{{ $t("label.priority") }}</label>
          </div>
          <div class="cd-for-select-xl">
            <select required class="cd-select" v-model="addEvent.EventType" @blur="$v.addEvent.EventType.$touch()">
              <option v-for="eventType in eventTypes" :value="eventType.Key" :key="eventType.Key">{{ eventType.Value }}</option>
            </select>
            <label class="cd-slabel">{{ $t("label.eventType") }}</label>
          </div>
          <div class="cal-input">
            <button class="privacy-button" type="button" @click="isSelected = !isSelected"></button>
            <p class="click-paragraph">{{ $t("button.click") }}</p>
            <label class="cal-label">{{ $t("label.targetGroup") }}</label>
            <label v-if="addEvent.TargetGroup.length !== 0 || addEvent.Employee.length !== 0" class="cal-group-label">{{ $t("label.selected") }}</label>
          </div>
          <div class="department" v-if="isSelected">
            <div class="dep-selects">
              <label class="event-select-error" v-if="selectedGroup || selectedUser">{{ $t("label.selectInfo") }}</label>
              <button class="dep-btn" type="button" @click="selectedUser = !selectedUser && selectedGroup === false">{{ $t("button.selectUser") }}</button>
              <select multiple="true" class="user-list" v-if="selectedUser" v-model="addEvent.Employee">
                <option v-for="user in usersList" :value="user.UserAlias" :key="user.UserAlias">{{ user.Fullname }}</option>
              </select>
              <button class="dep-btn" type="button" @click="selectedGroup = !selectedGroup && selectedUser === false">{{ $t("button.selectGroup") }}</button>
              <select multiple="true" required class="user-list" v-if="selectedGroup" v-model="addEvent.TargetGroup">
                <option v-for="group in targetGroup" :value="group.Key" :key="group.Key">{{ group.Value }}</option>
              </select>
            </div>
            <footer class="department-footer">
              <button class="cal-back-btn" @click="backToModal">{{ $t("button.back") }}</button>
              <button class="cal-save-btn" @click="isSelected = !isSelected">{{ $t("button.save") }}</button>
            </footer>
          </div>
          <div class="event-feature">
            <label class="modal-label">{{ $t("label.visibility") }}</label>
            <input class="cd-rbtn" type="radio" id="prv" value="PRV" v-model="addEvent.EventPrivacy" :checked="addEvent.EventPrivacy == 'PRV'" @blur="$v.addEvent.EventPrivacy.$touch()">
            <label class="cd-Lrbtn" for="prv">{{ $t("label.private") }}</label>
            <input class="cd-rbtn" type="radio" id="pbl" value="PBL" v-model="addEvent.EventPrivacy" :checked="addEvent.EventPrivacy == 'PBL'" @blur="$v.addEvent.EventPrivacy.$touch()">
            <label class="cd-Lrbtn" for="pbl">{{ $t("label.public") }}</label>
          </div>
        </div>
        <div class="form-buttons">
          <button class="button" :disabled="$v.$invalid" type="button" @click="addNewEventBtn(addEvent)" v-if="displaySaveButton"><span class="span-arrow">{{ $t("button.addEvent") }}</span></button>
          <button class="button" :disabled="$v.$invalid" v-if="!displaySaveButton" @click="editForm(addEvent)">{{ $t("button.edit") }}</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { required } from "vuelidate/lib/validators";
import i18n from "../../lang/lang";
import { mapGetters, mapActions } from "vuex";
export default {
    data() {
     return {
        isSelected: false,
        selectedUser: false,
        selectedGroup: false,
        }
    },
    props: ['disabled-edit-button', 'display-save-button'],
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
    computed: Object.assign(
    mapGetters({
      eventTypes: "getEventTypes",
      priorities: "getPriorities",
      addEvent: "getEventToChange",
      usersList: "usersList",
      targetGroup: "getTargetGroup",
      userData: "getUserInfo",
      authType: "getCalendarAuth",
      dialogEvent: "getDialogEvent"
    }), {   }
  ),
    methods: Object.assign(
    mapActions([
      "addNewEvent",
      "editEvent",
      "performDialog"
    ]), {
        // trigger function from js to adjust data for backend
        editForm(data) {
            data.Action = 'U';
            this.editEvent(data);
             this.performDialog();
        },
        addNewEventBtn(data) {
            this.addNewEvent(data);
            this.performDialog();
        },
        // permision to filter calendar
        backToModal() {
            this.isSelected = !this.isSelected;
            this.addEvent.Employee = [];
            this.addEvent.TargetGroup = [];
        }
     }
  )
}
</script>