<template>
    <div class="delegations-tile">
        <div id="del-tile-head-1" class="delegations-tile-header">
            <div @click.self="toggleTile" class="delegations-tile-title">
                {{ $t("header.travelExp") }}
                <button class="del-add-row" @click="addRow">{{ $t("button.addRow") }}</button>
            </div>
            <div class="tile-underscore"></div>
        </div>
        <div id="del-tile-content-1" class="delegations-tile-content">
            <div class="delegations-table-1">
                <header class="del-thead-1">
                    <div class="del-table-row">
                        <div class="del-thead-title">{{ $t("table.delegations.leave") }}</div>
                        <div class="del-table-items">
                            <div class="del-table-item">{{ $t("table.delegations.place") }}</div>
                            <div class="del-table-item">{{ $t("table.delegations.date") }}</div>
                            <div class="del-table-item">{{ $t("table.delegations.time") }}</div>
                        </div>
                    </div>
                    <div class="del-table-row">
                        <div class="del-thead-title">{{ $t("table.delegations.arrival") }}</div>
                        <div class="del-table-items">
                            <div class="del-table-item">{{ $t("table.delegations.place") }}</div>
                            <div class="del-table-item">{{ $t("table.delegations.date") }}</div>
                            <div class="del-table-item">{{ $t("table.delegations.time") }}</div>
                        </div>
                    </div>
                    <div class="del-table-btns"></div>
                </header>
                <!-- first default row -->
                <section class="del-tbody-1">
                    <div class="del-table-row">
                        <div class="del-tbody-title">{{ $t("table.delegations.leave") }}</div>
                        <div class="del-table-items">
                            <div class="del-tbody-wrap">
                                <div class="del-tbody-title">{{ $t("table.delegations.place") }}</div>
                                <div class="del-tbody-item">
                                    <div class="del-tbody-item-wrap">
                                        <input required class="cd-input" placeholder="" id="firstLeavePlace" v-model="defaultCostsData.firstLeavePlace"  onfocus="value = ''">
                                        <!-- v-on:input="checkFormFields()" -->
                                        <span class="cd-span"/>
                                        <!-- <select class="delegations-tselect" @change="checkDelegationTable" v-model="defaultCostsData.firstLeavePlace">
                                            <option v-for="department in departmentList" :key="department.depId" :value="department.depId">{{ department.depName }}</option>
                                        </select> -->
                                    </div>
                                </div>
                            </div>
                            <div class="del-tbody-wrap">
                                <div class="del-tbody-title">{{ $t("table.delegations.date") }}</div>
                                <div class="del-tbody-item">{{ delegationStartDate }} </div>
                            </div>
                            <div class="del-tbody-wrap">
                                <div class="del-tbody-title">{{ $t("table.delegations.time") }}</div>
                                <div class="del-tbody-item">
                                    <input class="cd-tinput-time" :disabled="delegationStartDate === null ? true : false" type="time" v-model="defaultCostsData.firstLeaveHour" @change="countAllowance" placeholder="" onfocus="value = ''">
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="del-table-row">
                        <div class="del-tbody-title">{{ $t("table.delegations.arrival") }}</div>
                        <div class="del-table-items">
                            <div class="del-tbody-wrap">
                                <div class="del-tbody-title">{{ $t("table.delegations.place") }}</div>
                                <div class="del-tbody-item">{{ newDelegation.destination}}</div>
                            </div>
                            <div class="del-tbody-wrap">
                                <div class="del-tbody-title">{{ $t("table.delegations.date") }}</div>
                                <div class="del-tbody-item">{{ delegationStartDate }}</div>
                            </div>
                            <div class="del-tbody-wrap">
                                <div class="del-tbody-title">{{ $t("table.delegations.time") }}</div>
                                <div class="del-tbody-item">
                                    <input class="cd-tinput-time" :disabled="delegationStartDate === null ? true : false" type="time" v-model="defaultCostsData.firstArrivalHour" @change="countAllowance">
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="del-tbody-cols">
                        <div class="del-tbody-title"></div>
                        <div class="del-tbody-col"></div>
                    </div>
                </section>
                <!-- second default row  -->
                <section class="del-tbody-1">
                    <div class="del-table-row">
                        <div class="del-tbody-title">{{ $t("table.delegations.leave") }}</div>
                        <div class="del-table-items">
                            <div class="del-tbody-wrap">
                                <div class="del-tbody-title">{{ $t("table.delegations.place") }}</div>
                                <div class="del-tbody-item">{{ newDelegation.destination}}</div>
                            </div>
                            <div class="del-tbody-wrap">
                                <div class="del-tbody-title">{{ $t("table.delegations.date") }}</div>
                                <div class="del-tbody-item">{{ delegationEndDate}} </div>
                            </div>
                            <div class="del-tbody-wrap">
                                <div class="del-tbody-title">{{ $t("table.delegations.time") }}</div>
                                <div class="del-tbody-item">
                                    <input class="cd-tinput-time" :disabled="delegationEndDate === null ? true : false" type="time" v-model="defaultCostsData.secondLeaveHour" @change="countAllowance"> 
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="del-table-row">
                        <div class="del-tbody-title">{{ $t("table.delegations.arrival") }}</div>
                        <div class="del-table-items">
                            <div class="del-tbody-wrap">
                                <div class="del-tbody-title">{{ $t("table.delegations.place") }}</div>
                                <div class="del-tbody-item">
                                    <div class="del-tbody-item-wrap">
                                        <input class="cd-input" v-model="defaultCostsData.secondArrivalPlace" required>
                                        <span class="cd-span"/>
                                        <!-- <select class="delegations-tselect" @change="checkDelegationTable" v-model="defaultCostsData.secondArrivalPlace">
                                            <option v-for="department in departmentList" :key="department.depId" :value="department.depId">{{ department.depName }}</option>
                                        </select> -->
                                    </div>
                                </div>
                            </div>
                            <div class="del-tbody-wrap">
                                <div class="del-tbody-title">{{ $t("table.delegations.date") }}</div>
                                <div class="del-tbody-item">{{ delegationEndDate }}</div>
                            </div>
                            <div class="del-tbody-wrap">
                                <div class="del-tbody-title">{{ $t("table.delegations.time") }}</div>
                                <div class="del-tbody-item">
                                    <input class="cd-tinput-time" :disabled="delegationEndDate === null ? true : false" type="time" v-model="defaultCostsData.secondArrivalHour" @change="countAllowance">
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="del-tbody-cols">
                        <div class="del-tbody-title"></div>
                        <div class="del-tbody-col"></div>
                    </div>
                </section>
                <!-- rows that are added -->
                <section class="del-tbody-1" v-for="(cost, index) in customCosts" :key="index">
                    <div class="del-table-row">
                        <div class="del-tbody-title">{{ $t("table.delegations.leave") }}</div>
                        <div class="del-table-items">
                            <div class="del-tbody-wrap">
                                <div class="del-tbody-title">{{ $t("table.delegations.place") }}</div>
                                <div class="del-tbody-item">
                                    <div class="del-tbody-item-wrap">
                                        <input class="cd-input" @input="checkDelegationTable" :disabled="customCosts[index].dates === null ? true : false" v-model="customCosts[index].leavePlace">
                                        <span class="cd-span"/>
                                    </div>
                                </div>
                            </div>
                            <div class="del-tbody-wrap">
                                <div class="del-tbody-title">{{ $t("table.delegations.date") }}</div>
                                <div class="del-tbody-item" @mouseover="setOverflow" @mouseout="outOverflow">
                                    <v-date-picker class="cd-tdate" @input="checkDelegationTable" mode="single" v-model="customCosts[index].leaveDate">
                                        <input value="customCosts[index].leaveDate">
                                    </v-date-picker>
                                </div>
                            </div>
                            <div class="del-tbody-wrap">
                                <div class="del-tbody-title">{{ $t("table.delegations.time") }}</div>
                                <div class="del-tbody-item">
                                    <input class="cd-tinput-time" type="time" :disabled="delegationEndDate === null ? true : false" v-model="customCosts[index].leaveHour" @change="checkDelegationTable">
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="del-table-row">
                        <div class="del-tbody-title">{{ $t("table.delegations.arrival") }}</div>
                        <div class="del-table-items">
                            <div class="del-tbody-wrap">
                                <div class="del-tbody-title">{{ $t("table.delegations.place") }}</div>
                                <div class="del-tbody-item">
                                    <div class="del-tbody-item-wrap">
                                        <input class="cd-input" @input="checkDelegationTable" :disabled="customCosts[index].dates === null ? true : false" v-model="customCosts[index].arrivalPlace" required>
                                        <span class="cd-span"/>
                                    </div>
                                </div>
                            </div>
                            <div class="del-tbody-wrap">
                                <div class="del-tbody-title">{{ $t("table.delegations.date") }}</div>
                                <div class="del-tbody-item" @mouseover="setOverflow" @mouseout="outOverflow">
                                    <v-date-picker class="cd-tdate" @input="checkDelegationTable" mode="single" v-model="customCosts[index].arrivalDate">
                                        <input value="customCosts[index].arrivalDate">
                                    </v-date-picker>
                                </div>
                            </div>
                            <div class="del-tbody-wrap">
                                <div class="del-tbody-title">{{ $t("table.delegations.time") }}</div>
                                <div class="del-tbody-item">
                                    <input class="cd-tinput-time" type="time" :disabled="delegationEndDate === null ? true : false" v-model="customCosts[index].arrivalHour" @change="checkDelegationTable">
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="del-tbody-cols">
                        <div class="del-tbody-title"></div>
                        <div class="del-tbody-col">
                            <button class="btn-row" @click="removeRow(index)">{{ $t("button.delete") }}</button>
                        </div>
                    </div>
                </section>
            </div>
        </div>
    </div>
