<template>
<div class="request-body">
        <div> <!-- first table -->
             <table class="personal-data-table">
            <tr>
                <td class="request-fullname">
                    <input v-model="newHoliday.fullname" type="text" class="request-input request-personal-data" :placeholder="$t('label.fullName')">
                </td>
                <td>
                    <select v-model="newHoliday.city" class="request-input personal-data-select">
                        <option v-for="city in cities" :key="city" :value="city">{{city}}</option>
                    </select>
                </td>
                <td>
                    <input type="date" id="date1" v-model="newHoliday.today" class="request-input request-input-date">
                </td>
            </tr>
            <tr>
                <td>
                    <input v-model="newHoliday.address" type="text" class="request-input request-personal-data" :placeholder="$t('label.address')">
                </td>
                <td> <p class="request-label"> {{ $t("label.citySelect") }} </p></td>
                <td> <p class="request-label"> {{ $t("label.dateSelect") }} </p></td>
            </tr>
            <tr>
                <td>
                    <input v-model="newHoliday.phone" type="text" class="request-input request-personal-data" :placeholder="$t('label.phone')">
                </td>
                <td></td>
                <td></td>
            </tr>
            <tr>
                <td>
                    <input v-model="newHoliday.email" type="text" class="request-input request-personal-data" :placeholder="$t('label.email')">
                </td>
                <td></td>
                <td></td>
            </tr>
        </table>
        </div>
       <div>
           <h4 class="request-header">{{ $t("label.holidayRequest").toUpperCase() }}</h4>
           <h6 class="request-info">{{ $t("message.leaveRequest") }}</h6>
       </div>
       <div>
           <table> <!-- second table -->
            <tr>
                <td> <select v-model="newHoliday.type" class="request-input personal-data-select">
                        <option v-for="type in types" :key="type" :value="type">{{type}}</option>
                    </select>
                </td>
                <td> <input v-model="newHoliday.year" type="text" class="request-input"> </td>
                <td> <input v-model="newHoliday.dateStart" type="date" id="date2" class="request-input request-input-date" @input="countDays(newHoliday)"> </td>
                <td> <input v-model="newHoliday.dateEnd" type="date" id="date3" class="request-input request-input-date" @input="countDays(newHoliday)"> </td>
                <td> <input v-model="newHoliday.countedDays" type="text" class="request-input"> </td>
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
                         <input type="text" class="request-input">
                    </div>
                </td>
                <td></td>
                <td></td>
                <td></td>
            </tr>
            <tr rowspan="2">
                <td colspan="3">
                    <textarea class="request-input request-comments" :placeholder="$t('label.comments')" cols="30" rows="10"></textarea>
                </td>
                <td colspan="2">
                    <p class="request-signature">{{ $t("message.employeesSignature") }}</p>
                </td>
            </tr>
            <tr>
                <td colspan="3">
                    {{ $t("message.requestPermission") }}
                </td>
                <td colspan="2">
                    <p class="request-signature">{{ $t("message.authPersonSignature") }}</p>
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
import i18n from "../../lang/lang";
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
