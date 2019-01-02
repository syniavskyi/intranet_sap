<template>
<div class="request-body">
        <div> <!-- first table -->
             <table class="personal-data-table">
            <tr>
                <td class="request-fullname">
                    <input v-model="newHoliday.fullname" type="text" class="request-ipnut request-personal-data" :placeholder="$t('label.fullName')">
                </td>
                <td>
                    <select v-model="newHoliday.city" class="request-ipnut personal-data-select">
                        <option v-for="city in cities" :key="city" :value="city">{{city}}</option>
                    </select>
                </td>
                <td>
                    <input type="date" v-model="newHoliday.today" class="request-ipnut">
                </td>
            </tr>
            <tr>
                <td>
                    <input v-model="newHoliday.address" type="text" class="request-ipnut request-personal-data" :placeholder="$t('label.address')">
                </td>
                <td> <p class="request-label"> {{ $t("label.citySelect") }} </p></td>
                <td> <p class="request-label"> {{ $t("label.dateSelect") }} </p></td>
            </tr>
            <tr>
                <td>
                    <input v-model="newHoliday.phone" type="text" class="request-ipnut request-personal-data" :placeholder="$t('label.phone')">
                </td>
                <td></td>
                <td></td>
            </tr>
            <tr>
                <td>
                    <input v-model="newHoliday.email" type="text" class="request-ipnut request-personal-data" :placeholder="$t('label.email')">
                </td>
                <td></td>
                <td></td>
            </tr>
        </table>
        </div>
       <div>
           <h4 class="request-header">{{ $t("label.holidayRequest") }}</h4>
           <h6 class="request-info">Proszę o udzielenie urlopu:</h6>
       </div>
       <div>
           <table> <!-- second table -->
            <tr>
                <td> <select v-model="newHoliday.type" class="request-ipnut personal-data-select">
                        <option v-for="type in types" :key="type" :value="type">{{type}}</option>
                    </select> 
                </td>
                <td> <input v-model="newHoliday.year" type="text" class="request-ipnut"> </td>
                <td> <input v-model="newHoliday.dateStart" type="date" class="request-ipnut" @input="countDays(newHoliday)"> </td>
                <td> <input v-model="newHoliday.dateEnd" type="date" class="request-ipnut" @input="countDays(newHoliday)"> </td>
                <td> <input v-model="newHoliday.countedDays" type="text" class="request-ipnut"> </td>
            </tr>
            <tr>
                <td> <p class="request-label"> {{ $t("label.requestTypeSelect") }}</p> </td>
                <td> <p class="request-label"> {{ $t("label.yearSelect") }}</p> </td>
                <td> <p class="request-label"> {{ $t("label.dayFromSelect") }} </p></td>
                <td> <p class="request-label"> {{ $t("label.dayToSelect") }}</p> </td>
                <td> <p class="request-label"> {{ $t("label.daysCountSelect") }}</p> </td>
            </tr>
            <tr>
                <td colspan="2">
                    <div class="request-for-day">{{ $t("label.forDay") }}
                         <input type="text" class="request-ipnut">
                    </div>
                </td>
                <td></td>
                <td></td>
                <td></td>
            </tr>
            <tr rowspan="2">
                <td colspan="3">
                    <textarea class="request-ipnut request-comments" :placeholder="$t('label.comments')" cols="30" rows="10"></textarea>
                </td>
                <td colspan="2">
                    <p class="request-signature">Podpis pracownika</p>
                </td>
            </tr>
            <tr>
                <td colspan="3">
                    Wyrażam zgodę na urlop we wskazanym terminie
                </td>
                <td colspan="2">
                    <p class="request-signature">Podpis osoby upoważnionej</p>
                </td>
            </tr>
        </table>
       </div>
       <div>
           <p class="request-footer">BTech Sp. z o. o., 54-203 Wrocław, ul. Legnicka 57D lokal B/A, NIP 8942908985</p>
       </div>
 </div>   
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import i18n from "../../../lang/lang";
import moment from "moment";
export default {
    name: 'holidayRequestTemplate',
     created() {
         this.countDays(this.$store.getters.getHoliday);
    },
    computed: {
        ...mapGetters({
            cities: "getCityToHolidayRequest",
            types: "getTypesToHolidayRequest",
            newHoliday: "getHoliday"
        })
    },
    methods: {
        ...mapActions([]),
        countDays(holiday) {
           holiday.countedDays = ((new Date(holiday.dateEnd) - new Date(holiday.dateStart)) / 86400000) + 1;
        }
    }
}

</script>

<style>

</style>
