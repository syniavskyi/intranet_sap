<template>
    <div>
        <div class="modal-overlay"></div>
        <div class="modal-new-s">
            <div class="modal-header-new">
                <h1 class="modal-title-new">Zmień hasło</h1>
                <div @click="close" class="modal-exit-new">&#10006;</div>
            </div>
            <div class="modal-content-new">

            </div>
        </div>
    </div>
</template>

<script>
import i18n from "../../../lang/lang";
import { mapGetters } from 'vuex';
export default {
    data() {
        return {
        
        }
    },
    computed: {
        ...mapGetters({
            
        })
    },
    methods: {
        close() {
            this.$store.commit('SET_SHOW_CHANGE_PASSWORD_DIALOG', false)
        }

    }
}
</script>