</template>
<script>
import VueGoogleAutocomplete from "vue-google-autocomplete";
import moment from "moment";
import { mapGetters, mapActions } from "vuex";
export default {
  computed: {
    ...mapGetters({
        departmentList: "getDepartmentList",
        customCosts: "getDelegationCostsList",
        defaultCostsData: "getDefaultCostsData",
        currencyList: "getCurrencyList",
        newDelegation: "getNewDelegation"
    }),
    delegationStartDate() {
        if (this.newDelegation.dates) {
            return moment(this.newDelegation.dates.start).format("DD.MM.YYYY");
        } else {
            return null;
        }
    },
    delegationEndDate() {
        if (this.newDelegation.dates) {
            return moment(this.newDelegation.dates.end).format("DD.MM.YYYY");
        } else {
            return null;
        }
    }
  },
  updated() {
    this.$nextTick(() => {
      this.calcHeight(this.$el.lastChild, this.$el.lastChild.firstChild).then(
        height => {
          this.$el.lastChild.style.height = height;
          this.$el.lastChild.style.opacity = "1";
        }
      );
    });
  },
  mounted() {
    this.$nextTick(function() {
      window.addEventListener("resize", this.getWindowWidth);
      this.getWindowWidth();
    });
  },
  components: { VueGoogleAutocomplete },
  methods: {
    ...mapActions({
      addRow: "addDelegationRow",
      removeRow: "removeDelegationRow",
      checkDelegationTable: "checkDelegationTable",
      countAllowance: "countAllowance"
    }),
    /* Adding and hiding overflow of tile content to display datepicker  */
    setOverflow() {
        this.$store.dispatch("setVisibleOverflow", this.$el)
    },
    outOverflow() {
        this.$store.dispatch("setHiddenOverflow", this.$el)
    },
    /* Accordion tiles showing and hiding content when clicking on tile header */
    toggleTile() {
      let el = this.$el.lastChild,
        elChild = el.firstChild;
      const name = { el, elChild };
      this.$store.dispatch("toggleTile", name);
    },
    calcHeight(el, elChild) {
      const name = { el, elChild };
      let height = this.$store.dispatch("calcHeight", name);
      return height;
    },
    addRow() {
      let el = this.$el.lastChild.style.height;
      !el || el ? (el = "auto") : "";
      this.$store.dispatch("addDelegationRow");
    },
    removeRow() {
      this.$el.lastChild.style.height = "auto";
      this.$store.dispatch("removeDelegationRow");
    },
    getWindowWidth() {
      this.windowWidth = document.documentElement.clientWidth;
      let el = this.$el;
      const name = { el };
      this.$store.dispatch("checkWidthAndToggle", name);
    }
  },
  beforeDestroy() {
    window.removeEventListener("resize", this.getWindowWidth);
  }
};
</script>

