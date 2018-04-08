import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import "./registerServiceWorker";
import 'vuetify/dist/vuetify.min.css'
import Vuetify from 'vuetify'
import Rx from 'rxjs/Rx'
import VueRx from 'vue-rx'
Vue.use(VueRx, Rx);

Vue.use(Vuetify);

Vue.config.productionTip = false;

new Vue({
    router,
    render: h => h(App)
}).$mount("#app");
