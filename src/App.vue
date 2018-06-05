<template>
    <v-app id="inspire">
        <v-toolbar color="teal darken-2" dark fixed app>
            <router-link to="/search">
                <img class="logo" src="./assets/logo.png" alt="Logo">
            </router-link>
            <v-toolbar-title class="hidden-xs-only">Vue + RxJS</v-toolbar-title>
            <v-spacer></v-spacer>
            <v-toolbar-items>
                <v-btn flat to="/search">Search</v-btn>
                <v-btn flat to="/draggable">Draggable</v-btn>
            </v-toolbar-items>
        </v-toolbar>
        <v-content class="teal lighten-3">
            <v-container fluid class="app-container white" fill-height>
                <router-view></router-view>
            </v-container>
        </v-content>
        <v-footer color="teal darken-2" app>
            <span class="footer-text text-xs-center white--text">&copy; 2018 </span>
        </v-footer>
    </v-app>
</template>


<script>
    export default {

    }
</script>

<style>
    .container.app-container.fluid.fill-height {
        align-items: start;
        max-width: 1240px;
        padding: 30px;
    }
    .footer-text {
        padding-left: 20px;
    }
    .logo {
        display: block;
        max-height: 100%;
        height: 50px;
        box-sizing: border-box;
    }

    @media (max-width: 480px) {
        .logo {
            height: 36px;
            margin-right: 20px;
        }
    }
</style>
