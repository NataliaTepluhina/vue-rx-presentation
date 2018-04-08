import Vue from "vue";
import Router from "vue-router";
import Search from "./views/Search";
import Draggable from "./views/Draggable";
import Api from "./views/Api";

Vue.use(Router);

export default new Router({
    routes: [
        {
            path: "/search",
            component: Search
        },
        {
            path: "/draggable",
            component: Draggable
        },
        {
            path: "/api",
            component: Api
        },
        {
            path: "/",
            redirect: "/search"
        },
    ]
});
