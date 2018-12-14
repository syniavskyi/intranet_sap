<template>
    <div class="plane-nav">
        <!-- <div class="modal-overlay-menu"></div> -->
        <div class="nav-header">
            <button class="logout-button" @click="logout">
                <span class="logout-text">wyloguj</span>
            </button> 
            <p class="nav-title">BTech</p>
            <button @click="closeMenu" class="close-btn">&#10006;</button>
        </div>
        <div class="nav-user">
            <div class="picture-loader" v-if="!userPhotoUrl">
            </div>
            <img class="nav-user-img" width="130px" :src="userPhotoUrl">
        </div>
        <nav class="nav">
            <ul class="nav-list">
                <li v-if="menuAuth.home">
                    <router-link class="nav-router-link" to="/news">
                        <button @click="closeMenu" class="nav-item">
                            <img class="nav-item-img" src="../assets/images/nav3/grey_616161/home-g-24.png">
                            <p>{{ $t("header.home") }}</p>
                        </button>
                    </router-link>
                </li>
                <li v-if="menuAuth.profile">
                    <router-link class="nav-router-link" to="/profile">
                        <button @click="closeMenu" class="nav-item">
                            <img class="nav-item-img" src="../assets/images/nav3/grey_616161/account-g-24.png">
                            <p>{{ $t("header.profile") }}</p>
                        </button>
                    </router-link>
                </li>
                <!-- <li>
                    <router-link class="nav-router-link" to="/news">
                        <button class="nav-item">
                            <img class="nav-item-img" src="../assets/images/nav3/grey_616161/view-dashboard-g-24.png">
                            <p>{{ $t("header.news") }}</p>
                        </button>
                    </router-link>
                </li> -->
                <li v-if="menuAuth.calendar">
                    <router-link class="nav-router-link" to="/calendar">
                        <button @click="closeMenu" class="nav-item">
                            <img class="nav-item-img" src="../assets/images/nav3/grey_616161/calendar-text-g-24.png">
                            <p>{{ $t("header.calendar") }}</p>
                        </button>
                    </router-link>
                </li>
                <li v-if="menuAuth.employees">
                    <router-link class="nav-router-link"  to="/employees">
                        <button @click="closeMenu" class="nav-item">
                            <img class="nav-item-img" src="../assets/images/nav3/grey_616161/account-multiple-g-24.png">
                            <p>{{ $t("header.employees") }}</p>
                        </button>
                    </router-link>
                </li>
                <!-- <li>
                    <router-link class="nav-router-link" to="/informations">
                        <button class="nav-item">
                            <img class="nav-item-img" src="../assets/images/nav3/grey_616161/information-g-24.png">
                            <p>{{ $t("header.informations") }}</p>
                        </button>
                    </router-link>
                </li> -->
                <li v-if="menuAuth.documents">
                    <router-link class="nav-router-link" to="/files">
                        <button @click="closeMenu" class="nav-item">
                            <img class="nav-item-img" src="../assets/images/nav3/grey_616161/file-g-24.png">
                            <p>{{ $t("header.documents") }}</p>
                        </button>
                    </router-link>
                </li>
                <li v-if="menuAuth.availability">
                    <router-link class="nav-router-link" to="/availability">
                        <button @click="closeMenu" class="nav-item">
                             <img class="nav-item-img" src="../assets/images/nav3/grey_616161/account-search-g-24.png">
                             <p>{{ $t("header.availability") }}</p>
                        </button>
                    </router-link>
                </li>
                <li v-if="menuAuth.delegations">
                    <router-link class="nav-router-link" to="/delegations">
                        <button @click="closeMenu" class="nav-item">
                             <img class="nav-item-img" src="../assets/images/nav3/grey_616161/car-g-24.png">
                             <p>{{ $t("header.delegations") }}</p>
                        </button>
                    </router-link>
                </li>
                <li v-if="menuAuth.registration">
                    <router-link class="nav-router-link" to="/registration">
                        <button @click="closeMenu" class="nav-item">
                             <img class="nav-item-img" src="../assets/images/nav3/grey_616161/account-plus-24.png">
                             <p>{{ $t("header.registration") }}</p>
                        </button>
                    </router-link>
                </li>
            </ul>
        </nav>        
    </div>
</template>

<script>
import { mapGetters } from 'vuex'
const utils = require("../utils")
export default {
    computed: {
       ...mapGetters({
        userPhotoUrl: 'getUserPhotoUrl',
        menuAuth: 'getMenuAuth'
      })
    },
    methods: {
        logout() {
            this.$store.dispatch('logout')
        },

        closeMenu() {
            if (window.matchMedia("(max-width: 40rem)").matches) {
                this.$store.commit("SET_DISPLAY_MENU", false)
                this.$store.commit("SET_MENU_OVERLAY", false)
            }
        }
    }
}

</script>

<style>
.modal-overlay-menu {
    display: flex;
    position: absolute;
    z-index: 100;
    top:0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.384);
}
</style>
