<template>
<div>
    <div class="modal-new">
        <div class="modal-content">
            <button @click="hideDialog"> X </button>
            <p>Czy chcesz zatwierdzić delegację? Upewnij się, że wprowadzone dane są prawidłowe.</p>
            <p v-if="!isSuccess">Pomyślnie zapisano dane delegacji</p>
            <p v-if="isSuccess">Niepowodzenie podczas zapisu numeru delegacji</p>
            <button @click="saveDelegationNumber">Tak</button>
            <button @click="hideDialog">Nie, chcę wprowadzić zmiany</button>
        </div>
    </div>
    <div class="modal-overlay"></div> 
</div>
</template>
<script>
import { mapGetters, mapActions } from 'vuex';
export default {
    computed: {
        ...mapGetters({
            newDelegation: 'getNewDelegation',
            isSuccess: 'getCreateDelegSuccess'
        })
    },
    methods: {
        ...mapActions(['saveDelegationNumber']),
        hideDialog() {
            this.$store.commit('SET_SHOW_CONFIRM_DELEG', false)
        }
    }
}
</script>

