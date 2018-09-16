import Vue from 'vue';
import Router from 'vue-router';
import Search from './views/Search';
import Draggable from './views/Draggable';

Vue.use(Router);

export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/search',
      component: Search,
    },
    {
      path: '/draggable',
      component: Draggable,
    },
    {
      path: '/',
      redirect: '/search',
    },
  ],
});
